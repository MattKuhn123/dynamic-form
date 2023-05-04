import { Injectable } from '@angular/core';

export const users: (undefined | string)[] = [
  undefined,
  'user1',
  'user2',
  'admin1',
  'admin2',
];

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: undefined | 'user1' | 'user2' | 'admin1' | 'admin2' = undefined;

  constructor() { }

  public signIn(user: undefined | 'user1' | 'user2' | 'admin1' | 'admin2'): void { this.user = user; }
  public get isSignedIn(): boolean { return !!this.user; }
  public get isAdmin(): boolean { return this.user === 'admin1' || this.user === 'admin2'; }
}
