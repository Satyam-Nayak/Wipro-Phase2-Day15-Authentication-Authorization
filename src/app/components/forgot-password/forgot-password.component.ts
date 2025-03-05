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
  selector: 'app-forgot-password',
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
    <div class="forgot-password-container">
      <h2>Forgot Password</h2>
      <p>Enter your email address to reset your password.</p>
      <form [formGroup]="forgotPasswordForm" (ngSubmit)="onSubmit()">
        <mat-form-field>
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" type="email">
          <mat-error *ngIf="forgotPasswordForm.get('email')?.hasError('required')">
            Email is required
          </mat-error>
          <mat-error *ngIf="forgotPasswordForm.get('email')?.hasError('email')">
            Please enter a valid email
          </mat-error>
        </mat-form-field>

        <button mat-raised-button color="primary" type="submit" [disabled]="!forgotPasswordForm.valid">
          Reset Password
        </button>

        <p class="back-to-login">
          <a routerLink="/login">Back to Login</a>
        </p>
      </form>
    </div>
  `,
  styles: [`
    .forgot-password-container {
      max-width: 400px;
      margin: 2rem auto;
      padding: 2rem;
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .back-to-login {
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
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      const { email } = this.forgotPasswordForm.value;
      this.authService.forgotPassword(email).subscribe({
        next: () => {
          this.snackBar.open(
            'Password reset instructions have been sent to your email.',
            'Close',
            { duration: 5000 }
          );
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.snackBar.open(
            error.error?.message || 'Failed to process request. Please try again.',
            'Close',
            { duration: 5000 }
          );
        }
      });
    }
  }
}