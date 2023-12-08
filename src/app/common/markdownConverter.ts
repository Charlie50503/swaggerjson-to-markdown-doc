/// <reference path = "./markdown/index.ts" />

import {
  SwaggerJSON as SwaggerJSON,
  SwaggerJSONInterfaceBodyProperties,
} from '../swagger-json/swagger-json.interface';
import { DetailsGenerator } from './detailsGenerator';
import { EndpointBlockGenerator } from './endpointBlockGenerator';
import { Type } from './enum/type.enum';
import { HeaderGenerator } from './headerGenerator';
import { Markdown } from './markdown/index';

export class MarkdownConverter {
  interfaceMap = new Map<string, object | string>();
  constructor() {}
  public convert(data: SwaggerJSON, url: string) {
    this.getInterfaceMap(data);
    const header = HeaderGenerator.generateHeader(data, url);
    const endpoints = EndpointBlockGenerator.generateEndpointBlock(data);
    const details = new DetailsGenerator(this.interfaceMap).generateDetails(
      data
    );
    return this.formatMarkdown(
      `
      ${header.build()}
      ${endpoints.build()}
      ${details.build()}
    `
    );
  }
  private formatMarkdown(content: string) {
    // 去除 行前後空白
    return content
      .split('\n')
      .map((line) => line.trim())
      .join('\n');
  }

  private getInterfaceMap(data: SwaggerJSON) {
    if (!data.components || !data.components.schemas) {
      throw Error('components 或是 schemas 沒找到');
    }
    Object.entries(data.components.schemas).forEach(
      ([interfaceName, interfaceBody]) => {
        console.log(interfaceName);

        if (interfaceBody.properties) {
          this.interfaceMap.set(
            interfaceName,
            this.genInterfaceBodyNotRefOrArray(interfaceBody.properties)
          );
        } else if (interfaceBody.enum) {
          this.interfaceMap.set(
            interfaceName,
            this.genEnum(interfaceBody.enum)
          );
        } else {
          this.interfaceMap.set(interfaceName, {});
        }
      }
    );
    Object.entries(data.components.schemas).forEach(
      ([interfaceName, interfaceBody]) => {
        console.log(interfaceName);

        if (interfaceBody.properties) {
          this.interfaceMap.set(
            interfaceName,
            this.genInterfaceBodyRef(interfaceBody.properties)
          );
          this.interfaceMap.set(
            interfaceName,
            this.genInterfaceBodyArray(interfaceBody.properties)
          );
        } else if (interfaceBody.enum) {
        } else {
        }
      }
    );
  }

  private genEnum(dataEnum: string[]) {
    let result: string = '';
    dataEnum.forEach((element) => {
      // "1 | 2 | 3"
      result += `${element} | `;
    });
    result = result.substring(0, result.length - 3);

    return result;
  }

  private genInterfaceBodyRef(properties: SwaggerJSONInterfaceBodyProperties) {
    let obj: Record<string, any> = {};
    Object.entries(properties).forEach(([propertyName, propertyContent]) => {
      if (propertyContent.$ref) {
        const interfaceObj = this.interfaceMap.get(
          this.getObjName(propertyContent.$ref)
        );
        if (interfaceObj) {
          obj[`${propertyName}`] = interfaceObj;
        } else {
          console.log(this.interfaceMap);
          console.log(propertyName);
          throw Error('沒有找到可參照物件 genInterfaceBodyRef');
        }
      }
    });
    return obj;
  }

  private genInterfaceBodyArray(
    properties: SwaggerJSONInterfaceBodyProperties
  ) {
    let obj: Record<string, any> = {};
    Object.entries(properties).forEach(([propertyName, propertyContent]) => {
      if (propertyContent.type === Type.array && propertyContent.items) {
        const interfaceObj = this.interfaceMap.get(
          this.getObjName(propertyContent.items.$ref!)
        );
        if (interfaceObj) {
          obj[`${propertyName}`] = interfaceObj;
        } else {
          console.log(this.interfaceMap);
          console.log(propertyName);
          console.log(propertyContent.items.$ref!);
          throw Error('沒有找到可參照物件 genInterfaceBodyArray');
        }
      }
    });
    return [obj];
  }

  private genInterfaceBodyNotRefOrArray(
    properties: SwaggerJSONInterfaceBodyProperties
  ) {
    let obj: Record<string, any> = {};
    Object.entries(properties).forEach(([propertyName, propertyContent]) => {
      if (propertyContent.type) {
        obj[`${propertyName}`] = this.genValue(
          propertyContent.type,
          propertyContent.format
        );
      }
    });
    return obj;
  }

  private genValue(type: string, format?: string) {
    if (type === Type.string && format === 'date-time') {
      return new Date().toISOString();
    }
    if (type === Type.string) {
      return '';
    }
    if (type === Type.integer) {
      return 0;
    }
    if (type === Type.boolean) {
      return false;
    }
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
