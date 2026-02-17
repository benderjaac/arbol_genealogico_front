import { PermisoDTO } from "./permisoDTO.model";

export interface perfil {
  id:number,
  descri:string,  
  nombre:string,  
  menu: PermisoDTO[]
}