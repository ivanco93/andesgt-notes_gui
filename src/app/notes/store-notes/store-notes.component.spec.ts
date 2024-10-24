import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreNotesComponent } from './store-notes.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoteService } from '../../services/note/note.service';
import { of, throwError } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

describe('StoreNotesComponent', () => {
  let component: StoreNotesComponent;
  let fixture: ComponentFixture<StoreNotesComponent>;
  let noteService: jasmine.SpyObj<NoteService>;

  beforeEach(async () => {
    const noteServiceSpy = jasmine.createSpyObj('NoteService', ['find', 'store', 'update']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule, StoreNotesComponent],
      providers: [
        { provide: NoteService, useValue: noteServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: { params: of({ id: 1 }) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StoreNotesComponent);
    component = fixture.componentInstance;
    noteService = TestBed.inject(NoteService) as jasmine.SpyObj<NoteService>;
  });

  it('should initialize in edit mode and fetch the note details', () => {
    const mockNote = { id: 1, title: 'Test Note', description: 'Description', status: 'PENDING' };
    noteService.find.and.returnValue(of(mockNote));
  
    component.ngOnInit();
    fixture.detectChanges();
  
    expect(component.creatingMode).toBe(false);
    expect(component.note).toEqual(mockNote);
    expect(component.noteForm.get('title')?.value).toBe(mockNote.title);
    expect(component.noteForm.get('description')?.value).toBe(mockNote.description);
    expect(component.noteForm.get('status')?.value).toBe(mockNote.status);
  });
  
  it('should set errorMessage if there is an error fetching the note', () => {
    const errorResponse = new HttpErrorResponse({
      error: { detail: 'Note not found' },
      status: 404,
    });
    noteService.find.and.returnValue(throwError(errorResponse));
  
    component.ngOnInit();
    fixture.detectChanges();
  
    expect(component.loading).toBe(false);
    expect(component.errorMessage).toBe('Note not found');
  });
  
  it('should call store() and navigate to main menu on successful save in create mode', () => {
    const mockNote = { title: 'New Note', description: 'New Description', status: 'PENDING' };
    noteService.store.and.returnValue(of(mockNote));
    spyOn(component, 'goToMainMenu');
  
    component.creatingMode = true;
    component.noteForm.setValue(mockNote);
    component.onSave();
  
    expect(noteService.store).toHaveBeenCalledWith(mockNote);
    expect(component.loading).toBe(false);
    expect(component.goToMainMenu).toHaveBeenCalled();
  });
  
  it('should call update() and navigate to main menu on successful save in edit mode', () => {
    const mockNote = { id: 1, title: 'Updated Note', description: 'Updated Description', status: 'COMPLETED' };
    noteService.update.and.returnValue(of(mockNote));
    spyOn(component, 'goToMainMenu');
  
    component.creatingMode = false;
    component.noteId = mockNote.id;
    component.noteForm.setValue({ title: mockNote.title, description: mockNote.description, status: mockNote.status });
    component.onSave();
  
    expect(noteService.update).toHaveBeenCalledWith({ ...mockNote });
    expect(component.loading).toBe(false);
    expect(component.goToMainMenu).toHaveBeenCalled();
  });
  
  it('should set errorMessage if there is an error during save', () => {
    const errorResponse = new HttpErrorResponse({
      error: { detail: 'Failed to save note' },
      status: 400,
    });
    noteService.store.and.returnValue(throwError(errorResponse));
  
    component.creatingMode = true;
    component.noteForm.setValue({ title: 'New Note', description: 'Description', status: 'PENDING' });
    component.onSave();
  
    expect(component.loading).toBe(false);
    expect(component.errorMessage).toBe('Failed to save note');
  });
  
  it('should navigate to the main menu', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');
  
    component.goToMainMenu();
  
    expect(router.navigate).toHaveBeenCalledWith(['notes']);
  });  
});
