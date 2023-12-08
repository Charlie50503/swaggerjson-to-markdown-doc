import { SwaggerJSON } from '../swagger-json/swagger-json.interface';
import { MarkdownConverter } from './markdownConverter';
import { writeFile } from './services/writeFile.service';
import { SwaggerFileLoader } from './swaggerFileLoader';

export class SwaggerToMarkdown {
  constructor() {}

  async run() {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    const swaggerUrl = '';
    const swaggerFileLoader = new SwaggerFileLoader();
    const response = await swaggerFileLoader.handlingFetch(swaggerUrl);
    const markdownConverter = new MarkdownConverter();
    const result = await response.json()
    const swaggerMarkdown = await markdownConverter.convert(
      result as SwaggerJSON,
      swaggerUrl
    );
    writeFile("swagger.md",swaggerMarkdown);
  }
}
