import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NotFoundGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    this.router.navigate(['/404']);
    return false;
  }
}
