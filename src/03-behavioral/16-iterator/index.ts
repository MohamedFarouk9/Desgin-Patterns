/**
 * Iterator Pattern — Cursor-Based Paginated Log Streamer
 * Traverses a large dataset page-by-page without exposing underlying storage or loading everything into RAM.
 */
export interface CustomIterator<T> {
  hasNext(): boolean;
  next(): T;
}

export class PaginatedLogCollection {
  constructor(private readonly logs: string[], private readonly pageSize = 2) {}

  public createIterator(): CustomIterator<string[]> {
    let cursor = 0;
    const { logs, pageSize } = this;

    return {
      hasNext: () => cursor < logs.length,
      next: () => {
        const slice = logs.slice(cursor, cursor + pageSize);
        cursor += pageSize;
        return slice;
      },
    };
  }
}
