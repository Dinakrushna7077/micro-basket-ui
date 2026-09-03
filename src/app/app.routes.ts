import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { About } from './pages/about/about';
import { PageNotFound } from './page-not-found/page-not-found';
import { Profile } from './pages/profile/profile';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Dashboard } from './pages/admin/dashboard';
import { Users } from './pages/admin/users/users';
import { AdminLayout } from './pages/admin/admin-layout/admin-layout';
import { adminGuard } from './core/guards/admin-guard';
import { Products } from './pages/admin/products/products';
import { ProductForm } from './pages/admin/product-form/product-form';
import { LowStock } from './pages/admin/low-stock/low-stock';
import { Orders } from './pages/admin/orders/orders';
import { ProductDetail } from './pages/product-detail/product-detail';
import { CartPage } from './pages/cart/cart';
import { userGuard } from './core/guards/user-guard';
import { MyOrders } from './pages/my-orders/my-orders';
import { Contact } from './pages/contact/contact';
import { ProfileEdit } from './pages/edit-profile/edit-profile';
import { ChangePassword } from './pages/change-password/change-password';
import { OrderDetails } from './pages/order-details/order-details';
import { Checkout } from './pages/checkout/checkout';
import { OrderSuccess } from './pages/order-success/order-success';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'about', component: About },
  { path: 'contact', component: Contact },
  { path: 'register', component: Register },
  {path:'product/:id',component:ProductDetail},
  {path:'change-password',component:ChangePassword,canActivate: [userGuard]},
  {path:'checkout',component:Checkout,canActivate:[userGuard]},
  {path:'order-success',component:OrderSuccess,canActivate:[userGuard]},
  { path: 'order-details/:id', component: OrderDetails, canActivate: [userGuard] },
  { path: 'profile/:id', component: Profile ,canActivate:[userGuard]},
  { path: 'profile/edit/:id', component: ProfileEdit ,canActivate:[userGuard]},

  { path: 'cart', component: CartPage, canActivate: [userGuard] },
  { path: 'profile/:id', component: Profile, canActivate: [userGuard] },
  { path: 'my-orders', component: MyOrders, canActivate: [userGuard] },
  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [adminGuard],
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'users', component: Users },
      { path: 'products', component: Products },
      { path: 'products/add', component: ProductForm },
      { path: 'products/edit/:id', component: ProductForm },
      { path: 'low-stock', component: LowStock },
      {path:'orders',component:Orders},
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', component: PageNotFound }
];
