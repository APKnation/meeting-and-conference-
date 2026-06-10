import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  authService = inject(AuthService);
  router = inject(Router);

  form: any = {
    email: '',
    password: ''
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';

  onSubmit(): void {
    const { email, password } = this.form;
    this.authService.login({ email, password }).subscribe({
      next: data => {
        this.isLoggedIn = true;
        this.isLoginFailed = false;
        
        // Redirect based on role
        if (data.role === 'ADMIN') {
          this.router.navigate(['/admin/dashboard']);
        } else if (data.role === 'FACILITY_MANAGER') {
          this.router.navigate(['/fm/dashboard']);
        } else {
          this.router.navigate(['/customer/dashboard']);
        }
      },
      error: err => {
        this.errorMessage = err.error.message || 'Login failed';
        this.isLoginFailed = true;
      }
    });
  }
}
