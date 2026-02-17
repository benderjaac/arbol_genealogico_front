export interface Ahorro{
    id: number,
    fecha_inicio: string,
    descri: string,
    monto_meta: number,
    monto_actual: number,
    porcentaje?: number;
}