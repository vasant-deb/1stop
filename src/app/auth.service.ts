import { Injectable } from '@angular/core';
import { HttpClient,HttpParams  } from '@angular/common/http';
import { Observable } from 'rxjs';
const API_BASE_URL = 'https://api.yusyah.com/public/';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  constructor(private http: HttpClient) {}
  

  signup(value: {firstName: string,middleName: string,lastName: string,referredBy: string,docType: string,addressName: string,company: string,address: string,address2: string,city: string,zipcode: string,state: string,phone: number,gst: string,email:string,password: string,confirmPassword: string}) {
    return this.http.post<{message:string,email:string,token: string}>(API_BASE_URL +'register', value);
  }

  login(value: {email: string, password: string }) {
    return this.http.post<{error:boolean,message:string,email:string,token: string}>(API_BASE_URL +'login', value);
  }
  checkauths({ email, token }: { email: string, token: string }): Observable<any> {
    return this.http.post<any>(API_BASE_URL +'checkauth', { email, token });
  }
  updateaddress({updatedAddress}: { updatedAddress:any }): Observable<any> {
    return this.http.post<any>(API_BASE_URL +'updateaddress', {updatedAddress });
  }
  updatepassword({change}: { change:any }): Observable<any> {
    return this.http.post<any>(API_BASE_URL +'updatepassword', {change });
  }
  getorderhistory({ email, token }: { email: string, token: string }): Observable<{ error: boolean ,stats:any[]}> {
    return this.http.post<{ error: boolean,stats:any[] }>(API_BASE_URL +'orderhistory', { email, token });
  }
  checkconfirm({shippingId, billingId  }: { shippingId: string, billingId: string }): Observable<{ error: boolean ,stats:any[]}> {
    return this.http.post<{ error: boolean ,stats:any[]}>(API_BASE_URL +'confirmdetails', { shippingId, billingId });
  }
  checkout({shippingId, billingId,token,email,notes,shippingType }: { shippingId: string, billingId: string,email: string, token: string,notes:string,shippingType:string }): Observable<{ error: boolean,message:string}> {
    return this.http.post<{ error: boolean,message:string }>(API_BASE_URL +'checkout', { shippingId, billingId ,token,email,notes,shippingType});
  }
  deletecart({ cartId }: { cartId: number }): Observable<{ error: boolean }> {
    return this.http.post<{ error: boolean }>(API_BASE_URL +'deletecartitem', { cartId });
  }
  userdetails(value: {email: string, token: string }) {
    return this.http.post<{message:string,firstname:string,lastname: string,email: string,countcart:number,total:number,cart: any[]}>(API_BASE_URL +'userdetails', value);
  }
  getcategories() {
    return this.http.get<{message:string,stats: any[]}>(API_BASE_URL +'categories');
  }
  addTocart(cartItems: any[], token: string | null, email: string | null): Observable<any> {
    let params = new HttpParams().set('token', token || '').set('email', email || '');
    return this.http.post<any>(API_BASE_URL +`addalltoacart`, { cartItems }, { params });
}
  getCategory(slug: string | null, token: string | null, email: string | null): Observable<any> {
    let params = new HttpParams().set('token', token || '').set('email', email || '');
    return this.http.get<any>(API_BASE_URL +`getcategory/${slug}`, { params });
  }
  getPage(slug: string | null, token: string | null, email: string | null): Observable<any> {
    let params = new HttpParams().set('token', token || '').set('email', email || '');
    return this.http.get<any>(API_BASE_URL +`getpage/${slug}`, { params });
  }
  getOrderDetails(id: string | null): Observable<any> {
    return this.http.post<any>(API_BASE_URL +`getorderdetails`, { id });
  }
  getCartItems(token: string | null, email: string | null): Observable<any> {
    let params = new HttpParams().set('token', token || '').set('email', email || '');
    return this.http.get<any>(API_BASE_URL +`getcartitems`, { params });
  }
  
  getAddress(token: string | null, email: string | null): Observable<any> {
    let params = new HttpParams().set('token', token || '').set('email', email || '');
    return this.http.get<any>(API_BASE_URL +`getAddress`, { params });
  }
  getProduct(slug: string | null, token: string | null): Observable<any> {
    let params = new HttpParams().set('token', token || '');
    return this.http.get<any>(API_BASE_URL +`getproduct/${slug}`, { params });
  }
  getaccessories(token: string | null, email: string | null): Observable<any> {
    let params = new HttpParams().set('token', token || '').set('email', email || '');
    return this.http.get<any>(API_BASE_URL +`accessories`, { params });
  }
  getslides() {
    return this.http.get<{message:string,stats: any[]}>(API_BASE_URL +'slides');
  }
  getlatestdevices(){
    return this.http.get<{message:string,stats: any[]}>(API_BASE_URL +'latestdevices');
  }
  getdevices(){
    return this.http.get<{message:string,stats: any[]}>(API_BASE_URL +'devices');
  }
  getheading(){
    return this.http.get<{message:string,stats: string}>(API_BASE_URL +'getheading');
  }
  getmenus(){
    return this.http.get<{message:string,stats: any[]}>(API_BASE_URL +'menus');
  }
 
  
  saleproducts(){
    return this.http.get<{message:string,stats: any[]}>(API_BASE_URL +'saleproducts');
  }
}
