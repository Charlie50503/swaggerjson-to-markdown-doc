import { SwaggerJSON } from '../swagger-json/swagger-json.interface';
import { MarkdownConverter } from './markdownConverter';
import { SwaggerFileLoader } from './swaggerFileLoader';

export class SwaggerToMarkdown {
  constructor() {}

  async run() {
    const swaggerUrl = 'http://localhost:24066/swagger/v1/swagger.json';
    const swaggerFileLoader = new SwaggerFileLoader();
    const response = await swaggerFileLoader.handlingFetch(swaggerUrl);
    const markdownConverter = new MarkdownConverter();
    const result = await response.json()
    const swaggerMarkdown = markdownConverter.convert(
      result as SwaggerJSON,
      swaggerUrl
    );
    console.log(swaggerMarkdown);
  }
}
