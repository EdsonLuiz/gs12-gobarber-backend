import { IParseMailTemplateDTO } from '@shared/container/providers/MailTemplateProvider/dtos/IParseTemplateDTO';

export interface IMailContact {
  name: string;
  email: string;
}

export interface ISendMailDTO {
  to: IMailContact;
  from?: IMailContact;
  subject: string;
  templateData: IParseMailTemplateDTO;
}
