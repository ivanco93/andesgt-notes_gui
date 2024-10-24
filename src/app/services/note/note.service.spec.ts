import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NoteService } from './note.service';
import { Note } from '../../model/note';
import { environment } from '../../../environment/environment';

describe('NoteService', () => {
  let service: NoteService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [NoteService],
    });

    service = TestBed.inject(NoteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should send a GET request to /notes/ with the correct headers', () => {
    service.getNotes().subscribe();
  
    const req = httpMock.expectOne(`${environment.apiUrl}/notes/`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    expect(req.request.headers.get('Authorization')).toBe('Bearer ' + localStorage.getItem("access-token"));
    req.flush([]);
  });
  
  it('should send a GET request to /notes/:id/ with the correct headers', () => {
    const noteId = 1;
  
    service.find(noteId).subscribe();
  
    const req = httpMock.expectOne(`${environment.apiUrl}/notes/${noteId}/`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    expect(req.request.headers.get('Authorization')).toBe('Bearer ' + localStorage.getItem("access-token"));
    req.flush({});
  });
  
  it('should send a POST request to /notes/ with the correct headers and body', () => {
    const mockNote = { title: 'New Note', description: 'Note Description', status: 'active' };
  
    service.store(mockNote).subscribe();
  
    const req = httpMock.expectOne(`${environment.apiUrl}/notes/`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    expect(req.request.headers.get('Authorization')).toBe('Bearer ' + localStorage.getItem("access-token"));
    expect(req.request.body).toEqual(mockNote);
    req.flush({});
  });
  
  it('should send a PUT request to /notes/:id/ with the correct headers and body', () => {
    const mockNote: Note = { id: 1, title: 'Updated Note', description: 'Updated Description', status: 'active' };
  
    service.update(mockNote).subscribe();
  
    const req = httpMock.expectOne(`${environment.apiUrl}/notes/${mockNote.id}/`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    expect(req.request.headers.get('Authorization')).toBe('Bearer ' + localStorage.getItem("access-token"));
    expect(req.request.body).toEqual(mockNote);
    req.flush({});
  });
  
  it('should send a DELETE request to /notes/:id/ with the correct headers', () => {
    const noteId = 1;
  
    service.delete(noteId).subscribe();
  
    const req = httpMock.expectOne(`${environment.apiUrl}/notes/${noteId}/`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    expect(req.request.headers.get('Authorization')).toBe('Bearer ' + localStorage.getItem("access-token"));
    req.flush({});
  });
  
  it('should return HttpHeaders with Content-Type and Authorization', () => {
    const mockAccessToken = 'mock-access-token';
    localStorage.setItem('access-token', mockAccessToken);
  
    const headers = service.getHttpHeaders();
    expect(headers.get('Content-Type')).toBe('application/json');
    expect(headers.get('Authorization')).toBe('Bearer ' + mockAccessToken);
  });  
});
