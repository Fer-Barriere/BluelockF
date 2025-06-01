import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, Signal } from '@angular/core';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { Partido, PartidoService } from '../service/partido.service';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { JugadorService } from '../service/jugador.service';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';

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
        BadgeModule, // Importa p-badge
        ButtonModule,
        TableModule,
        ConfirmDialogModule,
        SelectModule,
        FormsModule,
        ToastModule
    ],
    templateUrl: './formacion.html',
    styleUrls: ['./formacion.css'],
    providers: [MessageService, ConfirmationService]
})
export class Formacion implements OnInit {
    @Input() idPartido!: string; // ID de ejemplo, puedes cambiarlo
    partido: any;
    selectedJugadoresBlanco: any[] = [];
    selectedJugadoresNegro: any[] = [];
    equipoBlanco: any[] = [];
    equipoNegro: any[] = [];
    jugadorNuevoSeleccionado: any = null;
    jugadoresNuevosDisponibles: any[] = [];
    jugadores: any[] = [];
    yaInscritosIds: any[] = [];
    @Output() cargarPartidosP = new EventEmitter<void>();
    posiciones = [
      { posicion: 'POR', row: 4, col: 3 },
      { posicion: 'DFC', row: 3, col: 2 },
      { posicion: 'DFC', row: 3, col: 4 },
      { posicion: 'MC', row: 2, col: 2 },
      { posicion: 'MC', row: 2, col: 4 },
      { posicion: 'DC', row: 1, col: 3 }
  ];
    constructor(
        private partidoService: PartidoService,
        private jugadorService: JugadorService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit() {
        // Obtener el partido como Signal (esto es un ejemplo)
        this.partidoService.buscarPartidoByID(this.idPartido).subscribe(
            (data) => {
                this.partido = data;
                
                const formacionBlanco = this.asignarPosiciones(this.partido.equipoBlanco.jugadores, this.posiciones);
                const formacionNegro = this.asignarPosiciones(this.partido.equipoNegro.jugadores, this.posiciones);
                this.partido.equipoBlanco.jugadores = formacionBlanco;
                this.partido.equipoNegro.jugadores = formacionNegro;
                this.generarLista();
                this.cargarJugadoresDisponibles()
            },
            (error) => {
                console.error('Error obteniendo partido:', error);
            }
        );
        this.jugadorService.cargarJugadoresDisp().subscribe(jugadores => {
          this.jugadores = jugadores;     
        });        
    }
    cargarJugadoresDisponibles() {
     this.yaInscritosIds = [
        ...this.partido.equipoBlanco.jugadores,
        ...this.partido.equipoNegro.jugadores,
        ...this.partido.suplentes
      ].map(j => j.jugador.id || j.id); // Asegúrate de que sea consistente
      this.jugadoresNuevosDisponibles = this.jugadores.filter(j => !this.yaInscritosIds.includes(j.id))
    }
    ActualizarMediaTotal(){
      // 🔵 Calcular medias incluyendo titulares y suplentes
      const jugadoresBlanco = [...this.partido.equipoBlanco.jugadores, ...this.partido.suplentes.filter((j: { equipo: string }) => j.equipo === 'Blanco')];
      const jugadoresNegro = [...this.partido.equipoNegro.jugadores, ...this.partido.suplentes.filter((j: { equipo: string }) => j.equipo === 'Negro')];

      const totalMediaBlanco = jugadoresBlanco.reduce((acc, j) => acc + j.media, 0);
      const totalMediaNegro = jugadoresNegro.reduce((acc, j) => acc + j.media, 0);

      this.partido.equipoBlanco.mediaTotal = jugadoresBlanco.length ? Math.round(totalMediaBlanco / jugadoresBlanco.length) : 0;
      this.partido.equipoNegro.mediaTotal = jugadoresNegro.length ? Math.round(totalMediaNegro / jugadoresNegro.length) : 0;
    }
    agregarASuplente(jugador: any, equipo: 'Blanco' | 'Negro') {
      const nuevoSuplente = {
        jugador: jugador,
        media: jugador.media,
        equipo: equipo,
        tipo: 'Suplente'
      };
    
      this.partido.suplentes.push(nuevoSuplente);
    
      this.jugadorNuevoSeleccionado = null;
      this.cargarJugadoresDisponibles()
      this.ActualizarMediaTotal()
      this.generarLista(); // Si tienes una función para actualizar la vista
    }
    generarLista() {
        const titularesBlanco = this.partido.equipoBlanco.jugadores.map((j: any) => ({
            ...j,
            tipo: 'Titular'
        }));

        const suplentesBlanco = this.partido.suplentes
            .filter((s: { equipo: string }) => s.equipo === 'Blanco')
            .map((s: any) => ({
                ...s,
                posicionUsada: s.jugador.pos_principal,
                tipo: 'Suplente'
            }));

        this.equipoBlanco = [...titularesBlanco, ...suplentesBlanco];

        const titularesNegro = this.partido.equipoNegro.jugadores.map((j: any) => ({
            ...j,
            tipo: 'Titular'
        }));

        const suplentesNegro = this.partido.suplentes
            .filter((s: { equipo: string }) => s.equipo === 'Negro')
            .map((s: any) => ({
                ...s,
                posicionUsada: s.jugador.pos_principal,
                tipo: 'Suplente'
            }));

        this.equipoNegro = [...titularesNegro, ...suplentesNegro];
    }
    guardarCambiosPartido() {
      this.confirmationService.confirm({
        message: `¿Estás seguro de que deseas realizar este cambio?`,
        header: 'Confirmar',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          const equipoBlancoReducido = {
            jugadores: this.partido.equipoBlanco.jugadores.map((j: { jugador: { id: any; _id: any }; media: any; posicionUsada: any }) => ({
              jugador: j.jugador.id || j.jugador._id,
              media: j.media,
              posicionUsada: j.posicionUsada
            })),
            mediaTotal: this.partido.equipoBlanco.mediaTotal
          };
          
          const equipoNegroReducido = {
            jugadores: this.partido.equipoNegro.jugadores.map((j: { jugador: { id: any; _id: any }; media: any; posicionUsada: any }) => ({
              jugador: j.jugador.id || j.jugador._id,
              media: j.media,
              posicionUsada: j.posicionUsada
            })),
            mediaTotal: this.partido.equipoNegro.mediaTotal
          };
          
          const suplentesReducidos = this.partido.suplentes.map((s: { jugador: { id: any; _id: any }; media: any; equipo: any }) => ({
            jugador: s.jugador.id || s.jugador._id,
            media: s.media,
            equipo: s.equipo
          }));
  
          const partidoActualizado = {
            equipoBlanco: equipoBlancoReducido,
            equipoNegro: equipoNegroReducido,
            suplentes: suplentesReducidos
          };
  
  
        this.partidoService.actualizarAlineacionPartido(this.idPartido, partidoActualizado)
          .subscribe({
            next: (respuesta) => {
              this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Alineacion Actualizada' });
              this.generarListaPartido()
            },
            error: (error) => {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo realizar la Actualizacion' });
            }
          });
        }
    });

        
    }
  
