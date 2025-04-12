type CompanionRow = {
  companionId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export class Companion {
  constructor(
    public readonly companionId: string,
    public readonly name: string,
    public readonly createdAt: string,
    public readonly updatedAt: string
  ) {}

  toResource() {
    return {
      companionId: this.companionId,
      name: this.name,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  static fromRow(row: CompanionRow): Companion {
    return new Companion(
      row.companionId,
      row.name,
      row.createdAt,
      row.updatedAt
    );
  }
}
