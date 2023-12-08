/// <reference path = "./markdown/index.ts" />

import {
  SwaggerJSON,
  SwaggerJSONBody,
  SwaggerJSONPathContent,
} from '../swagger-json/swagger-json.interface';
import { Type } from './enum/type.enum';
import { Markdown } from './markdown/index';

export class DetailsGenerator {
  public interfaceMap = new Map<string, object | string>();
  constructor(interfaceMap: Map<string, object | string>) {
    this.interfaceMap = interfaceMap;
  }

  public generateDetails(data: SwaggerJSON): Markdown.Details {
    const detailAPIListMap = new Map<string, Markdown.DetailAPI[]>();
    Object.entries(data.paths).forEach(([pathName, path]) => {
      Object.entries(path).forEach(([method, content]) => {
        if (!detailAPIListMap.has(content.tags[0])) {
          detailAPIListMap.set(content.tags[0], [
            this.generateDetailAPI(content)
          ]);
        } else {
          detailAPIListMap
            .get(content.tags[0])!
            .push(
              this.generateDetailAPI(content)
            );
        }
      });
    });

    const details: Markdown.Detail[] = [];
    detailAPIListMap.forEach((detailAPIList, detailGroupName) => {
      details.push(new Markdown.Detail(detailGroupName, detailAPIList));
    });

    return new Markdown.Details(details);
  }

  private generateDetailAPI(content: SwaggerJSONPathContent) {
    if (!content.summary) {
      throw Error('該 API Summary is empty');
    }
    const responses: Markdown.ResponseExample[] = [];
    if (content.responses) {
      Object.entries(content.responses).forEach(([key, value]) => {
        responses.push(this.generateResponseExample(value));
      });
    }

    return new Markdown.DetailAPI(
      content.summary,
      content.requestBody
        ? this.generateRequestExample(content.requestBody)
        : undefined,
      responses.length > 0 ? responses : undefined
    );
  }
  // * 如果 content 沒有內容就不要進來
  private generateRequestExample(body: SwaggerJSONBody) {
    if (!body.content || Object.keys(body.content).length === 0) {
      throw Error('該 API Request content is empty');
    }

    for (const [key, content] of Object.entries(body.content!)) {
      if (content.schema && content.schema.$ref) {
        if (content.schema.type === Type.array) {
          const json = JSON.stringify([
            this.interfaceMap.get(this.getObjName(content.schema.items!.$ref!)),
          ]);
          return new Markdown.RequestExample(json, body.description);
        } else {
          const json = JSON.stringify(
            this.interfaceMap.get(this.getObjName(content.schema.$ref))
          );
          return new Markdown.RequestExample(json, body.description);
        }
      } else {
        return new Markdown.RequestExample('', body.description);
      }
    }

    let defaultRequest = new Markdown.RequestExample('', '無描述');
    return defaultRequest;
  }

  private generateResponseExample(body: SwaggerJSONBody) {
    if (!body.content || Object.keys(body.content).length === 0) {
      throw Error('該 API Response content is empty');
    }

    for (const [key, content] of Object.entries(body.content!)) {
      if (content.schema && content.schema.$ref) {
        if (content.schema.type === Type.array) {
          const json = JSON.stringify([
            this.interfaceMap.get(this.getObjName(content.schema.items!.$ref!)),
          ]);
          return new Markdown.ResponseExample(json, body.description);
        } else {
          const json = JSON.stringify(
            this.interfaceMap.get(this.getObjName(content.schema.$ref))
          );
          return new Markdown.ResponseExample(json, body.description);
        }
      } else {
        return new Markdown.ResponseExample('', body.description);
      }
    }

    let defaultResponse = new Markdown.ResponseExample('', '無描述');
    return defaultResponse;
  }

  private getValueFromPath(obj: any, path: string): any {
    const pathParts = path.replace('#/', '').split('/');
    let result = obj;
    for (const part of pathParts) {
      if (result[part] === undefined) {
        return undefined;
      }
      result = result[part];
    }
    return result;
  }

  // const path = "#/components/schemas/SystemMQuery";
  private getObjName(path: string) {
    const parts = path.split('/');
    return parts[parts.length - 1];
  }
}
