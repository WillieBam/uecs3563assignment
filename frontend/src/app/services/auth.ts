import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface User {
  id: number;
  username: string;
  team: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = '/api/auth';
  currentUser = signal<User | null>(this.getStoredUser());

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap(user => {
        localStorage.setItem('kms_user', JSON.stringify(user));
        this.currentUser.set(user);
      })
    );
  }

  logout() {
    localStorage.removeItem('kms_user');
    this.currentUser.set(null);
  }

  private getStoredUser(): User | null {
    try {
      const data = localStorage.getItem('kms_user');
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }
}
