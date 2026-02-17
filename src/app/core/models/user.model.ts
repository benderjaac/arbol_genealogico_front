import { perfil } from "./perfil.model";

export interface User{
    id:number,
    email:string,
    username:string,
    perfil?:perfil,
    perfil_id?:number,
    perfilNombre?:string
}