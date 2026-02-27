import { perfil } from "./perfil.model";
import {Genero} from '../enums/enums';

export interface Person{
  id:number,
  nombre:string,
  apellidoPaterno:string,
  apellidoMaterno:string,
  nombreCompleto:string,
  alias:string,
  fechaNacimiento:string,
  genero:keyof typeof Genero,
  lugarNacimiento:string,
  notas:string,
  editing?: boolean,
}
