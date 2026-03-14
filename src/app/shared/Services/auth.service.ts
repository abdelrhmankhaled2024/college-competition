import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { GeneralApisService } from './generalApis.service';

export interface User {
  userId: number;
  fullName: string;
  role: string;
  collegeName: string;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _isLoggedIn$ = new BehaviorSubject<boolean>(false);
  private _currentUser$ = new BehaviorSubject<User | null>(null);

  isLoggedIn$: Observable<boolean> = this._isLoggedIn$.asObservable();
  currentUser$: Observable<User | null> = this._currentUser$.asObservable();

  constructor(private api: GeneralApisService) {
    const user = localStorage.getItem('currentUser');
    if (user) {
      this._currentUser$.next(JSON.parse(user));
      this._isLoggedIn$.next(true);
    }
  }

  login(payload: { email: string; password: string }): Observable<User> {
    return this.api.loginUser(payload).pipe(
      tap((res: User) => {
        this._currentUser$.next(res);
        this._isLoggedIn$.next(true);
        localStorage.setItem('currentUser', JSON.stringify(res));
      })
    );
  }

  logout(): void {
    this._currentUser$.next(null);
    this._isLoggedIn$.next(false);
    localStorage.removeItem('currentUser');
  }

  get currentUser(): User | null {
    return this._currentUser$.value;
  }

  get isLoggedIn(): boolean {
    return this._isLoggedIn$.value;
  }
}
