import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoteComponent, NgbdModalContent } from './note.component';
import { NoteService } from '../../services/note/note.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Note } from '../../model/note';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

describe('NoteComponent', () => {
    let component: NoteComponent;
    let fixture: ComponentFixture<NoteComponent>;
    let mockNoteService: jasmine.SpyObj<NoteService>;
    let mockRouter: jasmine.SpyObj<Router>;

    beforeEach(() => {
      mockNoteService = jasmine.createSpyObj('NoteService', ['getNotes', 'delete']);
      mockRouter = jasmine.createSpyObj('Router', ['navigate']);
      
      TestBed.configureTestingModule({
          imports: [ReactiveFormsModule, NoteComponent, NgbdModalContent],
          providers: [
              { provide: NoteService, useValue: mockNoteService },
              { provide: Router, useValue: mockRouter },
              NgbModal
          ]
      }).compileComponents();
  
      fixture = TestBed.createComponent(NoteComponent);
      component = fixture.componentInstance;
    });

    it('should create the component and call getNotes on init', () => {
        spyOn(component, 'getNotes');
        
        fixture.detectChanges();

        expect(component).toBeTruthy();
        expect(component.getNotes).toHaveBeenCalled();
    });

    it('should fetch notes successfully', () => {
        const mockNotes: Note[] = [{ id: 1, title: 'Note 1', description: 'Description 1', status: 'active', created_at: new Date().toDateString() }];

        mockNoteService.getNotes.and.returnValue(of(mockNotes));

        component.getNotes();

        expect(component.notes).toEqual(mockNotes);
        expect(component.loading).toBeFalse();
        expect(component.errorMessage).toBe('');
    });

    it('should handle error when fetching notes', () => {
        const mockError = { error: { detail: 'Error fetching notes' } };

        mockNoteService.getNotes.and.returnValue(throwError(() => mockError));

        component.getNotes();

        expect(component.notes).toEqual([]);
        expect(component.loading).toBeFalse();
        expect(component.errorMessage).toBe('Error fetching notes');
    });

    it('should navigate to the new note form', () => {
        component.goToNewNoteForm();

        expect(mockRouter.navigate).toHaveBeenCalledWith(['notes/create']);
    });

    it('should navigate to the edit note form', () => {
        const noteId = 1;

        component.goToEditNoteForm(noteId);

        expect(mockRouter.navigate).toHaveBeenCalledWith([`notes/detail/${noteId}`]);
    });

    it('should log out and navigate to login', () => {
        component.logOut();

        expect(localStorage.getItem("access-token")).toBeNull();
        expect(localStorage.getItem("refresh-token")).toBeNull();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['login']);
    });
});
