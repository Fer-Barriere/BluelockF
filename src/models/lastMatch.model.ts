export interface LastMatchInfo {
    equipoBlanco: Equipo;
    equipoNegro:  Equipo;
    marcador:     Marcador;
    _id:          string;
    suplentes:    Suplente[];
    highlights:   Highlight[];
    estado:       string;
    fecha:        Date;
    __v:          number;
    id:           string;
}

export interface Equipo {
    jugadores: Jugador[];
    mediaTotal: number;
}
export interface Jugador {
    jugador:        JugadorTitular;
    media:          number;
    posicionUsada?: string;
    _id:            string;
}

export interface Suplente extends Jugador {
    equipo: EquipoEnum;
}
export enum EquipoEnum {
    Blanco = "Blanco",
    Negro = "Negro",
}

export interface JugadorTitular {
    datosMedia:     DatosMedia;
    estadisticas:   Estadisticas;
    _id:            string;
    nombre:         string;
    apodo:          string;
    pos_principal:  string;
    pos_secundaria: string;
    pierna_habil:   PiernaHabil;
    media:          number;
    createdAt:      Date;
    updatedAt:      Date;
    __v:            number;
    id:             string;
}

export interface DatosMedia {
    ritmo:   number;
    tiro:    number;
    pase:    number;
    regate:  number;
    defensa: number;
    fisico:  number;
}

export interface Estadisticas {
    partidosJugados:    number;
    partidosGanados:    number;
    goles:              number;
    asistencias:        number;
    atajadas:           number;
    porcentajeVictoria: number;
}

export enum PiernaHabil {
    Derecha = "Derecha",
    Izquierda = "Izquierda",
}

export interface Highlight {
    jugador:     JugadorTitular;
    equipo:      EquipoEnum;
    goles:       number;
    asistencias: number;
    atajadas:    number;
    _id:         string;
}

export interface Marcador {
    equipoBlanco: number;
    equipoNegro:  number;
}