    intercambiarJugadoresMismoEquipo(jugador1: any, jugador2: any) {
      const esSuplente1 = !!jugador1.equipo;
      const esSuplente2 = !!jugador2.equipo;
    
      if (esSuplente1 !== esSuplente2) {
        // Intercambio entre titular y suplente
        const equipo = jugador1.equipo || jugador2.equipo;
    
        const listaTitulares = equipo === 'Blanco'
          ? this.partido.equipoBlanco.jugadores
          : this.partido.equipoNegro.jugadores;
    
        const listaSuplentes = this.partido.suplentes;
    
        const idxTitular = listaTitulares.findIndex((j: any) => j._id === (esSuplente1 ? jugador2._id : jugador1._id));
        const idxSuplente = listaSuplentes.findIndex((j: any) => j._id === (esSuplente1 ? jugador1._id : jugador2._id));
    
        if (idxTitular !== -1 && idxSuplente !== -1) {
          const titularOriginal = listaTitulares[idxTitular];
          const suplenteOriginal = listaSuplentes[idxSuplente];
    
          // Crear nuevo titular con propiedades del suplente pero conservando la posición
          const nuevoTitular = {
            ...suplenteOriginal,
            posicionUsada: titularOriginal.posicionUsada,
            row: titularOriginal.row,
            col: titularOriginal.col
          };
          delete nuevoTitular.equipo; // Ya no es suplente
    
          // Crear nuevo suplente con propiedades del titular
          const nuevoSuplente = {
            ...titularOriginal,
            equipo: equipo
          };
          delete nuevoSuplente.posicionUsada;
          delete nuevoSuplente.row;
          delete nuevoSuplente.col;
    
          listaTitulares[idxTitular] = nuevoTitular;
          listaSuplentes[idxSuplente] = nuevoSuplente;
        }
    
      } else {
        // Intercambio entre dos titulares o dos suplentes
        let lista: any[] = [];
    
        if (!esSuplente1 && !esSuplente2) {
          const equipo = this.obtenerEquipo(jugador1._id);
          lista = equipo === 'Blanco'
            ? this.partido.equipoBlanco.jugadores
            : this.partido.equipoNegro.jugadores;
        } else {
          lista = this.partido.suplentes;
        }
    
        const idx1 = lista.findIndex(j => j._id === jugador1._id);
        const idx2 = lista.findIndex(j => j._id === jugador2._id);
    
        if (idx1 !== -1 && idx2 !== -1) {
          const jugadorA = lista[idx1];
          const jugadorB = lista[idx2];
    
          // Guardar posiciones visuales
          const posA = {
            posicionUsada: jugadorA.posicionUsada,
            row: jugadorA.row,
            col: jugadorA.col
          };
    
          const posB = {
            posicionUsada: jugadorB.posicionUsada,
            row: jugadorB.row,
            col: jugadorB.col
          };
    
          // Intercambio con posiciones intercambiadas
          lista[idx1] = { ...jugadorB, ...posA };
          lista[idx2] = { ...jugadorA, ...posB };
        }
      }
    
      this.generarLista();
    }
    
