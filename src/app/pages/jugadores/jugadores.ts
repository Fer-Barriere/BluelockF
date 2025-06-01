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
import { Jugador, JugadorService, Estadisticas, datosMedia } from '../service/jugador.service';
import { BadgeModule } from 'primeng/badge';
import { ChartModule } from 'primeng/chart';
import { FloatLabelModule } from 'primeng/floatlabel';

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
        BadgeModule,
        ChartModule,
        FloatLabelModule 
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

    radarData: any;    

    radarOptions: any;

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
getEmptyJugador(): Jugador {
        return {
              id: '',
              nombre: '',
              apodo: '',
              pos_principal: '',
              pos_secundaria: '',
              pierna_habil: '',
              media: 0,
              datosMedia: {
                  ritmo: 0,
                  tiro: 0,
                  pase: 0,
                  regate: 0,
                  defensa: 0,
                  fisico: 0
              }
        };
    }
    openNew() {
        this.jugador = this.getEmptyJugador();// Inicializa un nuevo jugador
        this.submitted = false;
        this.jugadorDialog = true;
    }

    editJugador(jugador: Jugador) {
        this.jugador = { ...jugador}
        this.jugadorDialog = true;
    }
    calcularMedia() {
        if (this.jugador.datosMedia) {
          const { ritmo, tiro, pase, regate, defensa, fisico } = this.jugador.datosMedia;
          const valores = [ritmo, tiro, pase, regate, defensa, fisico].filter(v => v !== null && v !== undefined);
          if (valores.length > 0) {
            this.jugador.media = Math.round(valores.reduce((sum, val) => sum + val, 0) / valores.length);
          } else {
            this.jugador.media = 0; // Si no hay valores, la media es 0
          }
        }
      }
    initCharts(jugador: Jugador) {
        if (!jugador.datosMedia) return;
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
        const indigo = documentStyle.getPropertyValue('--p-indigo-400');
    
        const data = [
            Math.round(jugador.datosMedia.ritmo ?? 0),
            Math.round(jugador.datosMedia.tiro ?? 0),
            Math.round(jugador.datosMedia.pase ?? 0),
            Math.round(jugador.datosMedia.regate ?? 0),
            Math.round(jugador.datosMedia.defensa ?? 0),
            Math.round(jugador.datosMedia.fisico ?? 0)
        ];
    
        this.radarData = {
            labels: ['Ritmo', 'Tiro', 'Pase', 'Regate', 'Defensa', 'Físico'],
            datasets: [
                {
                    label: 'Media',
                    data: data,
                    borderColor: indigo,
                    backgroundColor: indigo + '33', // transparencia
                    pointBackgroundColor: indigo,
                    pointBorderColor: indigo,
                    pointHoverBackgroundColor: textColor,
                    pointHoverBorderColor: indigo,
                    fill: true
                }
            ]
        };
    
        this.radarOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                r: {
                    suggestedMin: 20,
                    suggestedMax: 100,
                    ticks: {
                        stepSize: 20,
                        color: textColor
                    },
                    pointLabels: {
                        color: textColor,
                        font: {
                            size: 14
                        }
                    },
                    grid: {
                        color: surfaceBorder
                    },
                    angleLines: {
                        color: surfaceBorder
                    }
                }
            }
        };
    }
    
    estadisticasJugador(jugador: Jugador){
        this.initCharts(jugador)
        this.jugador = { ...jugador };
        this.estadisticas = {
            partidosJugados: jugador.estadisticas?.partidosJugados ?? 0,
            partidosGanados: jugador.estadisticas?.partidosGanados ?? 0,
            goles: jugador.estadisticas?.goles ?? 0,
            asistencias: jugador.estadisticas?.asistencias ?? 0,
            atajadas: jugador.estadisticas?.atajadas ?? 0,
            porcentajeVictoria: jugador.estadisticas?.porcentajeVictoria ?? 0
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
        this.jugadorService.cargarJugadores();
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