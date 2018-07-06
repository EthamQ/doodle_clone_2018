import {Inject, Injectable} from '@angular/core';
import {CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {CreateService} from '../services/create.service';

@Injectable()
export class CreateGuardService implements CanActivate {
  createService: CreateService;
  constructor(@Inject(CreateService) createservice: CreateService, private router: Router) {
    this.createService = createservice;
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const url: string = state.url;
    console.log(this.checkData(url));
    return this.checkData(url);
  }

  checkData(url: string): boolean {
    if (this.createService.calendarBool && this.createService.detailsBool) {
      return true;
    }

    // Store the attempted URL for redirecting
    this.createService.redirectUrl = url;

    // Navigate to the login page with extras
    this.router.navigate(['/details']);
    return false;
  }
}
