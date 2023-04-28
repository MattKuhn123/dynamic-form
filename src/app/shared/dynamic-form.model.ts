import { DynamicFormSection } from "./dynamic-form-section.model";

export class DynamicForm {
  subtitle: string;
  sections: DynamicFormSection[];
  title: string;

  constructor(options: {
    subtitle?: string;
    sections?: DynamicFormSection[];
    title?: string;
  } = {}) {
    this.subtitle = options.subtitle || "";
    this.sections = options.sections || [];
    this.title = options.title || "";
  }
}