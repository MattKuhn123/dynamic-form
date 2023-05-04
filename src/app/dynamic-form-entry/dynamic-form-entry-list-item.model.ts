import { v4 as uuid } from 'uuid';

export class DynamicFormEntryListItem {
  private _entryUUID: string;
  public get entryUUID(): string { return this._entryUUID; }

  private _editUUID: string;
  public get editUUID(): string { return this._editUUID; }

  title: string
  user: string;
  date: Date;

  constructor(options: {
    title?: string;
    user?: string;
    date?: Date;
    entryUUID?: string;
    editUUID?: string;
  } = {}) {
    this.title = options.title || '';
    this.user = options.user || '';
    this.date = options.date || new Date();
    this._editUUID = options.editUUID || '';
    this._entryUUID = options.entryUUID || uuid();
  }
}