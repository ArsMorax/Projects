declare module 'lokijs' {
  interface CollectionOptions<T> {
    unique?: (keyof T)[]
    indices?: (keyof T)[]
    clone?: boolean
    disableMeta?: boolean
    disableChangesApi?: boolean
    disableDeltaChangesApi?: boolean
    adaptiveBinaryIndices?: boolean
    asyncListeners?: boolean
    autoupdate?: boolean
    serializableIndices?: boolean
    transactional?: boolean
    ttl?: number
    ttlInterval?: number
  }

  interface LokiQuery<T> {
    [key: string]: any
  }

  interface ResultSet<T> {
    find(query?: LokiQuery<T>): ResultSet<T>
    where(fun: (doc: T & LokiObj) => boolean): ResultSet<T>
    simplesort(propname: keyof T, options?: boolean | { desc?: boolean }): ResultSet<T>
    sort(comparefun: (a: T & LokiObj, b: T & LokiObj) => number): ResultSet<T>
    limit(qty: number): ResultSet<T>
    offset(pos: number): ResultSet<T>
    data(): (T & LokiObj)[]
    count(): number
    update(fun: (doc: T & LokiObj) => T & LokiObj): void
    remove(): void
  }

  interface LokiObj {
    $loki: number
    meta: { created: number; revision: number; updated?: number; version: number }
  }

  class Collection<T extends object = any> {
    name: string
    data: (T & LokiObj)[]
    insert(doc: T): T & LokiObj
    insertOne(doc: T): T & LokiObj
    find(query?: LokiQuery<T>): (T & LokiObj)[]
    findOne(query?: LokiQuery<T>): (T & LokiObj) | null
    findObject(query?: LokiQuery<T>): (T & LokiObj) | null
    chain(): ResultSet<T>
    get(id: number): (T & LokiObj) | null
    by(field: string, value: any): (T & LokiObj) | null
    update(doc: T & LokiObj): void
    remove(doc: T & LokiObj | number): void
    removeWhere(query: LokiQuery<T> | ((doc: T & LokiObj) => boolean)): void
    clear(options?: { removeIndices?: boolean }): void
    count(query?: LokiQuery<T>): number
    ensureUniqueIndex(field: string): void
    ensureIndex(field: string): void
    on(eventName: string, listener: (...args: any[]) => void): void
    removeListener(eventName: string, listener: (...args: any[]) => void): void
  }

  interface LokiConstructorOptions {
    env?: 'BROWSER' | 'NODEJS' | 'NATIVESCRIPT' | 'CORDOVA'
    verbose?: boolean
    autosave?: boolean
    autosaveInterval?: number
    autoload?: boolean
    autoloadCallback?: (err: any) => void
    adapter?: any
    serializationMethod?: 'normal' | 'pretty' | 'destructured'
    destructureDelimiter?: string
    throttledSaves?: boolean
  }

  class Loki {
    constructor(filename: string, options?: LokiConstructorOptions)
    addCollection<T extends object = any>(name: string, options?: CollectionOptions<T>): Collection<T>
    getCollection<T extends object = any>(name: string): Collection<T> | null
    removeCollection(name: string): void
    listCollections(): { name: string; count: number }[]
    saveDatabase(callback?: (err: any) => void): void
    loadDatabase(properties?: object, callback?: (err: any) => void): void
    deleteDatabase(callback?: (err: any) => void): void
    close(callback?: (err: any) => void): void
    serialize(): string
    toJson(): string
    filename: string
    collections: Collection[]
  }

  export = Loki
}
