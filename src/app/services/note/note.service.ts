import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Note } from '../../model/note';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  constructor(private http: HttpClient) { }
  public getHttpHeaders() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem("access-token")
    });
  }

  getNotes(): Observable<Note[]>{
    return this.http.get<any>(`${environment.apiUrl}/notes/`, {
      headers: this.getHttpHeaders(),
      responseType: 'json'
    });
  }

  filterNotes(status: string): Observable<Note[]>{
    return this.http.get<any>(`${environment.apiUrl}/notes/?status=${status}`, {
      headers: this.getHttpHeaders(),
      responseType: 'json'
    });
  }

  find(id: number): Observable<Note>{
    return this.http.get<any>(`${environment.apiUrl}/notes/${id}/`, {
      headers: this.getHttpHeaders(),
      responseType: 'json'
    });
  }

  store(note: any): Observable<any>{
    return this.http.post<any>(`${environment.apiUrl}/notes/`, note, {
      headers: this.getHttpHeaders(),
      responseType: 'json'
    });
  }

  update(note: Note): Observable<any>{
    return this.http.put<any>(`${environment.apiUrl}/notes/${note.id}/`, note, {
      headers: this.getHttpHeaders(),
      responseType: 'json'
    });
  }

  delete(id: any|number): Observable<any>{
    return this.http.delete<any>(`${environment.apiUrl}/notes/${id}/`, {
      headers: this.getHttpHeaders(),
      responseType: 'json'
    });
  }
}
