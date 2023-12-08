/// <reference path = "./markdown/index.ts" />

import {
  HttpMethod,
  SwaggerJSON,
  SwaggerJSONPathContent,
} from '../swagger-json/swagger-json.interface';
import { Markdown } from './markdown/index';

export class EndpointBlockGenerator {
  public static generateEndpointBlock(data: SwaggerJSON) {
    data.paths[0];
    const endpointAPIMapList = new Map<string, Markdown.EndpointAPI[]>();
    for (const [path, methodObj] of Object.entries(data.paths)) {
      for (const [method, content] of Object.entries(methodObj)) {
        if (!endpointAPIMapList.has(content.tags[0])) {
          endpointAPIMapList.set(path, [
            this.generateEndpointAPI(path, method as HttpMethod, content),
          ]);
        } else {
          endpointAPIMapList
            .get(content.tags[0])!
            .push(
              this.generateEndpointAPI(path, method as HttpMethod, content)
            );
        }
      }
    }
    const endpoints: Markdown.Endpoint[] = [];
    for (const [endpointName, endpointObj] of Object.entries(
      endpointAPIMapList
    )) {
      endpoints.push(new Markdown.Endpoint(endpointName, endpointObj));
    }
    return new Markdown.EndpointBlock(endpoints);
  }

  private static generateEndpointAPI(
    path: string,
    method: HttpMethod,
    content: SwaggerJSONPathContent
  ) {
    const parmas: Markdown.EndpointAPI = {
      name: content.summary,
      method: method,
      path: path,
      parameters: this.getParameters(content.parameters),
      role: 'member',
      tokenRequired: 'Y',
    };
    return new Markdown.EndpointAPI(
      parmas.name,
      parmas.method,
      parmas.path,
      parmas.parameters,
      parmas.role,
      parmas.tokenRequired
    );
  }

  private static getParameters(
    parameters: SwaggerJSONPathContent['parameters']
  ): string[] {
    if (
      !parameters ||
      parameters.length === 0 ||
      !parameters.find(
        (parameter) => parameter.in === 'path' || parameter.in === 'query'
      )
    ) {
      return ['-'];
    }

    return parameters.map((parameter) => {
      return parameter.name;
    });
  }
}
