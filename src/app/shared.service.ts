import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  value: any;

  constructor(private authService: AuthService) { }

  async setValue(value: any): Promise<any> {
    try {
      const res = await this.authService.userdetails(value).toPromise();
      return Promise.resolve({firstname: res?.firstname, lastname: res?.lastname, email: res?.email, countcart: res?.countcart, cart: res?.cart, total: res?.total});
    } catch (err) {
      console.log(err);
    }
  }

  getValue(): any {
    return this.value;
  }
}
