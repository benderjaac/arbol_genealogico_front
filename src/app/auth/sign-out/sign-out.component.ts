import { Component, inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { finalize, Subject, takeUntil, takeWhile, tap, timer } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { I18nPluralPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-sign-out',
  imports: [NgIf, I18nPluralPipe, RouterLink],
  templateUrl: './sign-out.component.html',
  styleUrl: './sign-out.component.css'
})
export class SignOutComponent {

  private _authService = inject(AuthService);
  private _router = inject(Router);

  countdown: number = 5;
  countdownMapping: any = {
      '=1'   : '# segundo',
      'other': '# segundos',
  };

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  ngOnInit(): void
  {
    this._authService.signOut();

    // Redirigir despues de countdown segundos
    timer(1000, 1000)
    .pipe(
        finalize(() =>
        {
            this._router.navigate(['sign-in']);
        }),
        takeWhile(() => this.countdown > 0),
        takeUntil(this._unsubscribeAll),
        tap(() => this.countdown--),
    )
    .subscribe();
  }

  /**
     * On destroy
     */
  ngOnDestroy(): void
  {
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next(null);
      this._unsubscribeAll.complete();
  }
}