    obtenerEquipo(id: string): 'Blanco' | 'Negro' | null {
      if (this.partido.equipoBlanco.jugadores.some((j: { _id: string; }) => j._id === id)) return 'Blanco';
      if (this.partido.equipoNegro.jugadores.some((j: { _id: string; }) => j._id === id)) return 'Negro';
      return null;
    }
     
    
    intercambiarJugadores() {
        this.confirmationService.confirm({
            message: `¿Estás seguro de que deseas realizar este cambio?`,
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                if(this.selectedJugadoresBlanco.length === 2 && this.selectedJugadoresNegro.length === 0){
                  const jugador1 = this.selectedJugadoresBlanco[0];
                  const jugador2 = this.selectedJugadoresBlanco[1];

                  this.intercambiarJugadoresMismoEquipo(jugador1, jugador2);

                } else if(this.selectedJugadoresBlanco.length === 0 && this.selectedJugadoresNegro.length === 2) {
                  const jugador1 = this.selectedJugadoresNegro[0];
                  const jugador2 = this.selectedJugadoresNegro[1];

                  this.intercambiarJugadoresMismoEquipo(jugador1, jugador2);
                }
                else {
                // Asegurarse de que haya la misma cantidad de seleccionados en ambos equipos
                const cantidad = Math.min(this.selectedJugadoresBlanco.length, this.selectedJugadoresNegro.length);

                for (let i = 0; i < cantidad; i++) {
                    const jugadorBlanco = this.selectedJugadoresBlanco[i];
                    const jugadorNegro = this.selectedJugadoresNegro[i];

                    // Intercambiar jugadores
                    this.realizarIntercambio(jugadorBlanco, jugadorNegro);
                }
              }
                // Limpiar selección
                this.selectedJugadoresBlanco = [];
                this.selectedJugadoresNegro = [];
                
                this.ActualizarMediaTotal()
                const formacionBlanco = this.asignarPosiciones(this.partido.equipoBlanco.jugadores, this.posiciones);
                const formacionNegro = this.asignarPosiciones(this.partido.equipoNegro.jugadores, this.posiciones);
                this.partido.equipoBlanco.jugadores = formacionBlanco;
                this.partido.equipoNegro.jugadores = formacionNegro;
            }
        });
    }
    realizarIntercambio(jugador1: any, jugador2: any) {
      const esTitular = (j: any) => j.tipo === 'Titular';
    
      // Si ambos son del mismo tipo
      if (jugador1.tipo === jugador2.tipo) {
        if (esTitular(jugador1)) {
          // Intercambio entre titulares
          const listaBlanco = this.partido.equipoBlanco.jugadores;
          const listaNegro = this.partido.equipoNegro.jugadores;
    
          const idxBlanco = listaBlanco.findIndex((j: any) => j._id === jugador1._id);
          const idxNegro = listaNegro.findIndex((j: any) => j._id === jugador2._id);
    
          if (idxBlanco !== -1 && idxNegro !== -1) {
            const jugadorBlanco = listaBlanco[idxBlanco];
            const jugadorNegro = listaNegro[idxNegro];
    
            const posicionUsadaBlanco = jugadorBlanco.posicionUsada;
            const posicionUsadaNegro = jugadorNegro.posicionUsada;
    
            listaBlanco[idxBlanco] = {
              ...jugadorNegro,
              posicionUsada: posicionUsadaBlanco,
            };
    
            listaNegro[idxNegro] = {
              ...jugadorBlanco,
              posicionUsada: posicionUsadaNegro,
            };
          }
        } else {
          // Intercambio entre suplentes
          const suplentes = this.partido.suplentes;
          const idx1 = suplentes.findIndex((j: any) => j._id === jugador1._id);
          const idx2 = suplentes.findIndex((j: any) => j._id === jugador2._id);
    
          if (idx1 !== -1 && idx2 !== -1) {
            const tempEquipo = suplentes[idx1].equipo;
            suplentes[idx1].equipo = suplentes[idx2].equipo;
            suplentes[idx2].equipo = tempEquipo;
    
            const tempJugador = suplentes[idx1];
            suplentes[idx1] = suplentes[idx2];
            suplentes[idx2] = tempJugador;
          }
        }
      } else {
        // Intercambio entre titular y suplente
        const titular = esTitular(jugador1) ? jugador1 : jugador2;
        const suplente = esTitular(jugador1) ? jugador2 : jugador1;
    
        const equipoTitular = this.obtenerEquipoJugador(titular);
        const listaTitulares = equipoTitular === 'Blanco' ? this.partido.equipoBlanco.jugadores : this.partido.equipoNegro.jugadores;
    
        const idxTitular = listaTitulares.findIndex((j: any) => j._id === titular._id);
        const idxSuplente = this.partido.suplentes.findIndex((j: any) => j._id === suplente._id);
    
        if (idxTitular !== -1 && idxSuplente !== -1) {
          // Crear nuevo titular
          const nuevoTitular = {
            ...suplente,
            tipo: 'Titular',
            posicionUsada: titular.posicionUsada,
            row: titular.row,
            col: titular.col,
          };
          delete nuevoTitular.equipo; // ← Elimina la propiedad 'equipo' para marcarlo como titular
    
          // Crear nuevo suplente
          const nuevoSuplente = {
            ...titular,
            tipo: 'Suplente',
            equipo: suplente.equipo,
          };
          delete nuevoSuplente.posicionUsada;
          delete nuevoSuplente.row;
          delete nuevoSuplente.col;
    
          // Reemplazar en listas
          listaTitulares[idxTitular] = nuevoTitular;
          this.partido.suplentes[idxSuplente] = nuevoSuplente;
        }
      }
    
      this.generarLista();
    }
    
    getListaTitulares(equipo: string): any[] {
        return equipo === 'Blanco' ? this.partido.equipoBlanco.jugadores : this.partido.equipoNegro.jugadores;
    }

    obtenerEquipoJugador(jugador: any): 'Blanco' | 'Negro' {
        if (this.partido.equipoBlanco.jugadores.some((j: { _id: any }) => j._id === jugador._id)) {
            return 'Blanco';
        } else {
            return 'Negro';
        }
    }

    // Método para calcular la media de un equipo
    calcularMedia(equipo: Jugador[]): number {
        const totalMedia = equipo.reduce((sum, jugador) => sum + jugador.media, 0);

        return Math.round(totalMedia / equipo.length);
    }
    // Función para asignar row y col según la posición usada
    asignarPosiciones = (jugadores: any[], posiciones: any[]) => {
      const posicionesDisponibles = [...posiciones];
      const listaJugadores = Array.isArray(jugadores) ? jugadores : [];
    
      // Define las imágenes disponibles por posición
      const imagenesDisponibles: { [key: string]: string[] } = {
        POR: ['assets/POR1.png', 'assets/POR2.png', 'assets/POR3.png', 'assets/POR4.png'],
        DFC: ['assets/DFC1.png', 'assets/DFC2.png', 'assets/DFC3.png', 'assets/DFC4.png'],
        MC: ['assets/MC1.png', 'assets/MC2.png', 'assets/MC3.png', 'assets/MC4.png'],
        DC: ['assets/DC1.png', 'assets/DC2.png', 'assets/DC3.png', 'assets/DC4.png']
      };
    
      const jugadoresConPosicion = listaJugadores.map((j) => {
        const indicePosicion = posicionesDisponibles.findIndex((p) => p.posicion === j.posicionUsada);
    
        if (indicePosicion !== -1) {
          const [posicionAsignada] = posicionesDisponibles.splice(indicePosicion, 1);
    
          // Saca una imagen aleatoria única de las disponibles para esa posición
          let imagen = null;
          const disponibles = imagenesDisponibles[posicionAsignada.posicion];
    
          if (disponibles && disponibles.length > 0) {
            const randomIndex = Math.floor(Math.random() * disponibles.length);
            imagen = disponibles.splice(randomIndex, 1)[0]; // extrae la imagen y la elimina de la lista
          }
    
          return {
            ...j,
            row: posicionAsignada.row,
            col: posicionAsignada.col,
            imagen: imagen
          };
        } else {
          return {
            ...j,
            row: null,
            col: null,
            imagen: null
          };
        }
      });
    
      return jugadoresConPosicion;
    };
    
    generarListaPartido(){
      this.cargarPartidosP.emit()
    }
    
}
