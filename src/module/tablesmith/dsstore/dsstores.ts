import { DSStore } from './dsstore';
import { DSStoreFactory } from './dsstoryfactory';
import { ObjectArrayDSStore } from './objectarraydsstore';

/**
 * DSStoreDatabase provides the Backend to save the Data to any backend.
 */
export type DSStoreDatabase = {
  datastores(): Promise<Map<string, string>>;
  get(key: string): Promise<string | undefined>;
  set(key: string, value: string): Promise<void>;
};

/**
 * DSStores gives access to all stores defined or not defined.
 */
export class DSStores {
  db: DSStoreDatabase;
  factory: DSStoreFactory;
  constructor(db: DSStoreDatabase, factory: DSStoreFactory) {
    this.db = db;
    this.factory = factory;
  }

  /**
   * Returns the parsed Database.
   * @param storename to retrieve.
   * @returns DSStore containing the parsed Datastructure.
   */
  async get(storename: string): Promise<DSStore> {
    let result = this.factory.get(storename);
    if (result === null) {
      const jsonData = await this.db.get(storename);
      if (!jsonData) throw Error(`Could not get DSStore for name '${storename}'`);
      const data = JSON.parse(jsonData) as Map<string, string>[];
      result = new ObjectArrayDSStore(storename, data);
    }
    return result;
  }

  /**
   * Saves given DSStore to db.
   * @param dsstore to save.
   */
  async save(dsstore: DSStore): Promise<void> {
    const jsonString = dsstore.getDataAsJsonString();
    await this.db.set(dsstore.getName(), jsonString);
  }
}
