import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, Signal } from '@angular/core';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { Partido, PartidoService } from '../service/partido.service';

interface Jugador {
  nombre: string;
  imagen: string;
  media: number;
  posicion: string;
}

interface Posicion {
  posicion: string;
  row: number;
  col: number;
  jugador?: Jugador | null;
}

@Component({
  selector: 'app-formacion',
  standalone: true,
  imports: [
    CommonModule,
    CardModule, // Importa p-card
    AvatarModule, // Importa p-avatar
    BadgeModule // Importa p-badge
  ],
  templateUrl: './formacion.html',
  styleUrls: ['./formacion.css']
})
export class Formacion implements OnInit {
  partidoSeleccionado!: Signal<Partido | null>;
  @Input() idPartido!: string;  // ID de ejemplo, puedes cambiarlo
  partido: any;

  constructor(private partidoService: PartidoService) {}

  ngOnInit() {
    // Obtener el partido como Signal (esto es un ejemplo)
    this.partidoService.buscarPartidoByID(this.idPartido).subscribe(
      (data) => {
        this.partido = data;
        const posiciones = [
          { posicion: 'POR', row: 4, col: 3 },
          { posicion: 'DFC', row: 3, col: 2 },
          { posicion: 'DFC', row: 3, col: 4 },
          { posicion: 'MC', row: 2, col: 2 },
          { posicion: 'MC', row: 2, col: 4 },
          { posicion: 'DC', row: 1, col: 3 }
        ];
        const formacionBlanco = this.asignarPosiciones(this.partido.equipoBlanco.jugadores, posiciones);
        const formacionNegro = this.asignarPosiciones(this.partido.equipoNegro.jugadores, posiciones);
        this.partido.equipoBlanco.jugadores = formacionBlanco
        this.partido.equipoNegro.jugadores = formacionNegro
        },
      (error) => {
        console.error('Error obteniendo partido:', error);
      }
    );  
  }

  
  // Método para calcular la media de un equipo
  calcularMedia(equipo: Jugador[]): number {
    const totalMedia = equipo.reduce((sum, jugador) => sum + jugador.media, 0);
    
    return Math.round((totalMedia / equipo.length));
  }
  // Función para asignar row y col según la posición usada
  asignarPosiciones = (jugadores: any[], posiciones: any[]) => {    
    const posicionesDisponibles = [...posiciones];
    const listaJugadores = Array.isArray(jugadores) ? jugadores : [];
    const jugadoresConPosicion = listaJugadores.map(j => {
      // Encuentra la primera posición disponible para la `posicionUsada` del jugador
      const indicePosicion = posicionesDisponibles.findIndex(p => p.posicion === j.posicionUsada);
    
      if (indicePosicion !== -1) {
        // Extrae y elimina la posición usada para que no se repita en otro jugador
        const [posicionAsignada] = posicionesDisponibles.splice(indicePosicion, 1);
    
        return {
          ...j,
          row: posicionAsignada.row,
          col: posicionAsignada.col,
          imagen: `assets/${j.jugador.id}.png`
        };
      } else {
        // Si no se encuentra una posición válida, deja los valores en null
        return {
          ...j,
          row: null,
          col: null,
          imagen: null
        };
      }
    });
    return jugadoresConPosicion
  };
}
