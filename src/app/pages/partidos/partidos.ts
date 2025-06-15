import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { PopoverModule } from 'primeng/popover';
import { HttpClient } from '@angular/common/http';
import { ToastModule } from 'primeng/toast';
import { PartidoService } from '../service/partido.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { Formacion } from '../formacion/formacion';
import { SelectModule } from 'primeng/select';

import { AccordionModule } from 'primeng/accordion';

interface Jugador {
    id: string;
    nombre: string;
    apodo: string;
    pos_principal: string;
    pos_secundaria: string;
    pierna_habil: string;
    media: number;
}

interface JugadorEnEquipo {
    jugador: Jugador;
    posicionUsada: string;
}

interface Equipo {
    jugadores: JugadorEnEquipo[];
    mediaTotal: number;
}

interface Suplente {
    jugador: Jugador;
    equipo: string;
}

export interface Highlight {
    id: string;
    jugador: {
        id: string;
        nombre: string;
    };
    goles: number;
    asistencias: number;
    atajadas: number;
    equipo: 'Blanco' | 'Negro';
}

export interface Partido {
    id: string;
    fecha: string;
    equipoBlanco: Equipo;
    equipoNegro: Equipo;
    marcador: { equipoBlanco: number; equipoNegro: number };
    suplentes: Suplente[];
    highlights: Highlight[];
    estado: string;
}

@Component({
    selector: 'app-partidos',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        FormsModule,
        ButtonModule,
        InputTextModule,
        InputNumberModule,
        DialogModule,
        CardModule,
        PopoverModule,
        ToastModule, // Incluir el módulo ToastModule
        ConfirmDialogModule,
        Formacion,
        AccordionModule,
        SelectModule
    ],
    templateUrl: './partidos.html',
    styleUrl: './partidos.css',
    providers: [MessageService, ConfirmationService] // Agregar MessageService al proveedor
})
export class Partidos {
    partidos: Partido[] = [];
    modalVisible = false;
    selectedMatch: Partido = this.getEmptyMatch(); // Inicialización correcta
    showPopoverBlanco = false;
    showPopoverNegro = false;
    mostrarModal = false; // Controla la visibilidad del modal
    mostrarAlineacion = false;
    panelesActivosBlanco: any[] = [];
    panelesActivosNegro: any[] = [];
    renderAccordion = true;
    idPartido!: string;

