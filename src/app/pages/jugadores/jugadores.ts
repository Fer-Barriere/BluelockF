import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
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
import { Jugador, JugadorService, Estadisticas } from '../service/jugador.service';
import { BadgeModule } from 'primeng/badge';

interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

interface ExportColumn {
    title: string;
    dataKey: string;
}

@Component({
    selector: 'app-jugadores',
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
        BadgeModule
    ],
    templateUrl: 'jugadores.html',
    providers: [MessageService, JugadorService, ConfirmationService]
})
export class Jugadores implements OnInit {
    jugadorDialog: boolean = false;
    estadisticasDialog: boolean = false;

    jugadores = signal<Jugador[]>([]);
    data: Jugador[] = [];

    jugador!: Jugador;

    estadisticas!: Estadisticas;

    selectedJugador!: Jugador[] | null;

    submitted: boolean = false;

    statuses!: any[];

    @ViewChild('dt') dt!: Table;

    exportColumns!: ExportColumn[];

    cols!: Column[];

    constructor(
        private jugadorService: JugadorService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit() {
        this.jugadorService.cargarJugadores(); // Llama a la API para obtener los datos
        this.jugadores = this.jugadorService.jugadores;     
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNew() {
        this.jugador = {};
        this.submitted = false;
        this.jugadorDialog = true;
    }

    editJugador(jugador: Jugador) {
        this.jugador = { ...jugador };
        this.jugadorDialog = true;

        console.log(this.jugador.id);
    }
    estadisticasJugador(jugador: Jugador){
        this.estadisticas = {
            partidosJugados: jugador.estadisticas?.partidosJugados ?? 0,
            partidosGanados: jugador.estadisticas?.partidosGanados ?? 0,
            goles: jugador.estadisticas?.goles ?? 0,
            asistencias: jugador.estadisticas?.asistencias ?? 0,
            atajadas: jugador.estadisticas?.atajadas ?? 0
        };
        this.estadisticasDialog = true;
    }
    deleteJugador(jugador: Jugador) {
        this.confirmationService.confirm({
            message: `¿Estás seguro de que deseas eliminar a ${jugador.nombre}?`,
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.jugadorService.eliminarJugador(jugador.id!).subscribe({
                    next: () => {
                        this.jugadorService.cargarJugadores(); // Recargar lista después de eliminar
                        this.messageService.add({ severity: 'warn', summary: 'Eliminado', detail: 'Jugador eliminado correctamente' });
                    },
                    error: (error) => {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el jugador' });
                    }
                });
        }});
    }

    hideDialog() {
        this.jugadorDialog = false;
        this.submitted = false;
        this.estadisticasDialog = false;
    }
    posiciones = [
        { label: 'POR', value: 'POR' },
        { label: 'LD', value: 'LD' },
        { label: 'LI', value: 'LI' },
        { label: 'DFC', value: 'DFC' },
        { label: 'MCD', value: 'MCD' },
        { label: 'MC', value: 'MC' },
        { label: 'MCO', value: 'MCO' },
        { label: 'MD', value: 'MD' },
        { label: 'MI', value: 'MI' },
        { label: 'ED', value: 'ED' },
        { label: 'EI', value: 'EI' },
        { label: 'DC', value: 'DC' }        
      ];
    piernaHab = [
        {label: 'Derecha', value: 'Derecha'},
        {label: 'Izquierda', value: 'Izquierda'}
    ]
    saveJugador() {
        this.submitted = true;
    
    if (!this.jugador.nombre || !this.jugador.apodo || !this.jugador.pos_principal || 
        !this.jugador.pos_secundaria || !this.jugador.pierna_habil || 
        this.jugador.media === null || this.jugador.media === undefined) {
        return; // No guarda si hay errores
    }
        if (this.jugador.id) {
            // Editar jugador
            this.jugadorService.editarJugador(this.jugador).subscribe(() => {
                this.jugadorService.cargarJugadores();
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Jugador actualizado correctamente' });
                this.jugadorDialog = false // Cerrar popup
            });
        } else {
            // Agregar jugador
            this.jugadorService.agregarJugador(this.jugador).subscribe(() => {
                this.jugadorService.cargarJugadores();
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Jugador agregado correctamente' });
                this.jugadorDialog = false
            });
        }
    }
}