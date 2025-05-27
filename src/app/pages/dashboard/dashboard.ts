import { Component, OnInit } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { JugadorService, MaximoJugador } from '../service/jugador.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-dashboard',
    imports: [AvatarModule, CommonModule],
    templateUrl: `./dashboard.html`
})
export class Dashboard implements OnInit {
    cardMaximos: MaximoJugador[] = [];
    stats = {
        goleadores: [] as { player: string; stat: number }[],
        asistidores: [] as { player: string; stat: number }[],
        atajadores: [] as { player: string; stat: number }[]
      };

    constructor(private jugadorService: JugadorService) {}

    ngOnInit(): void {
        this.jugadorService.obtenerMaximos().subscribe((data) => {
            this.cardMaximos = data.map((jugador) => ({
                title: jugador.title,
                player: jugador.player,
                stat: jugador.stat,
                image: `assets/MC${Math.floor(Math.random() * 5) + 1}.png`
            }));
        });
          this.jugadorService.obtenerLeaderboard().subscribe((data) => {
        this.stats = data;
      });
    }
    get statsList() {
    return [
      { title: 'Top Goleadores', jugadores: this.stats.goleadores },
      { title: 'Top Asistidores', jugadores: this.stats.asistidores },
      { title: 'Top Atajadores', jugadores: this.stats.atajadores }
    ];
  }
}
