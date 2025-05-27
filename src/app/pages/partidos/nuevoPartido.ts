import { Component, OnInit, signal } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { JugadorService, Jugador } from '../service/jugador.service';
import { PartidoService, Partido } from '../service/partido.service';
import { Formacion } from '../formacion/formacion';

@Component({
    selector: 'app-nuevo-partido',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        FormsModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        RatingModule,
        InputTextModule,
        TextareaModule,
        SelectModule,
        RadioButtonModule,
        InputNumberModule,
        DialogModule,
        TagModule,
        InputIconModule,
        IconFieldModule,
        ConfirmDialogModule,
        Formacion
    ],
    templateUrl: 'nuevoPartido.html',
    providers: [MessageService, JugadorService, ConfirmationService, PartidoService]
})
export class NuevoPartido implements OnInit {
    inscritos: Jugador[] = [];
    jugadores = signal<Jugador[]>([]); // Aquí definimos el signal
    presentados: Jugador[] = [];
    selectedJugadores: any[] = [];
    jsonVisible = false;
    jsonOutput: string = '';
    mostrarModal = false; // Controla la visibilidad del modal
    idPartido!: string;
    partidoCreado!: Partido;

    constructor(
        private jugadorService: JugadorService,
        private confirmationService: ConfirmationService,
        private partidoService: PartidoService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.jugadorService.cargarJugadores(); // Llama a la API para obtener los datos
        this.jugadores = this.jugadorService.jugadores; // Aquí usamos el signal de la API
        this.actualizarSeleccionados();
    }

    actualizarSeleccionados() {
        this.selectedJugadores = this.inscritos.filter((jugador) => this.presentados.some((p) => p.nombre === jugador.nombre));
    }

    moverJugadores() {
        if (this.selectedJugadores.length) {
            // Mover los jugadores seleccionados a Presentados
            this.selectedJugadores.forEach((jugador) => {
                if (!this.presentados.some((j) => j.nombre === jugador.nombre)) {
                    this.presentados.push(jugador);
                }
            });

            // Eliminar jugadores seleccionados de Inscritos
            this.inscritos = this.inscritos.filter((j) => !this.selectedJugadores.includes(j));

            // Actualizar la selección
            this.selectedJugadores = [...this.selectedJugadores]; // Forzar la actualización de la selección
        }
    }

    removerJugador(jugador: any) {
        // Agregar el jugador de vuelta a la lista de Inscritos
        if (!this.inscritos.some((j) => j.nombre === jugador.nombre)) {
            this.inscritos.push(jugador);
        }

        // Remover el jugador de la lista de Presentados
        this.presentados = this.presentados.filter((j) => j !== jugador);

        this.selectedJugadores = this.selectedJugadores.filter((j) => j !== jugador);
    }

    mostrarJSON() {
        this.jsonVisible = !this.jsonVisible;
    }
    abrirModal(id: string) {
        this.idPartido = id; // Asigna el ID
        this.mostrarModal = true; // Abre el modal
    }
    confirm1(event: Event) {
        // Extraemos los IDs de los jugadores presentados y filtramos los undefined
        const jugadorIds = this.presentados.map((jugador) => jugador.id).filter((id): id is string => id !== undefined); // Filtra los undefined

        // Llamamos al servicio de partido para enviar la información a la API
        this.confirmationService.confirm({
            message: `¿Estás seguro de que deseas generar la alineación con ${this.presentados.length} jugadores?`,
            accept: () => {
                // Llamamos al método modificado para enviar el arreglo de IDs
                this.partidoService.agregarPartido(jugadorIds).subscribe({
                    next: (response) => {
                        // Muestra el Toast de éxito cuando la alineación se genera correctamente
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Partido Creado',
                            detail: 'La alineación se ha generado correctamente.'
                        });
                        this.partidoCreado = response;
                        if (response && this.partidoCreado.id) {
                            this.abrirModal(this.partidoCreado.id);
                        } else {
                        }
                    },
                    error: (error) => {
                        // Extrae el mensaje de error en caso de que la API devuelva un error estructurado
                        const errorMessage = error?.error?.error || error?.message || 'Hubo un problema al generar la alineación.';

                        // Muestra el Toast de error cuando ocurre un problema
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: errorMessage
                        });
                    }
                });
            }
        });
    }
}
