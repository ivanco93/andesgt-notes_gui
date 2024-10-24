import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginService } from '../services/user/login.service';
import { AuthResponse } from '../model/auth-response';

class MockLoginService {
  auth(user: any) {
    return of({ access: 'mock-access-token', refresh: 'mock-refresh-token' } as AuthResponse);
  }

  refresh(refreshToken: any) {
    return of({ access: 'mock-access-token' } as AuthResponse);
  }
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockRouter: any;
  let mockLoginService: MockLoginService;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockLoginService = new MockLoginService();

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, LoginComponent],
      providers: [
        { provide: LoginService, useValue: mockLoginService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set loading to false on save', () => {
    component.onSave();
    expect(component.loading).toBe(false);
  });

  it('should navigate on successful authentication', () => {
    component.onSave();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['notes']);
  });

  it('should set errorMessage on auth error', () => {
    spyOn(mockLoginService, 'auth').and.returnValue(throwError({ error: { detail: 'Error message' } }));
    component.onSave();
    expect(component.errorMessage).toBe('Error message');
  });

  it('should call checkSession on init', () => {
    const checkSessionSpy = spyOn(component, 'checkSession').and.callThrough();
    component.ngOnInit();
    expect(checkSessionSpy).toHaveBeenCalled();
  });
});
