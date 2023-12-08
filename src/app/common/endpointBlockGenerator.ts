/// <reference path = "./markdown/index.ts" />

import {
  HttpMethod,
  SwaggerJSON,
  SwaggerJSONPathContent,
} from '../swagger-json/swagger-json.interface';
import { Markdown } from './markdown/index';

export class EndpointBlockGenerator {
  public static generateEndpointBlock(data: SwaggerJSON) {
    const endpointAPIListMap = new Map<string, Markdown.EndpointAPI[]>();
    for (const [path, methodObj] of Object.entries(data.paths)) {
      for (const [method, content] of Object.entries(methodObj)) {
        if (!endpointAPIListMap.has(content.tags[0])) {
          endpointAPIListMap.set(content.tags[0], [
            this.generateEndpointAPI(path, method as HttpMethod, content),
          ]);
        } else {
          endpointAPIListMap
            .get(content.tags[0])!
            .push(
              this.generateEndpointAPI(path, method as HttpMethod, content)
            );
        }
      }
    }
    const endpoints: Markdown.Endpoint[] = [];
    endpointAPIListMap.forEach((endpointAPIList, endpointName) => {
      endpoints.push(new Markdown.Endpoint(endpointName, endpointAPIList));
    });
    return new Markdown.EndpointBlock(endpoints);
  }

  public static generatorEndpoint(
    name: string,
    endpointAPIList: Markdown.EndpointAPI[]
  ) {
    return new Markdown.Endpoint(name, endpointAPIList);
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
