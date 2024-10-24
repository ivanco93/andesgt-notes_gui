import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { User } from '../model/user';
import { LoginService } from '../services/user/login.service';
import { AuthResponse } from '../model/auth-response';
import { Router} from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  loading: Boolean = false;
  errorMessage: string = "";
  constructor(
    private loginService: LoginService,
    private router: Router
  ){
  }
  ngOnInit(): void {
    this.checkSession();
  }

  user: User = {
    username: '',
    password: ''
  }

  loginForm: FormGroup = new FormGroup({
    username: new FormControl({value: this.user.username, disabled: false}, [
      Validators.required,
      Validators.maxLength(20)
    ]),
    password: new FormControl({value: this.user.password, disabled: false}, [
      Validators.required,
      Validators.maxLength(20)
    ])
  });

  checkSession() {
    this.loading = true;
    this.errorMessage = "";
    const access_token = localStorage.getItem("access-token");
    if (access_token !== "") {
      this.loginService.refresh({
        refresh: localStorage.getItem("refresh-token") ?? ''
      }).subscribe({
        next: (response: AuthResponse) => {
          this.loading = false;
          localStorage.setItem("access-token", response.access);
          this.router.navigate(['notes']);
        },
        error: (httpError: HttpErrorResponse) => {
          this.loading = false;
          localStorage.removeItem("refresh-token");
          localStorage.removeItem("access-token");
        }
      });
    } else {
      localStorage.removeItem("refresh-token");
      localStorage.removeItem("access-token");
    }
  }

  onSave() {
    this.loading = true;
    this.errorMessage = "";
    this.user = this.loginForm.getRawValue();
    this.loginService.auth(this.user).subscribe({
      next: (response: AuthResponse) => {
        this.loading = false;
        localStorage.setItem("access-token", response.access);
        localStorage.setItem("refresh-token", response.refresh??'');
        this.router.navigate(['notes']);
      },
      error: (httpError: HttpErrorResponse) => {
        this.loading = false;
        this.errorMessage = httpError.error["detail"];
      }
    });
  }
}
