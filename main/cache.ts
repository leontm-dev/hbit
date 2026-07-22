// cache.ts
type CacheStore = Map<string, any>;

class DatabaseCache {
  private cache: CacheStore = new Map();

  // Daten holen oder aus der DB laden & zwischenspeichern
  async getOrSet<T>(key: string, fetchFn: () => Promise<T>): Promise<T> {
    if (this.cache.has(key)) {
      // Return cached result
      return this.cache.get(key) as T;
    }

    // Wenn nicht im Cache: DB-Abfrage ausführen
    const result = await fetchFn();
    this.cache.set(key, result);
    return result;
  }

  // Bestimmte Keys gezielt löschen
  invalidate(key: string): void {
    this.cache.delete(key);
  }

  // Bestimmte Muster/Präfixe löschen (z. B. alle Matches)
  invalidatePattern(prefix: string): void {
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
      }
    }
  }

  // Den gesamten Cache leeren
  clear(): void {
    this.cache.clear();
  }
}

export const dbCache = new DatabaseCache();
