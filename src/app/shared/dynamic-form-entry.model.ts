export class DynamicFormEntry {
  private _entryUUID: string;
  public get entryUUID(): string { return this._entryUUID; }

  private _editUUID: string;
  public get editUUID(): string { return this._editUUID; }

  sections: any[];

  constructor(options: {
    sections?: any[];
    entryUUID?: string;
    editUUID?: string;
  } = {}) {
    this.sections = options.sections || [];
    this._editUUID = options.editUUID || '';
    this._entryUUID = options.entryUUID || self.crypto.randomUUID();
  }
}