import {Inject, Injectable} from '@angular/core';
import {CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {CreateService} from '../services/create.service';
import {JoinService} from '../services/join.service';

@Injectable()
export class JoinGuardService implements CanActivate {
  joinService: JoinService;
  constructor(@Inject(JoinService) joinservice: JoinService, private router: Router) {
    this.joinService = joinservice;
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const url: string = state.url;
    console.log(this.checkData(url));
    return this.checkData(url);
  }

  checkData(url: string): boolean {
    return (!this.joinService.dataLoaded);
  }
}
