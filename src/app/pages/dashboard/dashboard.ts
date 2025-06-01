import { Component, OnInit } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { JugadorService, MaximoJugador, MaxStatCard } from '../service/jugador.service';
import { LastMatchCardComponent } from './components/lastMatchCard.component';
import { LineUpCardComponent } from './components/lineUp.component';
import { StatCardComponent } from './components/statCard.component';
import { PartidoService } from '../service/partido.service';
import { LastMatchInfo } from '../../../models/lastMatch.model';
import { DividerModule } from 'primeng/divider';
import { CommonModule } from '@angular/common';
@Component({
    selector: 'app-dashboard',
    imports: [AvatarModule, LastMatchCardComponent, LineUpCardComponent, StatCardComponent, DividerModule, CommonModule],
    templateUrl: `./dashboard.html`
})
export class Dashboard implements OnInit {
    statsData!: MaxStatCard[];
    ultimoPartido!: LastMatchInfo;

    cardMaximos: MaximoJugador[] = [];
    ranking = {
        goleadores: [] as { player: string; stat: number }[],
        asistidores: [] as { player: string; stat: number }[],
        atajadores: [] as { player: string; stat: number }[]
      };

    constructor(
        private jugadorService: JugadorService,
        public partidoService: PartidoService
    ) {}

    ngOnInit(): void {
        this.getMaximos();
        this.getUltimoPartido();
        this.getMaximos2();
    }

    getMaximos2() {
        this.jugadorService.obtenerMaximo2().subscribe({
            next: (data) => {
                this.statsData = data.map((jugador) => ({
                  ...jugador,
                  imageUrl: `assets/MC${Math.floor(Math.random() * 5) + 1}.png`
                }))
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

    getMaximos() {
      this.jugadorService.obtenerMaximos().subscribe((data) => {
            this.cardMaximos = data.map((jugador) => ({
                title: jugador.title,
                player: jugador.player,
                stat: jugador.stat,
                image: `assets/MC${Math.floor(Math.random() * 5) + 1}.png`
            }));
        });
          this.jugadorService.obtenerLeaderboard().subscribe((data) => {
        this.ranking = data;
      });
    }

    get statsList() {
    return [
      { title: 'Top Goleadores', jugadores: this.ranking.goleadores },
      { title: 'Top Asistidores', jugadores: this.ranking.asistidores },
      { title: 'Top Atajadores', jugadores: this.ranking.atajadores }
    ];
  }
}
