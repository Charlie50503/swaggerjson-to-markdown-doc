// import { markdownTable } from 'markdown-table';
import { MarkdownTitleLevel } from './enum/markdownTitleLevel.enum';
import { genMarkdownBulletList } from './services/genMarkdownBulletList.service';
import { genMarkdownCodeBlock } from './services/genMarkdownCodeBlock';
import { genMarkdownDivider } from './services/genMarkdownDivider';
import { genMarkdownTitle } from './services/genMarkdownTitle.service';
import { HttpMethod } from '../../swagger-json/swagger-json.interface';
import { getMarkdownTable } from 'markdown-table-ts';

export namespace Markdown {
  export class Details {
    details: Detail[];

    constructor(details: Detail[]) {
      this.details = details;
    }

    build() {
      return (
        /*markdown*/ `${genMarkdownTitle(MarkdownTitleLevel.h2, 'Details')}` +
        this.details.map((detail) => detail.build()).join('\n')
      );
    }
  }
  export class Detail {
    name: string;
    detailAPI: DetailAPI;

    constructor(name: string, detailAPI: DetailAPI) {
      this.name = name;
      this.detailAPI = detailAPI;
    }

    build() {
      return /*markdown*/ `
        ${genMarkdownTitle(MarkdownTitleLevel.h3, this.name)}

        ${this.detailAPI.build()}
      `;
    }
  }
  export class DetailAPI {
    name: string;
    requestExample?: RequestExample;
    responseExamples?: ResponseExample[];

    constructor(
      name: string,
      requestExample?: RequestExample,
      responseExample?: ResponseExample[]
    ) {
      this.name = name;
      this.requestExample = requestExample;
      this.responseExamples = responseExample;
    }

    build() {
      return (
        /*markdown*/ `
        ${genMarkdownTitle(MarkdownTitleLevel.h4, this.name)}

        ${this.requestExample ? this.requestExample.build() : ''}
      ` +
        (this.responseExamples
          ? this.responseExamples
              .map((responseExample) => responseExample.build())
              .join('\n')
          : '')
      );
    }
  }
  export class ResponseExample {
    description: string = '';
    responseBody: string;

    constructor(responseBody: string, description?: string) {
      this.responseBody = responseBody;
      if (description) {
        this.description = description;
      }
    }

    build() {
      return `
        ${genMarkdownBulletList([`Response Example`])}
        ${this.description}
        ${genMarkdownCodeBlock('json', this.responseBody)}
      `;
    }
  }
  export class RequestExample {
    description: string = '';
    requestBody: string;
    constructor(requestBody: string, description?: string) {
      this.requestBody = requestBody;
      if (description) {
        this.description = description;
      }
    }

    build() {
      return `
        ${genMarkdownBulletList([`Request Example`])}
        ${this.description}
        ${genMarkdownCodeBlock('json', this.requestBody)}
      `;
    }
  }
  export class EndpointBlock {
    endpoints: Endpoint[];
    constructor(endpoints: Endpoint[]) {
      this.endpoints = endpoints;
    }

    build() {
      return (
        /*markdown*/ `${genMarkdownTitle(MarkdownTitleLevel.h2, 'Endpoints')}` +
        this.endpoints.map((endpoint) => endpoint.build()).join('\n')
      );
    }
  }
  export class Endpoint {
    name: string;
    endpointAPIList: EndpointAPI[];
    tableHeader = [
      'API Name',
      'Method',
      'Path',
      'Parameter',
      'Role',
      'Token Required',
    ];
    constructor(name: string, endpointAPIList: EndpointAPI[]) {
      this.name = name;
      this.endpointAPIList = endpointAPIList;
    }

    genTableContent() {
      return this.endpointAPIList.map((endpointAPI) => {
        return [
          endpointAPI.name,
          endpointAPI.method,
          endpointAPI.path,
          endpointAPI.parameters.join('\n'),
          endpointAPI.role,
          endpointAPI.tokenRequired,
        ];
      });
    }

    build() {
      return /*markdown*/ `
      ${getMarkdownTable({
        table: {
          head: this.tableHeader,
          body: this.genTableContent(),
        },
      })}`;
    }
  }
  export class EndpointAPI {
    name: string;
    method: HttpMethod;
    path: string;
    parameters: string[] | ['-'];
    role: 'member' | 'admin' | '-';
    tokenRequired: 'Y' | 'N';

    constructor(
      name: string,
      method: HttpMethod,
      path: string,
      parameters: string[] | ['-'],
      role: 'member' | 'admin' | '-',
      tokenRequired: 'Y' | 'N'
    ) {
      this.name = name;
      this.method = method;
      this.path = path;
      this.parameters = parameters;
      this.role = role;
      this.tokenRequired = tokenRequired;
    }
  }

  export class Header {
    private title: string;
    private rootPath: string;
    private version: string;
    private swaggerUrl: string;

    constructor(
      title: string,
      rootPath: string,
      version: string,
      swaggerUrl: string
    ) {
      this.title = title;
      this.rootPath = rootPath;
      this.version = version;
      this.swaggerUrl = swaggerUrl;
    }

    build() {
      return /*markdown*/ `
        ${genMarkdownTitle(MarkdownTitleLevel.h1, this.title)}
        ${genMarkdownDivider()}
        ${genMarkdownBulletList([
          `版本: ${this.version}`,
          `root path: ${this.rootPath}`,
          `swagger url: ${this.swaggerUrl}`,
        ])}
      `;
    }
  }
}
