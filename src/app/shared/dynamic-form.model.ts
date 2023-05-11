import { DynamicFormSection } from "./dynamic-form-section.model";
import { v4 as uuid } from 'uuid';

export class DynamicForm {
  editUUID: string;

  subtitle: string;
  sections: DynamicFormSection[];
  title: string;

  constructor(options: {
    subtitle?: string;
    sections?: DynamicFormSection[];
    title?: string;
    editUUID?: string;
  } = {}) {
    this.subtitle = options.subtitle || "";
    this.sections = options.sections || [];
    this.title = options.title || "";
    this.editUUID = options.editUUID || uuid();
  }
}
