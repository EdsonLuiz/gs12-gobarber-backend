export interface ITemplateVariables {
  [key: string]: string | number;
}

export interface IParseMailTemplateDTO {
  template: string;
  variables: ITemplateVariables;
}
