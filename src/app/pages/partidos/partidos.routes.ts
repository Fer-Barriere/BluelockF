import { Routes } from '@angular/router';
import { Partidos } from './partidos'
import { NuevoPartido } from './nuevoPartido';
import { AuthGuard } from '../../guards/auth.guard';

export default [
    { path: 'partidos', component: Partidos, canActivate: [AuthGuard] },
    { path: 'nuevoPartido', component: NuevoPartido, canActivate: [AuthGuard] }    
] as Routes;
