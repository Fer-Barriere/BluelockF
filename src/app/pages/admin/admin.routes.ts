import { Routes } from '@angular/router';
import { registroPagos } from './registroPagos'
import { AuthGuard } from '../../guards/auth.guard';

export default [
    { path: 'registroPagos', component: registroPagos, canActivate: [AuthGuard] }
] as Routes;
