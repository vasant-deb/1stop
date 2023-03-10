import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MyaccountComponent } from './myaccount/myaccount.component';

import { LoginComponent } from './login/login.component';
import { CategoryComponent } from './category/category.component';
import { ProductComponent } from './product/product.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { CartComponent } from './cart/cart.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { NotFoundGuard } from './not-found.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: '404', component: NotFoundComponent },
  { path: '**', canActivate: [NotFoundGuard] },
  // other routes here
  { path: 'login', component: LoginComponent },
  { path: 'myaccount', component: MyaccountComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'category/:slug', component: CategoryComponent },
  { path: 'cart', component: CartComponent },
  { path: 'product/:slug', component: ProductComponent },
 //{ path: 'product/:slug', component: ProductComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
