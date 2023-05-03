
export class DynamicFormSectionCondition {
  key: string;
  value: string;
  section: string;
  
  constructor(options: {
    key?: string;
    value?: string;
    section?: string;
  } = {}) {
    this.key = options.key || '';
    this.value = options.value || '';
    this.section = options.section || '';
  }
}