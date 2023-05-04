import { DynamicFormSection } from "./dynamic-form-section.model";

export class DynamicForm {
  private _entryUUID: string;
  public get entryUUID(): string { return this._entryUUID; }

  private _editUUID: string;
  public get editUUID(): string { return this._editUUID; }

  subtitle: string;
  sections: DynamicFormSection[];
  title: string;

  constructor(options: {
    subtitle?: string;
    sections?: DynamicFormSection[];
    title?: string;
    entryUUID?: string;
    editUUID?: string;
  } = {}) {
    this.subtitle = options.subtitle || "";
    this.sections = options.sections || [];
    this.title = options.title || "";
    debugger;
    this._entryUUID = options.entryUUID || self.crypto.randomUUID();
    this._editUUID = options.editUUID || self.crypto.randomUUID();
  }
}