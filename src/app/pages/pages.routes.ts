import { Routes } from '@angular/router';
import { Jugadores } from './jugadores/jugadores';
import { AuthGuard } from '../guards/auth.guard';
import { Alineacion } from './alineacion/alineacion';
import { PartidosComponent } from './partidos/partidos.component';

export default [
    { path: 'jugadores', component: Jugadores, canActivate: [AuthGuard] },
    { path: 'alineacion', component: Alineacion, canActivate: [AuthGuard]},
    { path: 'partidos', component: PartidosComponent, canActivate: [AuthGuard]},
    { path: '**', redirectTo: '/notfound' }
] as Routes;
