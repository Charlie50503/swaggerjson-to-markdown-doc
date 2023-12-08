/// <reference path = "./markdown/index.ts" />

import { SwaggerJSON } from "../swagger-json/swagger-json.interface";
import { Markdown } from './markdown/index';

export class HeaderGenerator {
  public static generateHeader(data: SwaggerJSON, url: string) {
    const header = new Markdown.Header(
      data.info.title,
      this.getRootPath(url),
      data.info.version,
      url
    );
    return header
  }

  private static getRootPath(url: string) {
    return url.split('/').slice(0, 3).join('/');
  }
}