import { DSStore } from "./dsstore";

/**
 * Factory to create a DSStore, needs to be implemented and provided.
 */
export interface DSStoreFactory {
  
  /**
   * Returns store for given name.
   * @param name of DSStore to return.
   * @returns store for name or null if no store exists.
   */
  get(name: string): DSStore | null;

}
