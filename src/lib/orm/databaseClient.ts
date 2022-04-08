export default abstract class DatabaseClient {
  async find(targetId: string): Promise<any> {
    return [];
  }

  async save(targetId: string, newData: any): Promise<void> {}
}

export class DummyDatabaseClient extends DatabaseClient {
  data: { [key: string]: Array<any> } = {};

  constructor(data: { [key: string]: Array<any> }) {
    super();
    this.data = data;
  }

  override async find(targetId: string): Promise<any[]> {
    return this.data[targetId] ?? [];
  }

  override async save(targetId: string, newData: any): Promise<void> {
    const curr = this.data[targetId] ?? [];
    this.data = { ...this.data, [targetId]: [...curr, newData] };
  }
}
