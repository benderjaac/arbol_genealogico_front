import {Person} from './person.model';

export interface UnionSummaryDto{
  unionId:number,
  spouse: Person,
  childrenCount: number;
}
