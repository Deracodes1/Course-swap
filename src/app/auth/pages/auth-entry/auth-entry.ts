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
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auth-entry.html',
  styleUrl: './auth-entry.css',
})
export class AuthEntry implements OnInit {
  authForm!: FormGroup;
  isSignUpMode = false; // Toggle between register view and simple login view
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.authForm = this.fb.group({
      name: ['', this.isSignUpMode ? [Validators.required, Validators.minLength(2)] : []],
      email: ['', [Validators.required, Validators.email, this.institutionalEmailValidator]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
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

  toggleMode(): void {
    this.isSignUpMode = !this.isSignUpMode;
    this.errorMessage = '';
    this.initForm(); // Re-initialize fields to apply or clear constraints cleanly
  }

  onSubmit(): void {
    this.authForm.markAllAsTouched();
    this.errorMessage = '';

    if (this.authForm.invalid) {
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
      // Create user profile entity natively inside the system
      this.authService.setAuthUser(name, email);
      alert('Account configured successfully! Redirecting to setup requirements.');
      // Proceed directly onto your custom sequential wizard screen
      // this.router.navigate(['/onboarding']);
    } else {
      // Client-side authentication lookup fallback
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
}
