import { DSStore } from '../../src/module/tablesmith/dsstore/dsstore';
import { DSStores, DSStoreDatabase } from '../../src/module/tablesmith/dsstore/dsstores';
import { ObjectArrayDSStore } from '../../src/module/tablesmith/dsstore/objectarraydsstore';
import { DSStoreFactory } from '../../src/module/tablesmith/dsstore/dsstoryfactory';

let dsstores: DSStores;
let db: DSStoreDatabase;
let data: Map<string, string>;
const storename = 'storename';
let value: unknown[];
let store: DSStore;
let dsStoreFactory = new class SimpleDSStoreFactory implements DSStoreFactory {
  get(name: string): DSStore | null {
    return null;
  }
};

describe('DSStores', () => {
  beforeEach(() => {
    data = new Map();
    db = {
      async datastores(): Promise<Map<string, string>> {
        return new Map();
      },
      get: async function (key: string): Promise<string | undefined> {
        return data.get(key);
      },
      set: async function (key: string, value: string): Promise<void> {
        data.set(key, value);
      },
    };
    dsstores = new DSStores(db, dsStoreFactory);
  });

  it('#get(key) for known key, gets data', async () => {
    value = [{ name: 'name' }];
    data.set(storename, JSON.stringify(value));
    store = new ObjectArrayDSStore(storename, value);
    const result = await dsstores.get(storename);
    expect(result).toEqual(store);
  });

  it('#save(store) replaces key with new value', async () => {
    value = [{ name: 'name' }];
    store = new ObjectArrayDSStore(storename, value);
    await dsstores.save(store);
    expect(data.get(storename)).toEqual(JSON.stringify(value));
  });
});
