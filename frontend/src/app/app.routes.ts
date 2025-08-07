import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { ContatoListComponent } from './components/contato-list/contato-list.component';
import { ContatoFormComponent } from './components/contato-form/contato-form.component';

export const routes: Routes = [
  { path: '', redirectTo: '/contatos', pathMatch: 'full' },
  { 
    path: 'contatos', 
    component: ContatoListComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'contatos/novo', 
    component: ContatoFormComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'contatos/editar/:id', 
    component: ContatoFormComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'contatos/favoritos', 
    component: ContatoListComponent,
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '/contatos' }
];
