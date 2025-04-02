import { Component, OnInit } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { JugadorService } from '../service/jugador.service';
import { LastMatchCardComponent } from './components/lastMatchCard.component';
import { LineUpCardComponent } from './components/lineUp.component';
import { StatCardComponent } from './components/statCard.component';
// <div class="grid grid-cols-12 gap-8">
//             <app-stats-widget class="contents" />
//             <div class="col-span-12 xl:col-span-6">
//                 <app-recent-sales-widget />
//             </div>
//         </div>
@Component({
    selector: 'app-dashboard',
    imports: [AvatarModule, LastMatchCardComponent, LineUpCardComponent, StatCardComponent],
    templateUrl: `./dashboard.html`
})
export class Dashboard implements OnInit {

    maximoGoleador: any = {};
    maximoAsistidor: any = {};
    maximoAtajador: any = {};

    statsData: {title: string, imageUrl: string, player: string, stat: number}[] = [
      {
        title: "Maximo goleador",
        imageUrl: '/assets/player-avatar.png',
        player: "Espinal",
        stat: 10,
      },
      {
        title: "Maximo asistidor",
        imageUrl: '/assets/player-avatar.png',
        player: "Darwin",
        stat: 49,
      },
    ];

    constructor(private jugadorService: JugadorService) {}

    ngOnInit(): void {
        this.jugadorService.obtenerMaximos().subscribe(data => {
            this.maximoGoleador = data.maxGoleador;
            this.maximoAsistidor = data.maxAsistente;
            this.maximoAtajador = data.maxAtajadas;
          });
    }
}
