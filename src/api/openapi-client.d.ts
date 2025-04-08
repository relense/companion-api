declare namespace CompanionApi {
  namespace CreateMessage {
    export type QueryParameters = {};
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
      pathParams?: any;
      responses: Responses.$201 | Responses.$400 | Responses.$500;
      successResponses: Responses.$201;
      requestBody: RequestBody;
      queryParams: QueryParameters;
      headers?: any;
    }
  }
  namespace GetMessages {
    export interface QueryParameters {
      PageSize?: number;
      Page?: number;
    }
    export type RequestBody = {};
    namespace Responses {
      export interface $200 {
        Items: array;
        Meta: object;
        Links: object;
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
      pathParams?: any;
      responses: Responses.$200 | Responses.$400 | Responses.$500;
      successResponses: Responses.$200;
      requestBody: RequestBody;
      queryParams: QueryParameters;
      headers?: any;
    }
  }
  namespace CreateAccount {
    export type QueryParameters = {};
    export interface RequestBody {
      accountName?: string;
    }
    namespace Responses {
      export interface $201 {
        accountId: string;
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
      operationId: "createAccount";
      method: "post";
      expressPath: "/accounts";
      openapiPath: "/accounts";
      pathParams?: any;
      responses: Responses.$201 | Responses.$400 | Responses.$500;
      successResponses: Responses.$201;
      requestBody: RequestBody;
      queryParams: QueryParameters;
      headers?: any;
    }
  }
  namespace GetAccounts {
    export interface QueryParameters {
      PageSize?: number;
      Page?: number;
    }
    export type RequestBody = {};
    namespace Responses {
      export interface $200 {
        Items: array;
        Meta: object;
      }
      export interface $400 {
        message: string;
      }
      export interface $500 {
        message: string;
      }
    }
    export interface Config {
      operationId: "getAccounts";
      method: "get";
      expressPath: "/accounts";
      openapiPath: "/accounts";
      pathParams?: any;
      responses: Responses.$200 | Responses.$400 | Responses.$500;
      successResponses: Responses.$200;
      requestBody: RequestBody;
      queryParams: QueryParameters;
      headers?: any;
    }
  }
}