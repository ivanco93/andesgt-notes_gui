import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NoteComponent } from './list-notes/note.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: NoteComponent,
                data: {
                    sub_module: 2
                }
            }
        ]),
        FormsModule
    ],
})
export class NoteModule {}
