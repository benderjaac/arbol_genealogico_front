import {Genero} from '../enums/enums';

export interface Person{
  id:number,
  nombre:string,
  apellidoPaterno:string,
  apellidoMaterno:string,
  nombreCompleto:string,
  fechaNacimiento:string,
  genero:keyof typeof Genero,
  lugarNacimiento:string,
  notas:string,
  photoUrl:string,
  editing?: boolean,
}

export interface PersonCreateDto {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fechaNacimiento: Date;
  genero: string;
  lugarNacimiento: string;
  notas: string;
}
