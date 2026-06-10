import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard/admin-dashboard.component';
import { FmDashboardComponent } from './pages/fm/fm-dashboard/fm-dashboard.component';
import { CustomerDashboardComponent } from './pages/customer/customer-dashboard/customer-dashboard.component';
import { BrowseFacilitiesComponent } from './pages/customer/browse-facilities/browse-facilities.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'admin/dashboard', 
    component: AdminDashboardComponent, 
    canActivate: [authGuard], 
    data: { roles: ['ADMIN'] } 
  },
  { 
    path: 'fm/dashboard', 
    component: FmDashboardComponent, 
    canActivate: [authGuard], 
    data: { roles: ['ADMIN', 'FACILITY_MANAGER'] } 
  },
  { 
    path: 'customer/dashboard', 
    component: CustomerDashboardComponent, 
    canActivate: [authGuard], 
    data: { roles: ['CUSTOMER'] } 
  },
  { 
    path: 'customer/facilities', 
    component: BrowseFacilitiesComponent, 
    canActivate: [authGuard], 
    data: { roles: ['CUSTOMER'] } 
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
