export class PlausibleService {

  #instance;
  #apiKey;

  /**
   * @param {string} instance 
   * @param {string} apiKey 
   */
  constructor(instance, apiKey) {
    this.#instance = instance;
    this.#apiKey = apiKey;
  }

  /**
   * @param {import('.').Query} query 
   * @returns {Promise<import('.').QueryResult[]>}
   * @throws {Error}
   *   If invalid credentials were passed or the site ID doesn't exit.
   */
  async query(query) {
    const resp = await fetch(
      `${this.#instance}/api/v2/query`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.#apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(query),
      }
    );

    if (!resp.ok) {
      if (resp.headers.get('content-type')?.includes('application/json')) {
        const response = /** @type {import('.').PlausibleError} */ (await resp.json());
        throw new Error(response.error);
      }

      throw new Error('Unable to connect to host. Please ensure that it was specified correctly and try again.');
    }

    const response = await resp.json();

    const results = /** @type {import('.').QueryResponse} */ (response).results;
    const deviceIndex = query.dimensions?.indexOf('visit:device');

    if (deviceIndex !== undefined) {
      for (const result of results) {
        if (result.dimensions[deviceIndex] === 'Laptop') {
          result.dimensions[deviceIndex] = 'Desktop';
        }
      }
    }

    return results;
  }
}
