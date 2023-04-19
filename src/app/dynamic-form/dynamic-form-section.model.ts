import { DynamicFormQuestion } from "./dynamic-form-question.model";

export class DynamicFormSection {
  description: string;
  dependsOn: { step: number, key: string, value: string }[];
  key: string;
  questions: DynamicFormQuestion<any>[];
  title: string;

  constructor(options: {
    description?: string;
    dependsOn?: { step: number, key: string, value: string }[];
    key?: string;
    questions?: DynamicFormQuestion<any>[];
    title?: string;
  } = {}) {
    this.description = options.description || "";
    this.dependsOn = options.dependsOn || [];
    this.key = options.key || "";
    this.questions = options.questions || [];
    this.title = options.title || "";
  }
}