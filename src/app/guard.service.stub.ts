import { Injectable } from '@angular/core';
import { AuthService } from './auth.service.stub';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GuardService {

  constructor(private auth: AuthService) {}

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.auth.isSignedIn) {
      return false;
    }

    if (this.auth.isAdmin) {
      return true;
    }

    return state.url.startsWith("run");
  }
}
