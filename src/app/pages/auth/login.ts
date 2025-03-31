import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule],
    templateUrl: './login.html'
})
export class Login {
    email: string = '';

    password: string = '';

    checked: boolean = false;

    constructor(
        private authService: AuthService,
        private router: Router
    ) {}

    login() {
        if (!this.email || !this.password) {
            alert('Por favor, ingrese su correo y contraseña.');
            return;
        }

        this.authService.login(this.email, this.password).subscribe({
            next: (res) => {
                localStorage.setItem('token', res.token);
                this.router.navigate(['/']); // Redirigir al Dashboard
            },
            error: () => alert('Credenciales incorrectas')
        });
    }
}
