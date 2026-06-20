import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/pages/home-landing/home-landing').then((m) => m.HomeLanding),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./features/pages/home-landing/home-landing').then((m) => m.HomeLanding),
  },
  {
    path: 'auth-entry',
    loadComponent: () => import('./auth/pages/auth-entry/auth-entry').then((m) => m.AuthEntry),
  },
  {
    path: 'onboarding',
    loadComponent: () =>
      import('./features/pages/onboarding-wizard/onboarding-wizard').then(
        (m) => m.OnboardingWizard,
      ),
  },
  {
    path: 'recommended-matches',
    loadComponent: () =>
      import('./features/pages/page-recommended-matches/page-recommended-matches').then(
        (m) => m.PageRecommendedMatches,
      ),
  },
  {
    path: 'my-sessions',
    loadComponent: () =>
      import('./features/pages/page-my-sessions/page-my-sessions').then((m) => m.PageMySessions),
  },
];
