import nodemailer, { Transporter } from "nodemailer";
import { IMailProvider, SendMailDTO } from "../mail-provider";

export class NodemailerMailProvider implements IMailProvider {
  private client: Transporter | null = null;

  private async getClient(): Promise<Transporter> {
    if (this.client) {
      return this.client;
    }

    const account = await nodemailer.createTestAccount();

    this.client = nodemailer.createTransport({
      host: account.smtp.host,
      port: account.smtp.port,
      secure: account.smtp.secure,
      auth: {
        user: account.user,
        pass: account.pass,
      },
    });

    return this.client;
  }

  async sendMail({ to, subject, body }: SendMailDTO): Promise<void> {
    const client = await this.getClient();

    const message = await client.sendMail({
      from: "Equipe FieldVerify <noreply@fieldverify.com>",
      to,
      subject,
      html: body,
    });

    console.log("message sent: ", message.messageId);
    console.log("url: ", nodemailer.getTestMessageUrl(message));
  }
}
