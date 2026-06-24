import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MockDbService, Session } from '../../../core/services/mock-db.service';

@Component({
  selector: 'app-booking-request',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './booking-request.html',
  styleUrls: ['./booking-request.css'],
})
export class BookingRequest implements OnInit {
  bookingForm!: FormGroup;
  tutorName = 'Aria Larkspur'; // Provided UX Copy Heading
  errorMessage = '';

  // Mock available courses for dropdown context selection
  courses = ['Calculus 101', 'Programming Fundamentals', 'Physics 202', 'Chemistry 404'];

  // UX Copy time slots
  timeSlots = ['7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM'];

  // Simplified calendar array matrix representing the layout seen in Screenshot 2026-06-24 053143.png
  calendarDays = [
    { day: 31, isCurrentMonth: false },
    { day: 1, isCurrentMonth: true },
    { day: 2, isCurrentMonth: true },
    { day: 3, isCurrentMonth: true },
    { day: 4, isCurrentMonth: true },
    { day: 5, isCurrentMonth: true },
    { day: 6, isCurrentMonth: true },
    { day: 7, isCurrentMonth: true },
    { day: 8, isCurrentMonth: true },
    { day: 9, isCurrentMonth: true },
    { day: 10, isCurrentMonth: true },
    { day: 11, isCurrentMonth: true },
    { day: 12, isCurrentMonth: true },
    { day: 13, isCurrentMonth: true },
    { day: 14, isCurrentMonth: true },
    { day: 15, isCurrentMonth: true },
    { day: 16, isCurrentMonth: true },
    { day: 17, isCurrentMonth: true },
    { day: 18, isCurrentMonth: true },
    { day: 19, isCurrentMonth: true },
    { day: 20, isCurrentMonth: true },
    { day: 21, isCurrentMonth: true },
    { day: 22, isCurrentMonth: true },
    { day: 23, isCurrentMonth: true },
    { day: 24, isCurrentMonth: true },
    { day: 25, isCurrentMonth: true },
    { day: 26, isCurrentMonth: true },
    { day: 27, isCurrentMonth: true },
    { day: 28, isCurrentMonth: true },
    { day: 29, isCurrentMonth: true },
    { day: 30, isCurrentMonth: true },
    { day: 1, isCurrentMonth: false },
    { day: 2, isCurrentMonth: false },
    { day: 3, isCurrentMonth: false },
    { day: 4, isCurrentMonth: false },
  ];

  selectedDay: number = 11; // Matches the pre-selected index value '11' inside the design file
  selectedTimeSlot: string = '';
  selectedFormat: 'Physical Meeting' | 'Virtual Meeting' = 'Physical Meeting';

  constructor(
    private fb: FormBuilder,
    private db: MockDbService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.bookingForm = this.fb.group({
      course: ['', Validators.required],
      notes: [''],
    });
  }

  selectDay(dayObj: { day: number; isCurrentMonth: boolean }): void {
    if (dayObj.isCurrentMonth) {
      this.selectedDay = dayObj.day;
      this.errorMessage = '';
    }
  }

  selectTime(slot: string): void {
    this.selectedTimeSlot = slot;
    this.errorMessage = '';
  }

  setFormat(format: 'Physical Meeting' | 'Virtual Meeting'): void {
    this.selectedFormat = format;
  }

  submitRequest(): void {
    this.bookingForm.markAllAsTouched();
    this.errorMessage = '';

    if (this.bookingForm.invalid) {
      this.errorMessage = 'Please select a specific course from the dropdown.';
      return;
    }

    if (!this.selectedDay) {
      this.errorMessage = 'Please tap to select an appointment date from the calendar.';
      return;
    }

    if (!this.selectedTimeSlot) {
      this.errorMessage = 'Please select a preferred time slot to meet.';
      return;
    }

    // Assemble dynamic structured model state mapping
    const newRequest: Session = {
      id: 'sess_' + Math.random().toString(36).substring(2, 9),
      courseCode: this.bookingForm.value.course,
      partnerName: this.tutorName,
      dateTime: `Oct ${this.selectedDay}, ${this.selectedTimeSlot}`,
      format: this.selectedFormat,
      notes: this.bookingForm.value.notes || '',
      status: 'Pending', // Explicit acceptance requirement initialization state
    };

    // Save and pipe navigation transition
    this.db.addSession(newRequest);
    this.router.navigate(['/my-sessions']);
  }
}
