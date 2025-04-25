type Role = "assistant" | "user";

type MessageRow = {
  messageId: string;
  role: Role;
  content: string;
  createdAt: string;
  updatedAt: string;
  companionId: string;
};

export class Message {
  constructor(
    public readonly messageId: string,
    public readonly role: Role,
    public readonly content: string,
    public readonly createdAt: string,
    public readonly updatedAt: string,
    public readonly companionId: string
  ) {}

  toResource() {
    return {
      messageId: this.messageId,
      role: this.role,
      content: this.content,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      companionId: this.companionId,
    };
  }

  static fromRow(row: MessageRow): Message {
    return new Message(
      row.messageId,
      row.role,
      row.content,
      row.createdAt,
      row.updatedAt,
      row.companionId
    );
  }
}