    abrirModal(id: string) {
        this.idPartido = id; // Asigna el ID
        this.mostrarModal = true; // Abre el modal
    }
    editarAlineacion(id: string) {
        this.idPartido = id; // Asigna el ID
        this.mostrarAlineacion = true; // Abre el modal
    }
    constructor(
        private http: HttpClient,
        private messageService: MessageService,
        private partidoService: PartidoService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit() {
        this.cargarPartidos();
    }

    cargarPartidos() {
        this.http.get<Partido[]>('https://bluelockb.onrender.com/api/partidos/listar-partidos').subscribe((data) => {
            this.partidos = data.map((partido: any) => ({
                ...partido,
                id: partido._id // Asignar _id a id
            }));
        });
    }

    resetAccordion() {
        this.panelesActivosBlanco = [];
        this.panelesActivosNegro = [];
    }
    onModalOpen() {
        this.renderAccordion = false;
        setTimeout(() => {
            this.renderAccordion = true;
            this.resetAccordion();
        }, 0);
    }

    onModalClose() {
        this.resetAccordion();
    }
    editarPartido(partido: Partido) {
        this.selectedMatch = { ...partido, highlights: [...partido.highlights] };
        this.modalVisible = true;
    }

    getGoleadoresBlanco() {
        return this.selectedMatch?.highlights.filter((g) => g.equipo === 'Blanco') || [];
    }

    getGoleadoresNegro() {
        return this.selectedMatch?.highlights.filter((g) => g.equipo === 'Negro') || [];
    }
    actualizarMarcador() {
        // Sumar los goles de los goleadores de cada equipo
        const golesBlanco = this.selectedMatch.highlights.filter((g) => g.equipo === 'Blanco').reduce((total, goleador) => total + goleador.goles, 0);

        const golesNegro = this.selectedMatch.highlights.filter((g) => g.equipo === 'Negro').reduce((total, goleador) => total + goleador.goles, 0);

        // Actualizar el marcador en el objeto del partido
        this.selectedMatch.marcador = {
            equipoBlanco: golesBlanco,
            equipoNegro: golesNegro
        };
    }
    eliminarHighlight(id: string) {
        // Elimina el goleador del equipo correspondiente por su id
        this.selectedMatch.highlights = this.selectedMatch.highlights.filter((g) => g.jugador.id !== id);
        this.actualizarMarcador();
    }
    getJugadoresDisponibles(equipo: 'Blanco' | 'Negro') {
        // Seleccionamos el equipo correspondiente
        const equipoSeleccionado = equipo === 'Blanco' ? this.selectedMatch.equipoBlanco : this.selectedMatch.equipoNegro;

        // Filtramos los jugadores suplentes del equipo
        const suplentesSeleccionados = this.selectedMatch.suplentes.filter((s) => s.equipo === equipo).map((s) => s.jugador);
        // Obtenemos todos los jugadores del equipo (tanto titulares como suplentes)
        const jugadoresEnEquipo = equipoSeleccionado.jugadores.map((j) => j.jugador);
        const jugadoresTotales = [...jugadoresEnEquipo, ...suplentesSeleccionados];
        // Filtramos los IDs de los goleadores del equipo
        const goleadoresIds = this.selectedMatch.highlights.filter((g) => g.equipo === equipo).map((g) => g.jugador.id);
        // Excluimos a los jugadores que ya están en la lista de goleadores
        return jugadoresTotales.filter((j) => !goleadoresIds.includes(j.id));
    }

    agregarGoleador(jugador: Jugador, equipo: 'Blanco' | 'Negro') {
        this.selectedMatch.highlights.push({
            id: jugador.id,
            jugador: { id: jugador.id, nombre: jugador.apodo }, // Ajustamos para que encaje con la nueva estructura
            goles: 0,
            asistencias: 0,
            atajadas: 0,
            equipo: equipo
        });
        equipo === 'Blanco' ? (this.showPopoverBlanco = false) : (this.showPopoverNegro = false);
        this.actualizarMarcador();
    }

    // Función para eliminar un partido
    eliminarPartido(Id: string) {
        this.confirmationService.confirm({
            message: `¿Estás seguro de que deseas eliminar el Partido?`,
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.partidoService.eliminarPartido(Id).subscribe({
                    next: () => {
                        // Mostrar un mensaje de éxito
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Partido Eliminado',
                            detail: 'El partido se ha eliminado correctamente.'
                        });
                        // Actualiza la lista de partidos, eliminando el partido
                        this.partidos = this.partidos.filter((partido) => partido.id !== Id);
                    },
                    error: (error) => {
                        // Extrae el mensaje de error en caso de que la API devuelva un error estructurado
                        const errorMessage = error?.error?.message || error?.message || 'Hubo un problema al generar la alineación.';

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
    verAlineacion(id: string) {
        alert(`Alineacion de: ${id}`);
    }

    opcionesEstado = [
        { label: 'Abierto', value: 'Abierto' },
        { label: 'Cerrado', value: 'Cerrado' }
    ];
    saveMatch() {
        const index = this.partidos.findIndex((p) => p.id === this.selectedMatch.id);
        if (index !== -1) {
            // Sumar los goles de los goleadores de cada equipo
            const golesBlanco = this.selectedMatch.highlights.filter((g) => g.equipo === 'Blanco').reduce((total, goleador) => total + goleador.goles, 0);

            const golesNegro = this.selectedMatch.highlights.filter((g) => g.equipo === 'Negro').reduce((total, goleador) => total + goleador.goles, 0);

            // Ajustar el marcador con las sumas de goles
            const marcador = {
                equipoBlanco: golesBlanco,
                equipoNegro: golesNegro
            };

            const highlights = this.selectedMatch.highlights.map((goleador) => ({
                jugador: goleador.jugador.id,
                equipo: goleador.equipo,
                goles: goleador.goles,
                asistencias: goleador.asistencias,
                atajadas: goleador.atajadas
            }));

            const estado = this.selectedMatch.estado;
            // Estructura de la información a enviar
            const partidoAEnviar = {
                marcador,
                highlights,
                estado
            };
            // Llamar a la API para guardar el partido (suponiendo que la URL de la API sea correcta)
            this.http.put(`https://bluelockb.onrender.com/api/partidos/actualizar-partido/${this.selectedMatch.id}`, partidoAEnviar).subscribe(
                (response) => {
                    this.modalVisible = false;
                    this.cargarPartidos(); // Volver a cargar la lista de partidos
                    this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'El partido fue guardado correctamente' }); // Mostrar el Toast
                },
                (error) => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Hubo un error al guardar el partido' }); // Mostrar el Toast de error
                }
            );
        }
    }

    get esSoloLectura(): boolean {
        return this.selectedMatch?.estado === 'Cerrado';
    }

    getEmptyMatch(): Partido {
        return {
            id: '',
            fecha: new Date().toISOString(),
            equipoBlanco: { jugadores: [], mediaTotal: 0 },
            equipoNegro: { jugadores: [], mediaTotal: 0 },
            marcador: { equipoBlanco: 0, equipoNegro: 0 },
            suplentes: [],
            highlights: [],
            estado: 'Abierto'
        };
    }
}
