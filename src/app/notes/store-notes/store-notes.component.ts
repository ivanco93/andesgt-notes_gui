import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router, Params} from '@angular/router';
import { CommonModule } from '@angular/common';
import { Note } from '../../model/note';
import { NoteService } from '../../services/note/note.service';

@Component({
  selector: 'app-store-notes',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './store-notes.component.html',
  styleUrl: './store-notes.component.css'
})
export class StoreNotesComponent implements OnInit{
  noteId: any = null;
  loading: Boolean = false;
  creatingMode: Boolean = true;
  errorMessage: string = "";
  note: Note = {
    title: '',
    description: '',
    status: 'PENDING'
  }
  constructor(
    private noteService: NoteService,
    private router: Router,
    private route: ActivatedRoute,
  ){
  }

  ngOnInit(): void {
    this.route.params.forEach((params: Params) => {
      let id = params['id'];
      this.noteId = id;
      if(typeof id != "undefined"){
        this.creatingMode = false;
        this.noteService.find(id).subscribe({
          next: (response: Note) => {
            this.loading = false;
            this.note = response;
            this.noteForm.get("title")?.setValue(this.note.title);
            this.noteForm.get("description")?.setValue(this.note.description);
            this.noteForm.get("status")?.setValue(this.note.status);
          },
          error: (httpError: HttpErrorResponse) => {
            this.loading = false;
            this.errorMessage = httpError.error["detail"];
          }
        });
      }
    });
  }

  noteForm: FormGroup = new FormGroup({
    title: new FormControl({value: this.note.title, disabled: false}, [
      Validators.required,
      Validators.maxLength(20)
    ]),
    description: new FormControl({value: this.note.description, disabled: false}, [
      Validators.required,
      Validators.maxLength(20)
    ])
    ,
    status: new FormControl({value: this.note.description, disabled: false}, [
      Validators.required,
      Validators.maxLength(20)
    ])
  });

  

  onSave() {
    this.loading = true;
    this.errorMessage = "";
    this.note = this.noteForm.getRawValue();
    if(!this.creatingMode)
      this.note.id = this.noteId;
    if(this.creatingMode){
      this.noteService.store(this.note).subscribe({
        next: (response: Note) => {
          this.loading = false;
          this.goToMainMenu();
        },
        error: (httpError: HttpErrorResponse) => {
          this.loading = false;
          this.errorMessage = httpError.error["detail"];
        }
      });
    }else{
      this.noteService.update(this.note).subscribe({
        next: (response: Note) => {
          this.loading = false;
          this.goToMainMenu();
        },
        error: (httpError: HttpErrorResponse) => {
          this.loading = false;
          this.errorMessage = httpError.error["detail"];
        }
      });
    }
  }

  goToMainMenu(){
    this.router.navigate(['notes']);
  }
}
