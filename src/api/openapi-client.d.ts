declare namespace ClientApi {
  namespace CompleteAuthentication {
    export type QueryParameters = {};
    export type PathParameters = {};
    export interface RequestBody {
      messages: { role: string; content: string; }[];
    }
    namespace Responses {
      export interface $200 {
      }
      export interface $400 {
        message: string;
      }
      export interface $500 {
        message: string;
      }
    }
    export interface Config {
      operationId: "completeAuthentication";
      method: "post";
      expressPath: "/auth/complete";
      openapiPath: "/auth/complete";
      pathParams: PathParameters;
      queryParams: QueryParameters;
      requestBody: RequestBody;
      headers?: any;
      responses: Responses.$200 | Responses.$400 | Responses.$500;
      successResponses: Responses.$200;
    }
  }
  namespace CreateMessage {
    export type QueryParameters = {};
    export type PathParameters = {};
    export interface RequestBody {
      companionId: string;
      role?: string;
      content: string;
    }
    namespace Responses {
      export interface $201 {
        messageId: string;
        role?: string;
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
  namespace CreateBulkMessage {
    export type QueryParameters = {};
    export type PathParameters = {};
    export interface RequestBody {
      companionId: string;
      messages: { role: string; content: string; }[];
    }
    namespace Responses {
      export interface $201 {
      }
      export interface $400 {
        message: string;
      }
      export interface $500 {
        message: string;
      }
    }
    export interface Config {
      operationId: "createBulkMessage";
      method: "post";
      expressPath: "/messages/bulk";
      openapiPath: "/messages/bulk";
      pathParams: PathParameters;
      queryParams: QueryParameters;
      requestBody: RequestBody;
      headers?: any;
      responses: Responses.$201 | Responses.$400 | Responses.$500;
      successResponses: Responses.$201;
    }
  }
  namespace CreateCompanion {
    export type QueryParameters = {};
    export type PathParameters = {};
    export interface RequestBody {
      name: string;
      hasOnBoarding: boolean;
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
        items: { companionId: string; name: string; createdAt: string; updatedAt: string; hasOnBoarding: boolean; }[];
        meta: { pageSize: number; previousPage?: number; nextPage?: number; pageCount: number; itemCount: number; };
        links: { self: string; next?: string; prev?: string; };
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
        items: { messageId: string; content: string; role: 'user' | 'assistant' | 'system' | 'tool' | 'function' | 'developer'; createdAt: string; updatedAt: string; }[];
        meta: { pageSize: number; previousPage?: number; nextPage?: number; pageCount: number; itemCount: number; };
        links: { self: string; next?: string; prev?: string; };
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
  namespace CreateEmailCampaign {
    export type QueryParameters = {};
    export interface PathParameters {
      companionId: string;
    }
    export type RequestBody = {};
    namespace Responses {
      export interface $201 {
        emailCampaignId: string;
        companionId: string;
      }
      export interface $400 {
        message: string;
      }
      export interface $500 {
        message: string;
      }
    }
    export interface Config {
      operationId: "createEmailCampaign";
      method: "post";
      expressPath: "/companions/:companionId/create-campaign";
      openapiPath: "/companions/{companionId}/create-campaign";
      pathParams: PathParameters;
      queryParams: QueryParameters;
      requestBody: RequestBody;
      headers?: any;
      responses: Responses.$201 | Responses.$400 | Responses.$500;
      successResponses: Responses.$201;
    }
  }
  namespace GetEmailCampaigns {
    export type QueryParameters = {};
    export interface PathParameters {
      companionId: string;
    }
    export type RequestBody = {};
    namespace Responses {
      export interface $200 {
        items: { emailCampaignId: string; isIndividual: boolean | null; createdAt: string; updatedAt: string; companionId: string; name: string | null; }[];
        itemCount: integer;
      }
      export interface $400 {
        message: string;
      }
      export interface $500 {
        message: string;
      }
    }
    export interface Config {
      operationId: "getEmailCampaigns";
      method: "get";
      expressPath: "/companions/:companionId/emailCampaigns";
      openapiPath: "/companions/{companionId}/emailCampaigns";
      pathParams: PathParameters;
      queryParams: QueryParameters;
      requestBody: RequestBody;
      headers?: any;
      responses: Responses.$200 | Responses.$400 | Responses.$500;
      successResponses: Responses.$200;
    }
  }
  namespace GetEmailCampaign {
    export type QueryParameters = {};
    export interface PathParameters {
      emailCampaignId: string;
    }
    export type RequestBody = {};
    namespace Responses {
      export interface $200 {
        emailCampaignId: string;
        companionId: string;
        isIndividual?: boolean | null;
        name: string | null;
        createdAt: string;
        emails?: { emailId: string; content: string; createdAt: string; }[];
      }
      export interface $400 {
        message: string;
      }
      export interface $500 {
        message: string;
      }
    }
    export interface Config {
      operationId: "getEmailCampaign";
      method: "get";
      expressPath: "/emailCampaigns/:emailCampaignId";
      openapiPath: "/emailCampaigns/{emailCampaignId}";
      pathParams: PathParameters;
      queryParams: QueryParameters;
      requestBody: RequestBody;
      headers?: any;
      responses: Responses.$200 | Responses.$400 | Responses.$500;
      successResponses: Responses.$200;
    }
  }
  namespace UpdateEmailCampaign {
    export type QueryParameters = {};
    export interface PathParameters {
      emailCampaignId: string;
    }
    export interface RequestBody {
      isIndividual: boolean;
      name: string;
    }
    namespace Responses {
      export interface $200 {
        emailCampaignId: string;
        companionId: string;
        isIndividual?: boolean | null;
        name: string | null;
        createdAt: string;
        emails?: { emailId: string; content: string; createdAt: string; }[];
      }
      export interface $400 {
        message: string;
      }
      export interface $500 {
        message: string;
      }
    }
    export interface Config {
      operationId: "updateEmailCampaign";
      method: "patch";
      expressPath: "/emailCampaigns/:emailCampaignId";
      openapiPath: "/emailCampaigns/{emailCampaignId}";
      pathParams: PathParameters;
      queryParams: QueryParameters;
      requestBody: RequestBody;
      headers?: any;
      responses: Responses.$200 | Responses.$400 | Responses.$500;
      successResponses: Responses.$200;
    }
  }
  namespace CreateEmail {
    export type QueryParameters = {};
    export interface PathParameters {
      emailCampaignId: string;
    }
    export type RequestBody = {};
    namespace Responses {
      export interface $201 {
        emailId: string;
        content: string;
        companionId: string;
      }
      export interface $400 {
        message: string;
      }
      export interface $500 {
        message: string;
      }
    }
    export interface Config {
      operationId: "createEmail";
      method: "post";
      expressPath: "/emailCampaigns/:emailCampaignId/create-email";
      openapiPath: "/emailCampaigns/{emailCampaignId}/create-email";
      pathParams: PathParameters;
      queryParams: QueryParameters;
      requestBody: RequestBody;
      headers?: any;
      responses: Responses.$201 | Responses.$400 | Responses.$500;
      successResponses: Responses.$201;
    }
  }
  namespace SendMessagesAndSave {
    export type QueryParameters = {};
    export type PathParameters = {};
    export interface RequestBody {
      message: { role: 'user' | 'assistant' | 'system' | 'tool' | 'function' | 'developer'; content: string; };
      companionId: string;
    }
    namespace Responses {
      export interface $200 {
        id: string;
        choices: { message: { role: string; content: string | null; }; }[];
      }
      export interface $500 {
        message: string;
      }
    }
    export interface Config {
      operationId: "sendMessagesAndSave";
      method: "post";
      expressPath: "/gpt/messages";
      openapiPath: "/gpt/messages";
      pathParams: PathParameters;
      queryParams: QueryParameters;
      requestBody: RequestBody;
      headers?: any;
      responses: Responses.$200 | Responses.$500;
      successResponses: Responses.$200;
    }
  }
  namespace CreateMoreHistory {
    export type QueryParameters = {};
    export type PathParameters = {};
    export interface RequestBody {
      messages: { role: 'user' | 'assistant' | 'system' | 'tool' | 'function' | 'developer'; content: string; }[];
      companionId: string;
    }
    namespace Responses {
      export interface $200 {
        id: string;
        choices: { message: { role: 'user' | 'assistant' | 'system' | 'tool' | 'function' | 'developer'; content: string | null; }; }[];
      }
      export interface $400 {
        message: string;
      }
      export interface $500 {
        message: string;
      }
    }
    export interface Config {
      operationId: "createMoreHistory";
      method: "post";
      expressPath: "/gpt/history";
      openapiPath: "/gpt/history";
      pathParams: PathParameters;
      queryParams: QueryParameters;
      requestBody: RequestBody;
      headers?: any;
      responses: Responses.$200 | Responses.$400 | Responses.$500;
      successResponses: Responses.$200;
    }
  }
}