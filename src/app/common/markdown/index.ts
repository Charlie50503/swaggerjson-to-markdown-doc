import { MarkdownTitleLevel } from './enum/markdownTitleLevel.enum';
import { genMarkdownBulletList } from './services/genMarkdownBulletList.service';
import { genMarkdownCodeBlock } from './services/genMarkdownCodeBlock';
import { genMarkdownDivider } from './services/genMarkdownDivider';
import { genMarkdownTitle } from './services/genMarkdownTitle.service';
import { HttpMethod } from '../../swagger-json/swagger-json.interface';
import { getMarkdownTable } from 'markdown-table-ts';
import { genMarkdownUrl } from './services/genMarkdownUrl.service';

export namespace Markdown {
  export class Details {
    details: Detail[];

    constructor(details: Detail[]) {
      this.details = details;
    }

    async build() {
      const responseStrings = await Promise.all(
        this.details.map(async (detail) => await detail.build())
      );
      return (
        /*markdown*/ `${genMarkdownTitle(MarkdownTitleLevel.h2, 'Details')}` +
        responseStrings.join('\n')
      );
    }
  }
  export class Detail {
    detailGroupName: string;
    detailAPIList: DetailAPI[];

    constructor(detailGroupName: string, detailAPIList: DetailAPI[]) {
      this.detailGroupName = detailGroupName;
      this.detailAPIList = detailAPIList;
    }

    async build() {
      const responseStrings = await Promise.all(
        this.detailAPIList.map(async (detailAPI) => await detailAPI.build())
      );
      return (
        /*markdown*/ `
        ${genMarkdownTitle(MarkdownTitleLevel.h3, this.detailGroupName)}
      ` + responseStrings.join('\n')
      );
    }
  }
  export class DetailAPI {
    apiName: string;
    requestExample?: RequestExample;
    responseExamples?: ResponseExample[];

    constructor(
      apiName: string,
      requestExample?: RequestExample,
      responseExample?: ResponseExample[]
    ) {
      this.apiName = apiName;
      this.requestExample = requestExample;
      this.responseExamples = responseExample;
    }

    async build() {
      let responseStrings: string[] = [];
      if (this.responseExamples) {
        responseStrings = await Promise.all(
          this.responseExamples.map(
            async (responseExample) => await responseExample.build()
          )
        );
      }

      return (
        /*markdown*/ `
        ${genMarkdownTitle(MarkdownTitleLevel.h4, this.apiName)}

        ${this.requestExample ? await this.requestExample.build() : ''}
      ` + responseStrings.join('\n')
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

    async build() {
      return `
        ${genMarkdownBulletList([`Response Example`])}

        Description: ${this.description}
        ${await genMarkdownCodeBlock('json', this.responseBody)}
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

    async build() {
      return `
        ${genMarkdownBulletList([`Request Example`])}

        Description: ${this.description}
        ${await genMarkdownCodeBlock('json', this.requestBody)}
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
          genMarkdownUrl(endpointAPI.name, '#' + endpointAPI.name),
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
      ${genMarkdownTitle(MarkdownTitleLevel.h3, this.name)}

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
