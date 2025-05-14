type ProfilerRow = {
  profilerId: string;
  email: string;
  location: string;
  name: string;
  companyUrl: string;
  socialMediaUrl: string[];
  otherSourcesUrl: string[];
  createdAt: string;
  updatedAt: string;
  companionId: string;
  emailCampaignId: string;
};

export class Profiler {
  constructor(
    public readonly profilerId: string,
    public readonly email: string,
    public readonly location: string,
    public readonly name: string,
    public readonly companyUrl: string,
    public readonly socialMediaUrl: string[],
    public readonly otherSourcesUrl: string[],
    public readonly createdAt: string,
    public readonly updatedAt: string,
    public readonly companionId: string,
    public readonly emailCampaignId: string
  ) {}

  toResource() {
    return {
      profilerId: this.profilerId,
      email: this.email,
      location: this.location,
      name: this.name,
      companyUrl: this.companyUrl,
      socialMediaUrl: this.socialMediaUrl,
      otherSourcesUrl: this.otherSourcesUrl,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      companionId: this.companionId,
      emailCampaignId: this.emailCampaignId,
    };
  }

  static fromRow(row: ProfilerRow): Profiler {
    return new Profiler(
      row.profilerId,
      row.email,
      row.location,
      row.name,
      row.companyUrl,
      row.socialMediaUrl,
      row.otherSourcesUrl,
      row.createdAt,
      row.updatedAt,
      row.companionId,
      row.emailCampaignId
    );
  }
}
