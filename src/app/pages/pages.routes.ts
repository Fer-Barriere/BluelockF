import { Routes } from '@angular/router';
import { Jugadores } from './jugadores/jugadores';
import { AuthGuard } from '../guards/auth.guard';


export default [
    { path: 'jugadores', component: Jugadores, canActivate: [AuthGuard]  },
    { path: 'partidos', loadChildren: () => import('./partidos/partidos.routes') },
    { path: 'admin', loadChildren: () => import('./admin/admin.routes') },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
