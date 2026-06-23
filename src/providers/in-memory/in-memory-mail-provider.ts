import { IMailProvider, SendMailDTO } from "../mail-provider";

export class InMemoryMailProvider implements IMailProvider {
  public emails: SendMailDTO[] = [];

  async sendMail(data: SendMailDTO): Promise<void> {
    this.emails.push(data);
  }
}
