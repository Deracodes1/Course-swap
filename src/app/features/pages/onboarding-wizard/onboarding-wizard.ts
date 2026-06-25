import { Component, inject, OnInit } from '@angular/core';
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
import { MockDbService } from '../../../core/services/mock-db.service';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-onboarding-wizard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './onboarding-wizard.html',
  styleUrl: './onboarding-wizard.css',
})
export class OnboardingWizard implements OnInit {
  authService = inject(AuthService);
  onboardingForm!: FormGroup;
  currentStep = 1; // Step 1: Intent Selection, Step 2: Academic Profile
  errorMessage = '';

  // Mock static data arrays for dropdown inputs
  departments = [
    'Computer Science',
    'Mechanical Engineering',
    'Electrical Engineering',
    'Mathematics',
    'Physics',
  ];
  levels = [
    '100 Level',
    '200 Level',
    '300 Level',
    '400 Level',
    '500 Level',
    'Sophomore',
    'Junior',
    'Senior',
  ];
  availableCourses = [
    'Algorithms',
    'Data Structures',
    'Java',
    'Programming Fundamentals',
    'Calculus',
    'Linear Algebra',
    'Physics',
    'Statistics',
    'Discrete Math',
  ];

  constructor(
    private fb: FormBuilder,
    private db: MockDbService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.onboardingForm = this.fb.group(
      {
        // Step 1 Controls
        intent: ['', Validators.required], // 'Teach' | 'Learn' | 'Both'

        // Step 2 Controls
        department: ['', Validators.required],
        level: ['', Validators.required],
        canTeach: [[] as string[]],
        needsHelpWith: [[] as string[]],

        // Availability Checkboxes
        weekdays: [false],
        weekends: [false],
      },
      { validators: this.conditionalCourseValidator },
    );
  }

  // Multi-step custom cross-field validation check logic
  conditionalCourseValidator(control: AbstractControl): ValidationErrors | null {
    const intent = control.get('intent')?.value;
    const canTeach = control.get('canTeach')?.value || [];
    const needsHelpWith = control.get('needsHelpWith')?.value || [];

    if (intent === 'Teach' && canTeach.length === 0) {
      return { teachRequired: 'Please select at least one course you can teach.' };
    }
    if (intent === 'Learn' && needsHelpWith.length === 0) {
      return { learnRequired: 'Please select at least one course you need help with.' };
    }
    if (intent === 'Both') {
      if (canTeach.length === 0 || needsHelpWith.length === 0) {
        return {
          bothRequired:
            'When choosing "Both", you must select at least one course to teach and one to learn.',
        };
      }
    }
    return null;
  }

  // Handle Intent choices explicitly
  setIntent(intentValue: 'Teach' | 'Learn' | 'Both'): void {
    this.onboardingForm.patchValue({ intent: intentValue });
    this.errorMessage = '';
  }

  // Validation interceptor for Step 1 -> Step 2
  goToNextStep(): void {
    const intentControl = this.onboardingForm.get('intent');

    if (intentControl && intentControl.valid) {
      this.errorMessage = '';
      this.currentStep = 2;
    } else {
      this.errorMessage = 'Please choose what you want to do to continue.';
    }
  }

  // Handle Multi-Select course arrays cleanly within template
  toggleCourseSelection(
    controlName: 'canTeach' | 'needsHelpWith',
    course: string,
    event: Event,
  ): void {
    const selectEl = event.target as HTMLSelectElement;
    if (!course) return;

    const currentValues: string[] = [...this.onboardingForm.get(controlName)?.value];

    if (!currentValues.includes(course)) {
      currentValues.push(course);
    } else {
      const index = currentValues.indexOf(course);
      currentValues.splice(index, 1);
    }

    this.onboardingForm.get(controlName)?.setValue(currentValues);
    this.onboardingForm.get(controlName)?.markAsTouched();

    // Reset selection box index cleanly so players can multi-click the same component slot
    selectEl.value = '';
  }

  // Final validation checkpoint before form completion
  submitOnboarding(): void {
    this.onboardingForm.markAllAsTouched();
    this.errorMessage = '';

    if (this.onboardingForm.invalid) {
      this.errorMessage =
        'Please complete all required fields correctly before looking for matches.';
      return;
    }

    const availability: ('Weekdays' | 'Weekends')[] = [];
    if (this.onboardingForm.get('weekdays')?.value) availability.push('Weekdays');
    if (this.onboardingForm.get('weekends')?.value) availability.push('Weekends');

    if (availability.length === 0) {
      this.errorMessage = 'Please specify your availability windows.';
      return;
    }

    // Push updates natively into the application runtime session state
    this.authService.completeOnboarding({
      intent: this.onboardingForm.value.intent,
      department: this.onboardingForm.value.department,
      level: this.onboardingForm.value.level,
      canTeach: this.onboardingForm.value.canTeach,
      needsHelpWith: this.onboardingForm.value.needsHelpWith,
      availability: availability,
    });

    alert('Profile updated fully! Redirecting to matches feed.');
    this.router.navigate(['/recommended-matches']);
  }
}
