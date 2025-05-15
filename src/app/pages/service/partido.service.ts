import { HttpClient } from '@angular/common/http';
import { Injectable, Signal, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { LastMatchInfo } from '../../../models/lastMatch.model';

export interface Jugador {
  id?: string;
  pos_principal?: string;
  pos_secundaria?: string;
  media?: number;
  posicionUsada?: string;
}

export interface Highlight {
  jugador: Jugador;
  equipo: string;
  goles: number;
  asistencias: number;
  atajadas: number;
}

export interface Partido {
  id?: string;
  fecha?: string;
  equipoBlanco: {
    jugadores: Jugador[];
    mediaTotal: number;
  };
  equipoNegro: {
    jugadores: Jugador[];
    mediaTotal: number;
  };
  suplentes: Jugador[]; // Suplentes en un array de jugadores
  marcador: {
    equipoBlanco: number;
    equipoNegro: number;
  };
  highlights: Highlight[];
  estado: string;
}

@Injectable({
  providedIn: 'root',
})
export class PartidoService {
  constructor(private http: HttpClient) {}
  private apiUrl = 'https://bluelockb.onrender.com/api/partidos';

  partidos = signal<Partido[]>([]);

  cargarPartidos(): void {
    this.http.get<Partido[]>(this.apiUrl).subscribe((data) => {
      this.partidos.set(data); // Se actualiza el signal con la nueva información
    });
  }
  buscarPartidoByID(partidoId: string): Observable<Partido> {
    return this.http.get<Partido>(`${this.apiUrl}/${partidoId}`);
  }
  agregarPartido(jugadores: string[]): Observable<Partido> {
    // Enviamos el arreglo de jugadores como parte del cuerpo de la solicitud
    return this.http.post<Partido>(`${this.apiUrl}/generar`, {
      ids: jugadores,
    });
  }
  // Método para eliminar un partido
  eliminarPartido(partidoId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/eliminarPartido/${partidoId}`
    );
  }

  // Método para obtener el ultimo partido
  obtenerUltimoPartido(): Observable<LastMatchInfo> {
    return this.http.get<LastMatchInfo>(`${this.apiUrl}/ultimo-partido`);
  }
}
