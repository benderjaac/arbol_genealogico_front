import { Injectable } from '@angular/core';
import { ApiFilter, ApiQuery, ApiSort } from 'app/core/models/query.model';
import { TableLazyLoadEvent } from 'primeng/table';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  constructor() { }

  public buildQuery(event: TableLazyLoadEvent, rowsDefault:number, OrderDefault: ApiSort[]):ApiQuery{

    const filters: ApiFilter[] = [];

    if (event.filters) {
      for (const field in event.filters) {
        const filterMeta = event.filters[field];
        if(filterMeta !== undefined){
          const filter = Array.isArray(filterMeta) ? filterMeta[0] : filterMeta;
          const filterValue = filter.value;
          const matchMode = filter.matchMode;

          if (filterValue !== null && filterValue !== undefined && filterValue !== '') {
            let type =
              filterValue instanceof Date ? 'date' :
              (typeof filterValue === 'boolean' ? 'boolean' :
              (typeof filterValue === 'number' ? 'number' : 'string'));

            if (matchMode === 'between' && Array.isArray(filterValue) && filterValue.length === 2) {
              let start = undefined;
              let end = undefined;
              let type; 
              if(field==='fecha'){
                start = filterValue[0].toISOString().split('T')[0];
                end = filterValue[1].toISOString().split('T')[0];  
                type ='date';
              }else{
                start = filterValue[0];
                end = filterValue[1];
                type ='number';
              }              

              filters.push(
                {
                  field,
                  operator: '>=',
                  value: start,
                  type: type
                },
                {
                  field,
                  operator: '<=',
                  value: end,
                  type: type
                }
              );
            } else {
              let operator = '=';
              switch (matchMode) {
                case 'contains':
                case 'startsWith':
                case 'endsWith':
                  operator = '_lk_';
                  break;
                case 'equals':
                  operator = '=';
                  type = 'boolean';
                  break;
              }

              let valueToSend = filterValue;
              if (type === 'date') {
                valueToSend = (filterValue as Date).toISOString().split('T')[0];
              }

              filters.push({
                field,
                operator,
                value: valueToSend,
                type
              });
            }
          }
        }        
      }
    }

    const page = (event.first ?? 0) / (event.rows ?? rowsDefault) + 1;
    const perPage = event.rows ?? rowsDefault;

    return {
      filters: filters,
      sorter: typeof event.sortField === 'string'
      ? [{
          field: event.sortField,
          order: event.sortOrder === 1 ? 'ASC' : 'DESC',
        }]
      : OrderDefault,
      pagination: {
        perPage: perPage,
        currentPage: page,
      },
    };
    
  }
}
