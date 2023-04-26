export class DynamicFormQuestion {
  controlType: string;
  conditions: { key: string, value: string }[];
  key: string;
  label: string;
  options: { key: string, value: string }[];
  required: boolean;
  type: string;
  
  constructor(options: {
    controlType?: string;
    conditions?: { key: string, value: string }[];
    key?: string;
    label?: string;
    options?: { key: string, value: string }[];
    required?: boolean;
    type?: string;
  } = {}) {
    this.controlType = options.controlType || '';
    this.conditions = options.conditions || [];
    this.key = options.key || '';
    this.label = options.label || '';
    this.options = options.options || [];
    this.required = !!options.required;
    this.type = options.type || '';
  }
}