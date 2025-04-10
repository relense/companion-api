type MessageRow = {
  messageId: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export class Message {
  constructor(
    public readonly messageId: string,
    public readonly description: string,
    public readonly createdAt: string,
    public readonly updatedAt: string
  ) {}

  toResource() {
    return {
      messageId: this.messageId,
      description: this.description,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  static fromRow(row: MessageRow): Message {
    return new Message(
      row.messageId,
      row.description,
      row.createdAt,
      row.updatedAt
    );
  }
}
