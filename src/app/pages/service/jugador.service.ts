import { HttpClient } from '@angular/common/http';
import { Injectable, signal} from '@angular/core';
import { Observable } from 'rxjs';

export interface Estadisticas {
  partidosJugados: number;
  partidosGanados: number;
  goles: number;
  asistencias: number;
  atajadas: number;
}

export interface Jugador {
  id?: string;
  nombre?: string;
  apodo?: string;
  pos_principal?: string;
  pos_secundaria?: string;
  pierna_habil?: string;
  media?: number;
  estadisticas?: Estadisticas;
}



@Injectable({
  providedIn: 'root'
})
export class JugadorService {
  private apiUrl = 'https://bluelockb.onrender.com/api/jugadores';

  // Signal para almacenar los jugadores de forma reactiva
  jugadores = signal<Jugador[]>([]);

  constructor(private http: HttpClient) {}

  // Método para cargar los datos desde la API
  cargarJugadores(): void {
    this.http.get<Jugador[]>(this.apiUrl).subscribe(data => {
      this.jugadores.set(data); // Se actualiza el signal con la nueva información
    });
  }
  agregarJugador(jugador: Jugador): Observable<Jugador> {
    return this.http.post<Jugador>(this.apiUrl, jugador);
    }
    obtenerMaximos(): Observable<any> {
      return this.http.get<any>(`${this.apiUrl}/Maximos`);
    }
  editarJugador(jugador: Jugador): Observable<Jugador> {
    return this.http.put<Jugador>(`${this.apiUrl}/${jugador.id}`, jugador);
    }
    eliminarJugador(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
  getData(): Observable<Jugador[]> {
    return this.http.get<Jugador[]>(this.apiUrl);
  }
}
