import { Component, OnInit, PipeTransform } from '@angular/core';
import { AsyncPipe, CommonModule, DecimalPipe } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { NgbHighlight } from '@ng-bootstrap/ng-bootstrap';
import { Note } from '../../model/note';
import { NoteService } from '../../services/note/note.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { inject, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngbd-modal-content',
	standalone: true,
	template: `
		<div class="modal-header">
			<h4 class="modal-title">Confirmation</h4>
			<button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss('Cross click')"></button>
		</div>
		<div class="modal-body">
			<p>Are you sure you want to delete this note?</p>
		</div>
		<div class="modal-footer">
			<button type="button" class="btn btn-outline-primary" (click)="confirm()">Confirm</button>
			<button type="button" class="btn btn-outline-secondary" (click)="activeModal.close('Close click')">Close</button>
		</div>
	`,
})
export class NgbdModalContent {
	activeModal = inject(NgbActiveModal);

	@Input() id: number | undefined;
	@Input() parent: NoteComponent | undefined;

	confirm(){
		if (this.parent) {
			this.parent.deleteNote(this.id);
		}
		this.activeModal.close('Close click');
	}
}

@Component({
  selector: 'app-note',
  standalone: true,
  imports: [DecimalPipe, AsyncPipe, ReactiveFormsModule, NgbHighlight, CommonModule, FormsModule],
  templateUrl: './note.component.html',
  providers: [DecimalPipe],
})
export class NoteComponent implements OnInit{
	myModal = document.getElementById('exampleModal');
	filter = new FormControl('', { nonNullable: true });
	statusFilter = "";
	loading: Boolean = false;
  	errorMessage: string = "";
	notes: Note[] = [];
	constructor(
		private noteService: NoteService,
		private router: Router
	) {
		
	}

	public modalService = inject(NgbModal);

	open(id: number) {
		const modalRef = this.modalService.open(NgbdModalContent);
		modalRef.componentInstance.id = id;
		modalRef.componentInstance.parent = this;
	}

	ngOnInit(): void {
		this.getNotes();
	}

	getNotes(){
		this.loading = true;
		this.errorMessage = "";
		this.noteService.getNotes().subscribe({
			next: (response: Note[]) => {
				this.loading = false;
				this.notes = response;
			},
			error: (httpError: HttpErrorResponse) => {
				this.loading = false;
				this.errorMessage = httpError.error["detail"];
			}
		});
	}

	filterNotes(){
		this.loading = true;
		this.errorMessage = "";
		this.noteService.filterNotes(this.statusFilter).subscribe({
			next: (response: Note[]) => {
				this.loading = false;
				this.notes = response;
			},
			error: (httpError: HttpErrorResponse) => {
				this.loading = false;
				this.errorMessage = httpError.error["detail"]??httpError.error["status"]??"query error";
			}
		});
	}

	deleteNote(id: any|number){
		this.loading = true;
		this.errorMessage = "";
		this.noteService.delete(id).subscribe({
			next: () => {
				this.getNotes();
			},
			error: (httpError: HttpErrorResponse) => {
				this.loading = false;
				this.errorMessage = httpError.error["detail"];
			}
		});
	}
	
	findByStatus(){
		if(this.statusFilter.trim()!==""){
			this.filterNotes();
		}else{
			this.getNotes();
		}
	}

	goToNewNoteForm(){
		this.router.navigate(['notes/create']);
	}

	goToEditNoteForm(id: number){
		this.router.navigate([`notes/detail/${id}`]);
	}
	
	delete(id: number){
		this.open(id);
	}

	logOut(){
		localStorage.removeItem("access-token");
		localStorage.removeItem("refresh-token");
		this.router.navigate(['login']);
	}
}