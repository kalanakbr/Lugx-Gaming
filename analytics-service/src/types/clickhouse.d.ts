declare module 'clickhouse' {
  export class ClickHouse {
    constructor(config: any);
    query<T = any>(sql: string, options?: any): {
      stream: () => NodeJS.ReadableStream;
      toPromise: () => Promise<T[]>;
    };
    insert(sql: string, values: any[], options?: any): {
      toPromise: () => Promise<any>;
    };
  }
}
