import { Component, Input, OnInit } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { CardModule } from 'primeng/card';
import { OverlayBadgeModule} from 'primeng/overlaybadge'
import { Jugador, LastMatchInfo, Suplente } from '../../../../models/lastMatch.model';
import { FormsModule } from '@angular/forms';
import {ToggleSwitchModule} from 'primeng/toggleswitch';

@Component({
    selector: 'line-up-card',
    imports: [CardModule, AvatarModule, OverlayBadgeModule, FormsModule, ToggleSwitchModule],
    template: `<section class="rounded-xl pt-5 2xl:px-5 flex flex-col gap-y-5 bg-zinc-900">

            <!-- ENCABEZADO -->
            <section class="flex flex-col md:flex-row gap-y-4 justify-between px-5 py-6">
              <h1 class="mb-2 text-center text-4xl font-bold text-gray-900 dark:text-white">Alineación</h1>
              <div class="flex items-center justify-center gap-x-4 text-xl font-bold">
                <span>Negro</span>
                <p-toggleswitch [(ngModel)]="isWhiteTeam" (onChange)="setEquipo()" [dt]="estiloParaSwitch" />
                <span>Blanco</span>
              </div>
            </section>

            <!-- CAMPO -->
            <section class="relative font-normal text-gray-80 h-[21rem] sm:h-[28rem] flex flex-col sm:justify-center">
                <img src="/assets/field_2.webp" class="w-full h-full inset-0 absolute z-0" alt="" />
                <!-- grilla de jugadores -->
                <div class="relative grid grid-cols-5  grid-rows-4 gap-4 z-10 text-slate-700">
                    <!-- punta -->
                    <div class="col-start-3 col-span-1 row-span-2 rounded-lg flex flex-col items-center justify-center">
                      <p-overlay-badge [value]="delantero?.media" severity="success">
                        <p-avatar [label]="delantero?.posicionUsada" shape="circle" class="w-11 h-11 sm:w-16 sm:h-16"/>
                      </p-overlay-badge>
                      <p>{{delantero?.jugador?.nombre}}</p>
                    </div>
                    <!-- medios -->
                    <div class="col-start-2 col-span-1 row-span-1  rounded-lg">
                      <div class="place-self-center">
                        <p-overlay-badge [value]="medios?.[0]?.media" severity="success">
                          <p-avatar [label]="medios?.[0]?.posicionUsada" class="w-11 h-11 sm:w-16 sm:h-16" shape="circle" />
                        </p-overlay-badge>
                        <p class="text-center">{{medios?.[0]?.jugador?.apodo}}</p>
                      </div>
                    </div>
                    <div class="col-start-4 col-span-1 row-span-1 rounded-lg">
                        <div class="place-self-center">
                            <p-overlay-badge [value]="medios?.[1]?.media" severity="success">
                                <p-avatar [label]="medios?.[1]?.posicionUsada" class="w-11 h-11 sm:w-16 sm:h-16" shape="circle" />
                            </p-overlay-badge>
                            <p class="text-center">{{medios?.[1]?.jugador?.apodo}}</p>
                        </div>
                    </div>
                    <!-- Defensores -->
                    <div class="col-start-2 col-span-1 row-span-1 rounded-lg">
                        <div class="place-self-end">
                          <p-overlay-badge [value]="defensas?.[0]?.media" severity="success">
                            <p-avatar label="D" class="w-11 h-11 sm:w-16 sm:h-16" shape="circle" />
                          </p-overlay-badge>
                            <p class="text-center">{{defensas?.[0]?.jugador?.apodo}}</p>
                        </div>
                    </div>
                    <div class="col-start-4 col-span-1 row-span-1 rounded-lg">
                      <div class="place-self-start">
                        <p-overlay-badge [value]="defensas?.[1]?.media" severity="success">
                          <p-avatar label="D" class="w-11 h-11 sm:w-16 sm:h-16" shape="circle" />
                        </p-overlay-badge>
                        <p class="text-center">{{defensas?.[1]?.jugador?.apodo}}</p>
                      </div>
                    </div>
                    <!-- Portero -->
                    <div class="col-start-3 col-span-1 row-span-1 rounded-lg flex flex-col items-center">
                      <p-overlay-badge [value]="portero?.media" severity="success">
                        <p-avatar label="D" class="w-11 h-11 sm:w-16 sm:h-16" shape="circle" />
                      </p-overlay-badge>
                        <span>{{portero?.jugador?.apodo}}</span>
                    </div>
                </div>
            </section>

            <!-- SUPLENTES -->
            <section class="flex flex-col gap-y-2 px-5 py-6">
              <h2 class="mb-1 text-2xl font-bold text-gray-900 dark:text-white">Suplentes</h2>
              <ul class="font-medium text-lg">
                @for(item of suplentes; track $index + item._id){
                  <li> - {{item.jugador.apodo}}, Media: {{item.jugador.media}}</li>
                }
              </ul>
            </section>
        </section>
`,
})
export class LineUpCardComponent implements OnInit {
   @Input() lastMatchInfo!: LastMatchInfo;

   delantero!: Jugador | undefined; //input como signal (nueva forma)
   medios!: Jugador[] | undefined;
   defensas!: Jugador[] | undefined;
   portero!: Jugador | undefined;
   suplentes!: Suplente[] | undefined;

  isWhiteTeam:boolean = true;

  estiloParaSwitch = {
      checked:{
        background: '#f2f0ef',
        hover: {
          background:'#fff'
        }
      },
      width: '60px',
      height: '35px',
      handle: {
        size: '25px',
      }
  }

  ngOnInit(): void {
    this.setEquipo()
  }

  setEquipo() {
    if(this.isWhiteTeam){
      this.delantero = this.lastMatchInfo.equipoBlanco.jugadores.find(jugador => jugador.posicionUsada === 'DC');
      this.medios = this.lastMatchInfo.equipoBlanco.jugadores.filter(jugador => jugador.posicionUsada === 'MC');
      this.defensas = this.lastMatchInfo.equipoBlanco.jugadores.filter(jugador => jugador.posicionUsada === 'DFC');
      this.portero = this.lastMatchInfo.equipoBlanco.jugadores.find(jugador => jugador.posicionUsada === 'POR');
      this.suplentes = this.lastMatchInfo.suplentes.filter((jugador) => jugador.equipo === 'Blanco');

    }else{
      this.delantero = this.lastMatchInfo.equipoNegro.jugadores.find(jugador => jugador.posicionUsada === 'DC');
      this.medios = this.lastMatchInfo.equipoNegro.jugadores.filter(jugador => jugador.posicionUsada === 'MC');
      this.defensas = this.lastMatchInfo.equipoNegro.jugadores.filter(jugador => jugador.posicionUsada === 'DFC');
      this.portero = this.lastMatchInfo.equipoNegro.jugadores.find(jugador => jugador.posicionUsada === 'POR');
      this.suplentes = this.lastMatchInfo.suplentes.filter((jugador) => jugador.equipo === 'Negro');
    }
  }
}
