import { IParseMailTemplateDTO } from '../dtos/IParseTemplateDTO';

export interface IMailTemplateProvider {
  parse(data: IParseMailTemplateDTO): Promise<string>;
}
