export interface Movimiento {
    id: number,
    fecha: string,
    descri: string,
    tipo: string,
    monto: number,
    idusuario: number,
    editing?: boolean,
    categoriaColor: string,
    categoriaIcon: string,
    categoriaNombre: string,
    categoria_id: number
}
