import { Component, Input } from '@angular/core';
import { DividerModule } from 'primeng/divider'
import { CardModule } from 'primeng/card';
@Component({
  selector: "stat-card",
  imports: [DividerModule, CardModule],
  template: `
    <p-card styleClass="hover:bg-gray-100 dark:hover:bg-gray-700 ">
      <div class="grid grid-cols-3 p-3 rounded-lg">
        <!-- Imagen -->
          <img
            class="w-16 h-16 sm:w-24 sm:h-24 md:w-36 md:h-36 bg-black rounded-full"
            [src]="imageUrl"
            alt="{{ player }}-img"
          />
        <!-- Segunda seccion -->
        <div class="flex flex-col items-center justify-center">
          <p class="text-base text-justify lg:text-left font-bold text-gray-900 dark:text-white">
            {{ title }}
          </p>
          <p class="text-3xl font-bold text-gray-900 dark:text-white">
            {{ player }}
          </p>
        </div>
        <!-- estadistica -->
        <div class="flex items-center justify-evenly">
          <p-divider layout="vertical" />
          <p class="text-7xl font-bold ">
            {{ stat }}
          </p>
        </div>
      </div>
    </p-card>
  `,
})
export class StatCardComponent {
  @Input() title = "Maximo goleador";
  @Input() imageUrl = '/assets/player-avatar.png';
  @Input() player = "Espinal";
  @Input() stat!: number; // Default value for stat
}
