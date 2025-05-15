import { Component, Input } from '@angular/core';
import { DividerModule } from 'primeng/divider'
import { CardModule } from 'primeng/card';
@Component({
  selector: "stat-card",
  imports: [DividerModule, CardModule],
  template: `
    <p-card styleClass="hover:bg-gray-100 dark:hover:bg-gray-700 ">
      <div class="grid grid-cols-3 rounded-lg">
        <!-- Imagen -->
          <img
            class="w-20 h-20 md:w-24 md:h-24 bg-black rounded-full"
            [src]="imageUrl"
            (error)="imageUrl = '/assets/player-avatar.jpg'"
            alt="{{ player }}-img"
          />
        <!-- Segunda seccion -->
        <div class="flex flex-col  justify-center">
          <p class="text-base text-left font-bold text-gray-900 dark:text-white">
            {{ title }}
          </p>
          <p class="text-3xl font-bold text-gray-900 dark:text-white">
            {{ player }}
          </p>
        </div>
        <!-- estadistica -->
        <div class="flex items-center justify-evenly">
          <p-divider layout="vertical" />
          <p class="text-5xl md:text-6xl xl:text-7xl font-bold ">
            {{ stat }}
          </p>
        </div>
      </div>
    </p-card>
  `,
})
export class StatCardComponent {
  @Input() title = "Maximo goleador";
  @Input() imageUrl!: string;
  @Input() player = "Espinal";
  @Input() stat!: number; // Default value for stat
}
