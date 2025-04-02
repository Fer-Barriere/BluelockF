import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CardModule } from 'primeng/card';

@Component({
    selector: 'app-last-match-card',
    imports: [CommonModule, CardModule],
    template: `
        <section class="relative hover:bg-gray-100 dark:hover:bg-gray-700 overflow-hidden h-full rounded-xl bg-[url('/assets/champions.png')] bg-cover bg-center">
            <!-- overlay -->
            <div class="absolute inset-0 bg-black bg-opacity-30"></div>
            <!-- contenido  -->
            <div class="relative p-5">
                <div class="flex justify-between gap-x-2 items-center mb-4">
                    <div class="flex flex-col items-center">
                        <div class="w-16 h-16 sm:w-24 sm:h-24 lg:w-36 lg:h-36 bg-black rounded-full overflow-hidden">
                            <img src="assets/black-team.png" alt="" />
                        </div>
                        <p class="mt-2 font-semibold">Equipo Negro</p>
                    </div>
                    <div class="text-center text-xl md:text-3xl font-bold">
                        <p>Domingo 23 de agosto</p>
                        <div class="bg-slate-600 rounded-lg py-2">
                            <p>8 : 6</p>
                        </div>
                    </div>
                    <div class="flex flex-col items-center">
                        <div class=" overflow-hidden w-16 h-16 sm:w-24 sm:h-24 lg:w-36 lg:h-36 bg-gray-300 rounded-full">
                            <img src="assets/white-team.png" alt="" />
                        </div>
                        <p class="mt-2 font-semibold">Equipo Blanco</p>
                    </div>
                </div>
            </div>
        </section>
    `
})
export class LastMatchCardComponent {
    @Input() info = {};
}
