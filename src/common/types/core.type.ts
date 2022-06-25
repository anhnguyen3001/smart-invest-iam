export enum ORDER_BY {
  DESC = 'DESC',
  ASC = 'ASC',
}

export type QueryBuilderType<T> = Omit<T, 'page' | 'pageSize' | 'getAll'>;
