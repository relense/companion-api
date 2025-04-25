declare namespace OpenaiApi {
  namespace SendOpenaiMessages {
    export type QueryParameters = {};
    export type PathParameters = {};
    export interface RequestBody {
      messages: array;
    }
    namespace Responses {
      export interface $200 {
        id: string;
        choices: array;
      }
      export interface $400 {
        message: string;
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
      responses: Responses.$200 | Responses.$400 | Responses.$500;
      successResponses: Responses.$200;
    }
  }
  namespace GetInitialMessage {
    export type QueryParameters = {};
    export type PathParameters = {};
    export type RequestBody = {};
    namespace Responses {
      export interface $200 {
        id: string;
        choices: array;
      }
      export interface $400 {
        message: string;
      }
      export interface $500 {
        message: string;
      }
    }
    export interface Config {
      operationId: "getInitialMessage";
      method: "get";
      expressPath: "/gpt";
      openapiPath: "/gpt";
      pathParams: PathParameters;
      queryParams: QueryParameters;
      requestBody: RequestBody;
      headers?: any;
      responses: Responses.$200 | Responses.$400 | Responses.$500;
      successResponses: Responses.$200;
    }
  }
}