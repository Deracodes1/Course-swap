import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-home-landing',
  imports: [CommonModule],
  templateUrl: './home-landing.html',
  styleUrl: './home-landing.css',
})
export class HomeLanding implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Session Guard Check: Auto-redirect active sessions to save time
    const activeUser = this.authService.currentUserSnapshot;
    if (activeUser) {
      if (activeUser.isOnboarded) {
        // this.router.navigate(['/matches']);
        console.log('Session active and onboarded: Route directly to Matches Feed.');
      } else {
        // this.router.navigate(['/onboarding']);
        console.log('Session active but incomplete: Route directly to Profile Intake.');
      }
    }
  }

  navigateTo(): void {
    this.router.navigate([`/auth-entry`]);
    alert(`Routing client-side navigation stream straight to the auth view layout.`);
  }
}
