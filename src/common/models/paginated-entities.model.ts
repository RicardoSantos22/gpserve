export class PaginatedEntities<T> {
  readonly items: T[];
  readonly count: number;
  readonly limit?: number;
  readonly skip?: number;
}
