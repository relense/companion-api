declare namespace CompanionApi {
  namespace CreateMessage {
    export type QueryParameters = {};
    export type PathParameters = {};
    export interface RequestBody {
      message: string;
    }
    namespace Responses {
      export interface $201 {
        messageId: string;
        description: string;
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
  namespace GetMessages {
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
      operationId: "getMessages";
      method: "get";
      expressPath: "/messages";
      openapiPath: "/messages";
      pathParams: PathParameters;
      queryParams: QueryParameters;
      requestBody: RequestBody;
      headers?: any;
      responses: Responses.$200 | Responses.$400 | Responses.$500;
      successResponses: Responses.$200;
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
        description: string;
        createdAt: string;
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
      messageContent: string;
    }
    namespace Responses {
      export interface $200 {
        messageId: string;
        description: string;
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
        description: string;
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
  namespace GetMessagesByUser {
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
      operationId: "getMessagesByUser";
      method: "get";
      expressPath: "/users/messages";
      openapiPath: "/users/messages";
      pathParams: PathParameters;
      queryParams: QueryParameters;
      requestBody: RequestBody;
      headers?: any;
      responses: Responses.$200 | Responses.$400 | Responses.$500;
      successResponses: Responses.$200;
    }
  }
}