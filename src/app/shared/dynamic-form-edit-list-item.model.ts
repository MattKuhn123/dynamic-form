export class DynamicFormEditListItem {

  private _editUUID: string;
  public get editUUID(): string { return this._editUUID; }

  title: string

  constructor(options: {
    title?: string;
    editUUID?: string;
  } = {}) {
    this.title = options.title || '';
    this._editUUID = options.editUUID || '';
  }
}