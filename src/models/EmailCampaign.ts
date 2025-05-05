type EmailCampaignRow = {
  emailCampaignId: string;
  isIndividual: boolean;
  createdAt: string;
  updatedAt: string;
  companionId: string;
};

export class EmailCampaign {
  constructor(
    public readonly emailCampaignId: string,
    public readonly isIndividual: boolean,
    public readonly createdAt: string,
    public readonly updatedAt: string,
    public readonly companionId: string
  ) {}

  toResource() {
    return {
      emailCampaignId: this.emailCampaignId,
      isIndividual: this.isIndividual,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      companionId: this.companionId,
    };
  }

  static fromRow(row: EmailCampaignRow): EmailCampaign {
    return new EmailCampaign(
      row.emailCampaignId,
      row.isIndividual,
      row.createdAt,
      row.updatedAt,
      row.companionId
    );
  }
}
