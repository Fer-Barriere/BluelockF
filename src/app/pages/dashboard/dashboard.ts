import { Component, OnInit } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { JugadorService, MaxStatCard } from '../service/jugador.service';
import { LastMatchCardComponent } from './components/lastMatchCard.component';
import { LineUpCardComponent } from './components/lineUp.component';
import { StatCardComponent } from './components/statCard.component';
import { PartidoService } from '../service/partido.service';
import { LastMatchInfo } from '../../../models/lastMatch.model';
import { DividerModule } from 'primeng/divider';
@Component({
    selector: 'app-dashboard',
    imports: [AvatarModule, LastMatchCardComponent, LineUpCardComponent, StatCardComponent, DividerModule],
    templateUrl: `./dashboard.html`
})
export class Dashboard implements OnInit {
    statsData!: MaxStatCard[];
    ultimoPartido!: LastMatchInfo;

    constructor(
        private jugadorService: JugadorService,
        public partidoService: PartidoService
    ) {}

    ngOnInit(): void {
        this.getMaximos();
        this.getUltimoPartido();
    }

    getMaximos() {
        this.jugadorService.obtenerMaximos().subscribe({
            next: (data) => {
                this.statsData = data;
            },
            error: (error) => {
                console.error('Error al obtener los máximos:', error);
            }
        });
    }

    getUltimoPartido() {
      this.partidoService.obtenerUltimoPartido().subscribe({
          next: (data) => {
            this.ultimoPartido = data;
          },
          error: (error) => {
            console.log('Error al obtener el último partido:', error);
          }
        });
    }
}
