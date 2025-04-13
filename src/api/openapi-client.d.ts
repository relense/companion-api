declare namespace ClientApi {
  namespace CreateMessage {
    export type QueryParameters = {};
    export type PathParameters = {};
    export interface RequestBody {
      companionId: string;
      content: string;
    }
    namespace Responses {
      export interface $201 {
        messageId: string;
        content: string;
      }
      export interface $400 {
        message: string;
      }
      export interface $500 {
        message: string;
      }
    }
    export interface Config {
      operationId: "createMessage";
      method: "post";
      expressPath: "/messages";
      openapiPath: "/messages";
      pathParams: PathParameters;
      queryParams: QueryParameters;
      requestBody: RequestBody;
      headers?: any;
      responses: Responses.$201 | Responses.$400 | Responses.$500;
      successResponses: Responses.$201;
    }
  }
  namespace GetMessage {
    export type QueryParameters = {};
    export interface PathParameters {
      messageId: string;
    }
    export type RequestBody = {};
    namespace Responses {
      export interface $200 {
        messageId: string;
        content: string;
        createdAt: string;
        updatedAt: string;
      }
      export interface $400 {
        message?: string;
      }
      export interface $500 {
        message?: string;
      }
    }
    export interface Config {
      operationId: "getMessage";
      method: "get";
      expressPath: "/messages/:messageId";
      openapiPath: "/messages/{messageId}";
      pathParams: PathParameters;
      queryParams: QueryParameters;
      requestBody: RequestBody;
      headers?: any;
      responses: Responses.$200 | Responses.$400 | Responses.$500;
      successResponses: Responses.$200;
    }
  }
  namespace UpdateMessage {
    export type QueryParameters = {};
    export interface PathParameters {
      messageId: string;
    }
    export interface RequestBody {
      content: string;
    }
    namespace Responses {
      export interface $200 {
        messageId: string;
        content: string;
        updatedAt: string;
      }
      export interface $400 {
        message?: string;
      }
      export interface $500 {
        message?: string;
      }
    }
    export interface Config {
      operationId: "updateMessage";
      method: "put";
      expressPath: "/messages/:messageId";
      openapiPath: "/messages/{messageId}";
      pathParams: PathParameters;
      queryParams: QueryParameters;
      requestBody: RequestBody;
      headers?: any;
      responses: Responses.$200 | Responses.$400 | Responses.$500;
      successResponses: Responses.$200;
    }
  }
  namespace DeleteMessage {
    export type QueryParameters = {};
    export interface PathParameters {
      messageId: string;
    }
    export type RequestBody = {};
    namespace Responses {
      export interface $200 {
        messageId: string;
        content: string;
        createdAt: string;
        updatedAt: string;
      }
      export interface $400 {
        message?: string;
      }
      export interface $500 {
        message?: string;
      }
    }
    export interface Config {
      operationId: "deleteMessage";
      method: "delete";
      expressPath: "/messages/:messageId";
      openapiPath: "/messages/{messageId}";
      pathParams: PathParameters;
      queryParams: QueryParameters;
      requestBody: RequestBody;
      headers?: any;
      responses: Responses.$200 | Responses.$400 | Responses.$500;
      successResponses: Responses.$200;
    }
  }
  namespace CreateCompanion {
    export type QueryParameters = {};
    export type PathParameters = {};
    export interface RequestBody {
      name?: string;
    }
    namespace Responses {
      export interface $201 {
        companionId: string;
        name: string;
      }
      export interface $400 {
        message: string;
      }
      export interface $500 {
        message: string;
      }
    }
    export interface Config {
      operationId: "createCompanion";
      method: "post";
      expressPath: "/companions";
      openapiPath: "/companions";
      pathParams: PathParameters;
      queryParams: QueryParameters;
      requestBody: RequestBody;
      headers?: any;
      responses: Responses.$201 | Responses.$400 | Responses.$500;
      successResponses: Responses.$201;
    }
  }
  namespace GetCompanions {
    export interface QueryParameters {
      pageSize?: number;
      page?: number;
    }
    export type PathParameters = {};
    export type RequestBody = {};
    namespace Responses {
      export interface $200 {
        items: array;
        meta: object;
        links: object;
      }
      export interface $400 {
        message: string;
      }
      export interface $500 {
        message: string;
      }
    }
    export interface Config {
      operationId: "getCompanions";
      method: "get";
      expressPath: "/companions";
      openapiPath: "/companions";
      pathParams: PathParameters;
      queryParams: QueryParameters;
      requestBody: RequestBody;
      headers?: any;
      responses: Responses.$200 | Responses.$400 | Responses.$500;
      successResponses: Responses.$200;
    }
  }
  namespace GetCompanion {
    export type QueryParameters = {};
    export interface PathParameters {
      companionId: string;
    }
    export type RequestBody = {};
    namespace Responses {
      export interface $200 {
        companionId: string;
        name: string;
      }
      export interface $400 {
        message: string;
      }
      export interface $500 {
        message: string;
      }
    }
    export interface Config {
      operationId: "getCompanion";
      method: "get";
      expressPath: "/companions/:companionId";
      openapiPath: "/companions/{companionId}";
      pathParams: PathParameters;
      queryParams: QueryParameters;
      requestBody: RequestBody;
      headers?: any;
      responses: Responses.$200 | Responses.$400 | Responses.$500;
      successResponses: Responses.$200;
    }
  }
  namespace GetMessagesByCompanion {
    export interface QueryParameters {
      pageSize?: number;
      page?: number;
    }
    export interface PathParameters {
      companionId: string;
    }
    export type RequestBody = {};
    namespace Responses {
      export interface $200 {
        items: array;
        meta: object;
        links: object;
      }
      export interface $400 {
        message: string;
      }
      export interface $500 {
        message: string;
      }
    }
    export interface Config {
      operationId: "getMessagesByCompanion";
      method: "get";
      expressPath: "/companions/:companionId/messages";
      openapiPath: "/companions/{companionId}/messages";
      pathParams: PathParameters;
      queryParams: QueryParameters;
      requestBody: RequestBody;
      headers?: any;
      responses: Responses.$200 | Responses.$400 | Responses.$500;
      successResponses: Responses.$200;
    }
  }
  namespace SendOpenaiMessages {
    export type QueryParameters = {};
    export type PathParameters = {};
    export type RequestBody = {};
    namespace Responses {
      export interface $200 {
        id: string;
        choices: array;
      }
      export interface $500 {
        message: string;
      }
    }
    export interface Config {
      operationId: "sendOpenaiMessages";
      method: "post";
      expressPath: "/gpt";
      openapiPath: "/gpt";
      pathParams: PathParameters;
      queryParams: QueryParameters;
      requestBody: RequestBody;
      headers?: any;
      responses: Responses.$200 | Responses.$500;
      successResponses: Responses.$200;
    }
  }
}