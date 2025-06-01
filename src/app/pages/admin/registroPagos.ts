import { Component, computed, OnInit, signal } from '@angular/core';
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
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { JugadorService, Jugador } from '../service/jugador.service';

@Component({
  selector: 'app-registro-pagos',
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
    ToggleSwitchModule,
    ConfirmDialogModule,
  ],
  templateUrl: 'registroPagos.html',
  providers: [MessageService, JugadorService, ConfirmationService],
})
export class registroPagos implements OnInit {
  jugadores = signal<Jugador[]>([]);
  jugadoresOriginal = signal<Jugador[]>([]);

  constructor(private jugadorService: JugadorService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {}

  ngOnInit(): void {
    this.cargarJugadores();
  }

  cargarJugadores(): void {
    this.jugadorService.cargarJugadores(); // Asume que ya actualiza el signal internamente
    this.jugadores = this.jugadorService.jugadores;
    this.jugadoresOriginal.set(structuredClone(this.jugadores()));
  }

  cambiarEstado(jugador: Jugador, event: boolean ): void {
    const actualizados = [...this.jugadores()];
    const index = actualizados.findIndex(j => j.id === jugador.id);
    if (index !== -1) {
      actualizados[index] = { ...actualizados[index], estadoPagos: event };
      this.jugadores.set(actualizados);
    }
  }

  guardarCambios(): void {
    const originales = this.jugadoresOriginal();
    const actuales = this.jugadores();

    const modificados = actuales
      .filter((jugador, i) => jugador.estadoPagos !== originales[i]?.estadoPagos)
      .map(j => ({ id: j.id!, estadoPagos: j.estadoPagos! }));

    if (modificados.length === 0) {
      alert('No hay cambios para guardar');
      return;
    }

    // Mostrar confirmación
  this.confirmationService.confirm({
    message: '¿Estás seguro de que deseas guardar los cambios?',
    header: 'Confirmar cambios',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Sí',
    rejectLabel: 'No',
    accept: () => {
      // Si acepta, procede a guardar
      this.jugadorService.actualizarPagos(modificados).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Cambios guardados correctamente',
          });
          this.cargarJugadores();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al guardar los cambios',
          });
        },
      });
    }
  });
}
}
