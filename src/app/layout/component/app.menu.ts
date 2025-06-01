import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu {
    model: MenuItem[] = [];
    constructor ( private router: Router) {}
    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }]
            },
            {
                label: 'Pages',
                icon: 'pi pi-fw pi-briefcase',
                routerLink: ['/pages'],
                items: [
                    
                    {
                        label: 'Partidos',
                        icon: 'pi pi-fw pi-objects-column',
                        items: [
                            {
                                label: 'Ver Partidos',
                                icon: 'pi pi-fw pi-calendar',
                                routerLink: ['/pages/partidos/partidos']
                            },
                            {
                                label: 'Nuevo Partido',
                                icon: 'pi pi-fw pi-calendar-plus',
                                routerLink: ['/pages/partidos/nuevoPartido']
                            }
                        ]
                    },
                    {
                        label: 'Jugadores',
                        icon: 'pi pi-fw pi-users',
                        routerLink: ['/pages/jugadores']
                    },
                    {
                        label: 'Admin',
                        icon: 'pi pi-fw pi-briefcase',
                        items: [
                            {
                                label: 'Administrar Pagos',
                                icon: 'pi pi-fw pi-briefcase',
                                routerLink: ['/pages/admin/registroPagos']
                            }
                        ]
                    },
                    {
                        label: 'Cerrar Sesion',
                        icon: 'pi pi-fw pi-sign-out',
                        command: () => this.logout()
                    }
                ]
            }
        ];
    }
    logout(): void {
        localStorage.removeItem('token');
        this.router.navigate(['/auth/login']);
    }
}
