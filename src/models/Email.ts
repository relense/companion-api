type EmailRow = {
  emailId: string;
  content: string;
  like: boolean;
  dislike: boolean;
  followup: boolean;
  wasRefreshed: boolean;
  wasCopied: boolean;
  numberOfReplies: number;
  sentiment: number;
  firstReply: string;
  lastReply: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  emailCampaignId: string;
  wasSent: boolean;
  wasReplied: boolean;
  callScheduled: string;
  profilerId?: string | null;
};

export class Email {
  constructor(
    public readonly emailId: string,
    public readonly content: string,
    public readonly like: boolean,
    public readonly dislike: boolean,
    public readonly followup: boolean,
    public readonly wasRefreshed: boolean,
    public readonly wasCopied: boolean,
    public readonly wasSent: boolean,
    public readonly wasReplied: boolean,
    public readonly numberOfReplies: number,
    public readonly sentiment: number,
    public readonly firstReply: string,
    public readonly lastReply: string,
    public readonly callScheduled: string,
    public readonly notes: string,
    public readonly createdAt: string,
    public readonly updatedAt: string,
    public readonly emailCampaignId: string,
    public readonly profilerId?: string | null
  ) {}

  toResource() {
    return {
      emailId: this.emailId,
      content: this.content,
      like: this.like,
      dislike: this.dislike,
      followup: this.followup,
      wasRefreshed: this.wasRefreshed,
      wasCopied: this.wasCopied,
      wasSent: this.wasSent,
      wasReplied: this.wasReplied,
      numberOfReplies: this.numberOfReplies,
      sentiment: this.sentiment,
      firstReply: this.firstReply,
      lastReply: this.lastReply,
      callScheduled: this.callScheduled,
      notes: this.notes,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      emailCampaignId: this.emailCampaignId,
      profilerId: this.profilerId,
    };
  }

  static fromRow(row: EmailRow): Email {
    return new Email(
      row.emailId,
      row.content,
      row.like,
      row.dislike,
      row.followup,
      row.wasRefreshed,
      row.wasCopied,
      row.wasSent,
      row.wasReplied,
      row.numberOfReplies,
      row.sentiment,
      row.firstReply,
      row.lastReply,
      row.callScheduled,
      row.notes,
      row.createdAt,
      row.updatedAt,
      row.emailCampaignId,
      row.profilerId
    );
  }
}
