import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { ProductListComponent } from './components/products/product-list/product-list.component';
import { ProductDetailsComponent } from './components/products/product-details/product-details.component';
import { ProductFormComponent } from './components/products/product-form/product-form.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'products', 
    component: ProductListComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'products/new', 
    component: ProductFormComponent, 
    canActivate: [AuthGuard, AdminGuard] 
  },
  { 
    path: 'products/edit/:id', 
    component: ProductFormComponent, 
    canActivate: [AuthGuard, AdminGuard] 
  },
  { 
    path: 'products/:id', 
    component: ProductDetailsComponent, 
    canActivate: [AuthGuard] 
  },
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  { path: '**', redirectTo: '/products' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { } 