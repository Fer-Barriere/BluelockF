import { Component,  } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { CardModule } from 'primeng/card';
import { OverlayBadgeModule} from 'primeng/overlaybadge'

@Component({
    selector: 'line-up-card',
    imports: [CardModule, AvatarModule, OverlayBadgeModule],
    template: `
        <section class="rounded-xl p-5 flex flex-col bg-zinc-900  dark:hover:bg-gray-700 h-[30em] md:h-[40em]">
            <h1 class="mb-2 text-center text-4xl font-bold text-gray-900 dark:text-white">Alineaciones</h1>
            <!-- campo -->
            <div class="relative flex-1 font-norma flex flex-col justify-center">
                <img src="/assets/field.webp" class="w-full h-full inset-0 max-h-[35em] absolute z-0" alt="" />

                <!-- grilla de jugadores -->
                <div class="relative grid grid-cols-5 grid-rows-4 gap-3 z-10">
                    <!-- punta -->
                    <div class="col-start-3 col-span-1 row-span-2 rounded-lg flex items-center justify-center">
                      <p-overlay-badge value="1" severity="success">
                        <p-avatar label="D" size="xlarge" shape="circle" />
                      </p-overlay-badge>
                    </div>
                    <!-- medios -->
                    <div class="col-start-2 col-span-1 row-span-1 rounded-lg">
                        <p-avatar label="D" size="xlarge" shape="circle" />
                    </div>
                    <div class="col-start-4 col-span-1 row-span-1 rounded-lg">
                        <div class="place-self-end">
                            <p-avatar label="D" size="xlarge" shape="circle" />
                        </div>
                    </div>
                    <div class="col-start-2 col-span-1 row-span-1 rounded-lg">
                        <div class="place-self-end">
                            <p-avatar label="D" size="xlarge" shape="circle" />
                        </div>
                    </div>
                    <div class="col-start-4 col-span-1 row-span-1 rounded-lg">
                        <p-avatar label="D" size="xlarge" shape="circle" />
                    </div>
                    <!-- Portero -->
                    <div class="col-start-2 col-span-3 row-span-1 rounded-lg flex items-center justify-center">
                        <p-avatar label="D" size="xlarge" shape="circle" />
                    </div>
                </div>
            </div>
        </section>
    `
})
export class LineUpCardComponent {}
