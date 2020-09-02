import { IMailTemplateProvider } from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider';
import { HandlebarsMailTemplateProvider } from '@shared/container/providers/MailTemplateProvider/implementations/HandlebarsMailTemplateProvider';
import { container } from 'tsyringe';

const providers = {
  handlebars: HandlebarsMailTemplateProvider,
};

container.registerSingleton<IMailTemplateProvider>(
  'MailTemplateProvider',
  providers.handlebars,
);
