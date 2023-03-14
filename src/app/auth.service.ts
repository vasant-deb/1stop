import { Injectable } from '@angular/core';
import { HttpClient,HttpParams  } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}

  signup(value: {firstName: string,middleName: string,lastName: string,referredBy: string,docType: string,addressName: string,company: string,address: string,address2: string,city: string,zipcode: string,state: string,phone: number,gst: string,email:string,password: string,confirmPassword: string}) {
    return this.http.post<{message:string,email:string,token: string}>('https://checklistforme.online/api/public/register', value);
  }

  login(value: {email: string, password: string }) {
    return this.http.post<{error:boolean,message:string,email:string,token: string}>('https://checklistforme.online/api/public/login', value);
  }
  checkauths({ email, token }: { email: string, token: string }): Observable<any> {
    return this.http.post<any>('https://checklistforme.online/api/public/checkauth', { email, token });
  }
  updateaddress({updatedAddress}: { updatedAddress:any }): Observable<any> {
    return this.http.post<any>('https://checklistforme.online/api/public/updateaddress', {updatedAddress });
  }
  updatepassword({change}: { change:any }): Observable<any> {
    return this.http.post<any>('https://checklistforme.online/api/public/updatepassword', {change });
  }
  getorderhistory({ email, token }: { email: string, token: string }): Observable<{ error: boolean ,stats:any[]}> {
    return this.http.post<{ error: boolean,stats:any[] }>('https://checklistforme.online/api/public/orderhistory', { email, token });
  }
  checkconfirm({shippingId, billingId  }: { shippingId: string, billingId: string }): Observable<{ error: boolean ,stats:any[]}> {
    return this.http.post<{ error: boolean ,stats:any[]}>('https://checklistforme.online/api/public/confirmdetails', { shippingId, billingId });
  }
  checkout({shippingId, billingId,token,email }: { shippingId: string, billingId: string,email: string, token: string }): Observable<{ error: boolean,message:string}> {
    return this.http.post<{ error: boolean,message:string }>('https://checklistforme.online/api/public/checkout', { shippingId, billingId ,token,email});
  }
  deletecart({ cartId }: { cartId: number }): Observable<{ error: boolean }> {
    return this.http.post<{ error: boolean }>('https://checklistforme.online/api/public/deletecartitem', { cartId });
  }
  userdetails(value: {email: string, token: string }) {
    return this.http.post<{message:string,firstname:string,lastname: string,email: string,countcart:number,total:number,cart: any[]}>('https://checklistforme.online/api/public/userdetails', value);
  }
  getcategories() {
    return this.http.get<{message:string,stats: any[]}>('https://checklistforme.online/api/public/categories');
  }
  addTocart(cartItems: any[], token: string | null, email: string | null): Observable<any> {
    let params = new HttpParams().set('token', token || '').set('email', email || '');
    return this.http.post<any>(`https://checklistforme.online/api/public/addalltoacart`, { cartItems }, { params });
}
  getCategory(slug: string | null, token: string | null, email: string | null): Observable<any> {
    let params = new HttpParams().set('token', token || '').set('email', email || '');
    return this.http.get<any>(`https://checklistforme.online/api/public/getcategory/${slug}`, { params });
  }
  getPage(slug: string | null, token: string | null, email: string | null): Observable<any> {
    let params = new HttpParams().set('token', token || '').set('email', email || '');
    return this.http.get<any>(`https://checklistforme.online/api/public/getpage/${slug}`, { params });
  }
  getOrderDetails(id: string | null): Observable<any> {
    return this.http.post<any>(`https://checklistforme.online/api/public/getorderdetails`, { id });
  }
  getCartItems(token: string | null, email: string | null): Observable<any> {
    let params = new HttpParams().set('token', token || '').set('email', email || '');
    return this.http.get<any>(`https://checklistforme.online/api/public/getcartitems`, { params });
  }
  
  getAddress(token: string | null, email: string | null): Observable<any> {
    let params = new HttpParams().set('token', token || '').set('email', email || '');
    return this.http.get<any>(`https://checklistforme.online/api/public/getAddress`, { params });
  }
  getProduct(slug: string | null, token: string | null): Observable<any> {
    let params = new HttpParams().set('token', token || '');
    return this.http.get<any>(`https://checklistforme.online/api/public/getproduct/${slug}`, { params });
  }
  getaccessories(token: string | null, email: string | null): Observable<any> {
    let params = new HttpParams().set('token', token || '').set('email', email || '');
    return this.http.get<any>(`https://checklistforme.online/api/public/accessories`, { params });
  }
  getslides() {
    return this.http.get<{message:string,stats: any[]}>('https://checklistforme.online/api/public/slides');
  }
  getlatestdevices(){
    return this.http.get<{message:string,stats: any[]}>('https://checklistforme.online/api/public/latestdevices');
  }
  getdevices(){
    return this.http.get<{message:string,stats: any[]}>('https://checklistforme.online/api/public/devices');
  }
  getmenus(){
    return this.http.get<{message:string,stats: any[]}>('https://checklistforme.online/api/public/menus');
  }
 
  
  saleproducts(){
    return this.http.get<{message:string,stats: any[]}>('https://checklistforme.online/api/public/saleproducts');
  }
}
