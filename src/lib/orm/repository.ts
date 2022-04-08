import "reflect-metadata";
import DatabaseClient from "./databaseClient";
import { ColumnMetadata, COLUMN_METADATA_KEY } from "./columnDecorator";

export default class Repository<DatabaseType, Entity> {
  EntityModel: new (...arg: any) => Entity;
  databaseClient: DatabaseClient;
  targetId: string;
  metaDataList: { key: string; metadata: ColumnMetadata<any, DatabaseType> }[];

  constructor(init: {
    databaseClient: DatabaseClient;
    targetId: string;
    EntityModel: new (...arg: any) => Entity;
  }) {
    this.databaseClient = init.databaseClient;
    this.targetId = init.targetId;
    this.EntityModel = init.EntityModel;
    const entity = new this.EntityModel("", 3);
    this.metaDataList = Object.getOwnPropertyNames(entity)
      .map((key) => ({
        key,
        metadata: Reflect.getMetadata(COLUMN_METADATA_KEY, entity, key),
      }))
      .filter(({ metadata }) => metadata);
  }

  async find(): Promise<Entity[]> {
    const dataList = await this.databaseClient.find(this.targetId);
    return dataList.map((data: any) => {
      const entity = new this.EntityModel();
      this.metaDataList.forEach(({ key, metadata }) => {
        const rawData = data[metadata.rawName ?? key];
        // @ts-ignore
        entity[key] = metadata.type.decoder(rawData);
      });
      return entity;
    });
  }

  async save(entity: Entity): Promise<void> {
    const data = this.metaDataList
      .map(({ key, metadata }) => {
        const rawName = metadata.rawName ?? key;
        // @ts-ignore
        const rawValue = entity[key];
        const value = metadata.type.encoder(rawValue);
        return {
          rawName,
          value,
        };
      })
      .reduce(
        (prev, { rawName, value }) => ({
          ...prev,
          [rawName]: value,
        }),
        {}
      );
    await this.databaseClient.save(this.targetId, data);
  }
}
