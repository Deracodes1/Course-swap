import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth-entry',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auth-entry.html',
  styleUrl: './auth-entry.css',
})
export class AuthEntry implements OnInit {
  authForm!: FormGroup;
  isSignUpMode = false; // Toggle between register view (Sign Up) and login view (Sign In)
  errorMessage = '';

  // Password visibility state tracks
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.authForm = this.fb.group(
      {
        name: ['', this.isSignUpMode ? [Validators.required, Validators.minLength(2)] : []],
        email: ['', [Validators.required, Validators.email, this.institutionalEmailValidator]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', this.isSignUpMode ? [Validators.required] : []],
      },
      {
        validators: this.isSignUpMode ? this.passwordMatchValidator : null,
      },
    );
  }

  // Custom validator enforcing institutional validation limits
  institutionalEmailValidator(control: AbstractControl): ValidationErrors | null {
    const email = control.value;
    if (email && !email.toLowerCase().endsWith('.edu')) {
      return {
        institutionalRequired: 'You must register with a valid university email address (.edu)',
      };
    }
    return null;
  }

  // Cross-field validator ensuring matching password inputs during Sign Up
  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  toggleMode(): void {
    this.isSignUpMode = !this.isSignUpMode;
    this.errorMessage = '';
    this.showPassword = false;
    this.showConfirmPassword = false;
    this.initForm(); // Re-initialize fields to apply or clear constraints cleanly
  }

  onSubmit(): void {
    this.authForm.markAllAsTouched();
    this.errorMessage = '';

    if (this.authForm.invalid) {
      if (this.authForm.errors?.['passwordMismatch']) {
        this.errorMessage = 'Passwords do not match.';
        return;
      }

      const emailErrors = this.authForm.get('email')?.errors;
      if (emailErrors?.['institutionalRequired']) {
        this.errorMessage = emailErrors['institutionalRequired'];
      } else {
        this.errorMessage = 'Please fix form fields before progressing.';
      }
      return;
    }

    const { name, email } = this.authForm.value;

    if (this.isSignUpMode) {
      this.authService.setAuthUser(name || 'New User', email);
      alert('Account configured successfully! Redirecting to setup requirements.');
      this.router.navigate(['/onboarding']);
    } else {
      this.authService.setAuthUser('Chinedu', email);

      const user = this.authService.currentUserSnapshot;
      if (user?.isOnboarded) {
        this.router.navigate(['/recommended-matches']);
        alert('Welcome back! Moving to dashboard matching feed.');
      } else {
        this.router.navigate(['/onboarding']);
        alert('Account session recovered, but profile setup is pending.');
      }
    }
  }

  // Fallback simulator handler for secondary feature criteria
  forgotPassword(): void {
    alert('Password reset instructions have been streamed to your institutional address.');
  }
}
