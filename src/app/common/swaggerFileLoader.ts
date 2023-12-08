// import axios from 'axios';

export class SwaggerFileLoader {
  constructor() {}

  private async fetchAPI(url: string) {
    return fetch(url, {
      method: 'GET',
    });
  }

  public async handlingFetch(url: string): Promise<Response> {
    const result = await this.fetchAPI(url);
    if (result.status !== 200) {
      console.error(result);
      throw Error('fail to fetch swagger file');
    }
    return result;
  }
}
