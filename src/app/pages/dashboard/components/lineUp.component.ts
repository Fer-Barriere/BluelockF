import { Component,  } from '@angular/core';
import { CardModule } from 'primeng/card';

@Component({
  selector: "line-up-card",
  imports: [CardModule],
  template: `
    <section
      class="rounded-xl bg-zinc-900 p-5 dark:hover:bg-gray-700"
    >
      <h1 class="mb-2 text-center text-4xl font-bold text-gray-900 dark:text-white">
        Alineaciones
      </h1>
      <!-- campo -->
      <div class=" relative font-normal text-gray-700 dark:text-gray-400">
        <img src="/assets/field.webp" class="w-full h-full object-fit max-h-[35em]" alt="">
      </div>
    </section>
  `,
})
export class LineUpCardComponent {

}
