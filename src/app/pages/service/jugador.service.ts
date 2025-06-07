import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';

export interface Estadisticas {
  partidosJugados: number;
  partidosGanados: number;
  goles: number;
  asistencias: number;
  atajadas: number;
  porcentajeVictoria: number;
}
export interface datosMedia {
    ritmo?: number,
    tiro?: number,
    pase?: number,
    regate?: number,
    defensa?: number,
    fisico?: number,
}
export interface Jugador {
  id?: string;
  nombre?: string;
  apodo?: string;
  pos_principal?: string;
  pos_secundaria?: string;
  pierna_habil?: string;
  media?: number;
  datosMedia?: datosMedia
  estadisticas?: Estadisticas;
  estadoPagos?: boolean;
}
export interface MaximoJugador {
  title: string;
  player: string;
  stat: number;
  image: string;
}

export interface MaxStatCard {
  title: string;
  imageUrl: string;
  player: string;
  stat: number;
}
@Injectable({
  providedIn: 'root',
})
export class JugadorService {
  private apiUrl = 'https://bluelockb.onrender.com/api/jugadores'; //'http://localhost:5000/api/jugadores'

  // Signal para almacenar los jugadores de forma reactiva
  jugadores = signal<Jugador[]>([]);

  constructor(private http: HttpClient) {}

  // Método para cargar los datos desde la API
  cargarJugadores(): void {
    this.http.get<Jugador[]>(this.apiUrl).subscribe((data) => {
      this.jugadores.set(data); // Se actualiza el signal con la nueva información
    });
  }
  actualizarPagos(jugadoresActualizados: { id: string; estadoPagos: boolean }[]): Observable<any> {
    return this.http.put(`${this.apiUrl}/actualizarPagos`, { jugadores: jugadoresActualizados });
  }

  obtenerLeaderboard(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/leaderboard`);
  }
  getleaderboardMedia(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/leaderboardMedia75`);
  }
  cargarJugadoresDisp(): Observable<Jugador[]> {
    return this.http.get<Jugador[]>(this.apiUrl)
  }
  agregarJugador(jugador: Jugador): Observable<Jugador> {
    return this.http.post<Jugador>(this.apiUrl, jugador);
  }
  obtenerMaximo2(): Observable<MaxStatCard[]> {
    return this.http.get<MaxStatCard[]>(`${this.apiUrl}/Maximos`);
  }
  obtenerMaximos(): Observable<MaximoJugador[]> {
    return this.http.get<MaximoJugador[]>(`${this.apiUrl}/Maximos`);
  }
  editarJugador(jugador: Jugador): Observable<Jugador> {
    return this.http.put<Jugador>(`${this.apiUrl}/${jugador.id}`, jugador);
  }
  eliminarJugador(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
