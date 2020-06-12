import { Timestamp } from 'rxjs';

export interface Horario {
    readonly id: number;
    fecha_inicio: Date;
    duracion_dias: number;
    dias: Array<{dia: number; horas: Array<{inicio: string, fin: string}>}>;
    fecha_fin?: Date;
}
