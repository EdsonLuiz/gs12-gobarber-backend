import { IMailTemplateProvider } from '../models/IMailTemplateProvider';
import { IParseMailTemplateDTO } from '../dtos/IParseTemplateDTO';

export class FakeMailTemplateProvider implements IMailTemplateProvider {
  public async parse({ template }: IParseMailTemplateDTO): Promise<string> {
    return template;
  }
}
