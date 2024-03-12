import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { HomeComponent as AdminHomeComponent } from './components/admin/home/home.component';
import {CompleteVerificationComponent} from './components/complete-verification/complete-verification.component';
import { CategoriesComponent } from './components/admin/categories/categories.component';
import { ProductsComponent } from './components/admin/products/products.component';
import { ShoppingCartComponent } from './components/client/shopping-cart/shopping-cart.component';
import { CheckoutComponent } from './components/client/checkout/checkout.component';
import { ProveedoresComponent } from './components/admin/proveedores/proveedores.component';

const routes: Routes = [
  { path: '', component:HomeComponent },
  { path: 'home', component:HomeComponent },
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'reset-password', component: ResetPasswordComponent},
  {path: 'forgot-password', component: ForgotPasswordComponent},
  {path: 'admin', component: AdminHomeComponent},
  {path: 'complete-verification', component: CompleteVerificationComponent},
  {path: 'admin/categories', component: CategoriesComponent},
  {path: 'admin/products', component: ProductsComponent},
  {path: 'shopping-cart', component: ShoppingCartComponent},
  {path: 'checkout', component: CheckoutComponent},
  {path: 'admin/proveedores', component: ProveedoresComponent},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
