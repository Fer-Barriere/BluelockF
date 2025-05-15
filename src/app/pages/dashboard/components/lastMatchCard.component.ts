import { CommonModule } from '@angular/common';
import { Component, Input, input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CardModule } from 'primeng/card';
import { Highlight, LastMatchInfo, Marcador } from '../../../../models/lastMatch.model';

@Component({
    selector: 'app-last-match-card',
    imports: [CommonModule, CardModule],
    template: `
        <section class="relative p-8 md:p-9 lg:p-10 hover:bg-gray-100 dark:hover:bg-gray-700 overflow-hidden h-full rounded-xl bg-[url('/assets/champions.png')] bg-cover bg-center">
            <!-- overlay -->
            <div class="absolute inset-0 bg-black bg-opacity-30"></div>
            <!-- contenido  -->
            <div class="relative">
              <!-- Fecha para mobile -->
                <p class="lg:hidden text-center sm:text-xl lg:text-2xl">{{ lastMatchInfo.fecha | date: 'fullDate' }}</p>
                <div class="flex justify-between items-center mb-4">
                  <!-- Primer logo -->
                    <div class="flex ">
                        <div class="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 xl:h-28 xl:w-28 2xl:w-32 2xl:h-32 bg-black rounded-full overflow-hidden">
                            <img src="assets/black-team.jpg" alt="" />
                        </div>
                    </div>
                    <div class="text-center font-bold">
                        <!-- fecha para escritorio -->
                        <p class="hidden lg:block sm:text-xl lg:text-2xl">{{ lastMatchInfo.fecha | date: 'fullDate' }}</p>
                        <!-- marcador para mobile -->
                        <div class="bg-gradient-to-r from-slate-900 to-slate-700 m-auto text-3xl md:text-4xl max-w-32 px-3 lg:hidden rounded-lg">
                            <p>{{ lastMatchInfo.marcador.equipoNegro }} - {{ lastMatchInfo.marcador.equipoBlanco }}</p>
                        </div>
                    </div>
                    <!-- Segundo logo -->
                    <div class="flex">
                        <div class="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 xl:h-28 xl:w-28 2xl:w-32 2xl:h-32 bg-gray-300 rounded-full overflow-hidden">
                            <img src="assets/white-team.jpg" alt="" />
                        </div>
                    </div>
                </div>
            </div>
            <!-- Segunda seccion -->
            <div class="relative pt-5 flex justify-between">
                <div>
                    <ul class="flex flex-col gap-2 md:gap-4 text-base md:text-lg lg:text-xl 2xl:text-2xl">
                        @for (item of blackHighlightGoals; track $index + item._id) {
                            <li>{{ item.jugador.apodo }} (x{{ item.goles }})</li>
                        }
                    </ul>
                </div>
                <div >
                    <div class="bg-gradient-to-r from-slate-900 to-slate-700 hidden lg:block py-1 px-10 sm:text-xl lg:text-3xl xl:text-5xl 2xl:text-6xl font-bold rounded-xl">
                        <p>{{ lastMatchInfo.marcador.equipoNegro }} - {{ lastMatchInfo.marcador.equipoBlanco }}</p>
                    </div>
                </div>
                <div>
                    <ul class="flex flex-col gap-2 md:gap-4 text-base md:text-lg lg:text-xl 2xl:text-2xl">
                        @for (item of whiteHighlightGoals; track $index + item._id) {
                            <li>{{ item.jugador.apodo }} (x{{ item.goles }})</li>
                        }
                    </ul>
                </div>
            </div>
        </section>
    `
})
export class LastMatchCardComponent implements OnInit {
    @Input() lastMatchInfo!: LastMatchInfo;
    whiteHighlightGoals!: Highlight[]
    blackHighlightGoals!: Highlight[]

    ngOnInit(): void {
      this.whiteHighlightGoals = this.lastMatchInfo.highlights?.filter((item) => item.equipo === "Blanco" && item.goles > 0) || [];
      this.blackHighlightGoals = this.lastMatchInfo.highlights?.filter((item) => item.equipo === "Negro" && item.goles > 0) || [];
    }
}
