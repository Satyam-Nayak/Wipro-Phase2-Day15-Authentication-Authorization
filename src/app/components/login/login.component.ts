import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    RouterLink
  ],
  template: `
    <div class="login-container">
      <h2>Login</h2>
      <p>Don't have an account? <a routerLink="/register">Register here</a></p>
      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
        <mat-form-field>
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" type="email">
          <mat-error *ngIf="loginForm.get('email')?.hasError('required')">Email is required</mat-error>
          <mat-error *ngIf="loginForm.get('email')?.hasError('email')">Please enter a valid email</mat-error>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Password</mat-label>
          <input matInput formControlName="password" type="password">
          <mat-error *ngIf="loginForm.get('password')?.hasError('required')">Password is required</mat-error>
        </mat-form-field>

        <button mat-raised-button color="primary" type="submit" [disabled]="!loginForm.valid">
          Login
        </button>

        <p class="forgot-password">
          <a routerLink="/forgot-password">Forgot Password?</a>
        </p>
      </form>
    </div>
  `,
  styles: [`
    .login-container {
      max-width: 400px;
      margin: 2rem auto;
      padding: 2rem;
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    p {
      margin-bottom: 1rem;
    }
    .forgot-password {
      text-align: center;
      margin-top: 1rem;
    }
    a {
      color: #3f51b5;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe({
        next: () => {
          this.snackBar.open('Login successful!', 'Close', { duration: 3000 });
          this.router.navigate(['/todos']);
        },
        error: (error) => {
          console.error('Login failed:', error);
          this.snackBar.open(
            error.error?.message || 'Please register first if you don\'t have an account',
            'Close',
            { duration: 5000 }
          );
        }
      });
    }
  }
}