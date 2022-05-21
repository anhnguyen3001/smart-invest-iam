import { SelectQueryBuilder } from 'typeorm';

interface IPaginationMeta {
  totalItems?: number;
  totalPages?: number;
}

export interface IPaginationOptions {
  /**
   * @default 10
   * the amount of items to be requested per page
   */
  limit: number;

  /**
   * @default 1
   * the page that is requested
   */
  page: number;
}

class Pagination<PaginationObject> {
  constructor(
    /**
     * a list of items to be returned
     */
    public readonly items: PaginationObject[],
    /**
     * associated meta information (e.g., counts)
     */
    public readonly meta: IPaginationMeta,
  ) {}
}

export const paginate = async <T>(
  queryBuilder: SelectQueryBuilder<T>,
  options: IPaginationOptions,
): Promise<Pagination<T>> => {
  const { limit = 10, page = 1 } = options;
  const items = await queryBuilder
    .take(limit)
    .skip((page - 1) * limit)
    .getMany();

  const totalItems = await queryBuilder.getCount();
  const totalPages = Math.ceil(totalItems / limit);

  return {
    items,
    meta: {
      totalItems,
      totalPages,
    },
  };
};
