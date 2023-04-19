import { DynamicFormSection } from "./dynamic-form-section.model";

export class DynamicForm {
  description: string;
  sections: DynamicFormSection[];
  title: string;

  constructor(options: {
    description?: string;
    sections?: DynamicFormSection[];
    title?: string;
    } = {}) {
    this.description = options.description || "";
    this.sections = options.sections || [];
    this.title = options.title || "";
  }
}