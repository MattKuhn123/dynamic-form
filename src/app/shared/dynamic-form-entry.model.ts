import { v4 as uuid } from 'uuid';

export class DynamicFormEntry {
  private _entryUUID: string;
  public get entryUUID(): string { return this._entryUUID; }

  private _editUUID: string;
  public get editUUID(): string { return this._editUUID; }

  sections: any[];
  user: string;
  lastAccessedDate: Date;

  constructor(options: {
    sections?: any[];
    entryUUID?: string;
    editUUID?: string;
    user?: string;
    lastAccessedDate?: Date;
  } = {}) {
    this.sections = options.sections || [];
    this.user = options.user || '';
    this.lastAccessedDate = options.lastAccessedDate || new Date();
    this._editUUID = options.editUUID || '';
    this._entryUUID = options.entryUUID || uuid();
  }
}