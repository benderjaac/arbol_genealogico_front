export interface PermisoDTO{
  id: number,
  nombre: string | null,
  descri: string | null,
  icon: string | null,  
  link: string | null,  
  padre_id: number | null,
  rol : null,
  visible : boolean,
  hijos: PermisoDTO[],
}