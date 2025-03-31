import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:5000/api/usuarios';

    constructor(
        private http: HttpClient,
        private router: Router
    ) {}

    login(email: string, password: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/login`, { email, password });
    }

    register(email: string, password: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/register`, { email, password });
    }
    // Decodificar el JWT y verificar la expiración
    decodeToken(token: string): any {
        return jwtDecode(token); // Decodifica el token
    }
    // Verificar si el token está expirado
    isTokenExpired(token: string): boolean {
        const decoded = this.decodeToken(token);
        const expirationTime = decoded.exp * 1000; // Convertir el tiempo de expiración a milisegundos
        return Date.now() > expirationTime;
    }
    logout(): void {
        localStorage.removeItem('token');
        this.router.navigate(['/auth/login']);
    }

    isAuthenticated(): boolean {
        const token = this.getToken();
        if (!token) {
          return false;
        }
        if (this.isTokenExpired(token)) {
          this.logout();
          return false;
        }
        return localStorage.getItem('token') !== null;
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }
}
