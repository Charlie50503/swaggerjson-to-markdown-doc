export type ApiURL = string;
export type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

export interface SwaggerJSONBody {
  description: string;
  content?: {
    [key: string]: {
      schema: {
        type?: string;
        $ref?: string;
        items?: {
          $ref?: string;
        };
      };
    };
  };
}

export interface SwaggerJSONPathContent {
  tags: string[];
  summary: string;
  operationId: string;
  parameters?: {
    name: string;
    in: string;
    description: string;
    required: boolean;
    type?: string;
    format?: string;
    schema?: {
      type?: string;
      $ref?: string;
    };
  }[];
  requestBody?: SwaggerJSONBody;
  responses?: {
    [key: string]: SwaggerJSONBody;
  };
}

export interface SwaggerJSONInterfaceBodyProperties {
  [key: string]: {
    maxLength?: number;
    minLength?: number;
    nullable?: boolean;
    format?: string;
    type: string;
    $ref?: string;
    items?: {
      $ref?: string;
    }
  };
}

export interface SwaggerJSONInterfaceBody {
  type: string;
  required?: string[];
  additionalProperties: boolean;
  properties?: SwaggerJSONInterfaceBodyProperties;
  description?: string;
  enum?: string[];
}

export interface SwaggerJSON {
  openapi: string;
  info: {
    title: string;
    version: string;
  };
  paths: {
    [key: ApiURL]: {
      [key in HttpMethod]: SwaggerJSONPathContent;
    };
  };
  components?: {
    schemas: {
      [key: string]: SwaggerJSONInterfaceBody;
    };
  };
}
