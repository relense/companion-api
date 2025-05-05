type EmailRow = {
  emailId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  emailCampaignId: string;
};

export class Email {
  constructor(
    public readonly emailId: string,
    public readonly content: string,
    public readonly createdAt: string,
    public readonly updatedAt: string,
    public readonly emailCampaignId: string
  ) {}

  toResource() {
    return {
      emailId: this.emailId,
      content: this.content,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      emailCampaignId: this.emailCampaignId,
    };
  }

  static fromRow(row: EmailRow): Email {
    return new Email(
      row.emailId,
      row.content,
      row.createdAt,
      row.updatedAt,
      row.emailCampaignId
    );
  }
}
