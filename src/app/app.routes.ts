import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { NoteComponent } from './notes/list-notes/note.component';
import { StoreNotesComponent } from './notes/store-notes/store-notes.component';
import { hasValidSessionGuard } from './guard/has-valid-session.guard';
export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'notes', component: NoteComponent, canActivate: [hasValidSessionGuard] },
    { path: 'notes/create', component: StoreNotesComponent, canActivate: [hasValidSessionGuard] },
    { path: 'notes/detail/:id', component: StoreNotesComponent, canActivate: [hasValidSessionGuard] },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', redirectTo: 'login', pathMatch: 'full' }
];
