import { Component, OnInit } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { JugadorService } from '../service/jugador.service';
// <div class="grid grid-cols-12 gap-8">
//             <app-stats-widget class="contents" />
//             <div class="col-span-12 xl:col-span-6">
//                 <app-recent-sales-widget />
//             </div>
//         </div>
@Component({
    selector: 'app-dashboard',
    imports: [AvatarModule],
    templateUrl: `./dashboard.html`
})
export class Dashboard implements OnInit {

    maximoGoleador: any = {};
    maximoAsistidor: any = {};
    maximoAtajador: any = {};

    constructor(private jugadorService: JugadorService) {}
    
    ngOnInit(): void {
        this.jugadorService.obtenerMaximos().subscribe(data => {
            this.maximoGoleador = data.maxGoleador;
            this.maximoAsistidor = data.maxAsistente;
            this.maximoAtajador = data.maxAtajadas;
          });
    }
}
