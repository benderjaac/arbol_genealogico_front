import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateFormatsService {

  constructor() { }

  /**
   * Convierte una fecha en formato "YYYY-MM-DD" a "mes año" (ej. "enero 2025").
   * Si la fecha es inválida, regresa un string vacío.
   */
  formatoMesAnio(fecha: string): string {
    if (!fecha) return '';
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    // Extraer año y mes de la cadena
    const partes = fecha.split('-');
    if (partes.length !== 3) return '';
    const anio = partes[0];
    const mesIndice = parseInt(partes[1], 10) - 1;
    if (isNaN(mesIndice) || mesIndice < 0 || mesIndice > 11) return '';
    return `${meses[mesIndice]} ${anio}`;
  }

}
