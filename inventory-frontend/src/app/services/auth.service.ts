import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LoginRequest, RegisterRequest, AuthResponse, User } from '../models/auth.model';
import { environment } from '../../environments/environment';

interface JwtRole {
  authority?: string;
  name?: string;
}

interface LoginResponse {
  token: string;
}

interface Role {
  authority: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/api/v1/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private readonly jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) {
    this.loadUser();
  }

  private loadUser(): void {
    const token = localStorage.getItem('access_token');
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      console.log('Decoded token:', decodedToken); // Debug log
      console.log('Roles from token:', decodedToken.roles); // Additional debug log
      
      // Extract roles from the roles claim
      const roles = (decodedToken.roles || []).map((role: JwtRole | string) => {
        console.log('Processing role:', role); // Debug each role object
        if (typeof role === 'string') {
          return role.replace('ROLE_', '');
        }
        // If role is an object with authority property
        if (role.authority) {
          return role.authority.replace('ROLE_', '');
        }
        // If role is an object with name property
        if (role.name) {
          return role.name.replace('ROLE_', '');
        }
        return '';
      }).filter((role: string) => role); // Remove empty strings
      
      console.log('Processed roles:', roles); // Debug processed roles
      
      this.currentUserSubject.next({
        username: decodedToken.sub,
        roles: roles
      });
      
      console.log('Current user:', this.currentUserSubject.value); // Debug log
    }
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request)
      .pipe(
        tap(response => {
          localStorage.setItem('access_token', response.token);
          this.loadUser();
        })
      );
  }

  register(request: RegisterRequest): Observable<string> {
    return this.http.post(`${this.apiUrl}/register`, request, { responseType: 'text' });
  }

  logout(): void {
    localStorage.removeItem('access_token');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('access_token');
    return token != null && !this.jwtHelper.isTokenExpired(token);
  }

  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    console.log('Checking admin, current user:', user); // Debug log
    return user != null && user.roles.includes('ADMIN');
  }

  getRoles(): string[] {
    const token = localStorage.getItem('access_token');
    if (!token) return [];

    try {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken.roles
        .map((role: Role) => role.authority)
        .filter((role: string) => role);
    } catch (error) {
      console.error('Error decoding token:', error);
      return [];
    }
  }

  hasRole(role: string): boolean {
    const roles = this.getRoles();
    return roles.includes(role);
  }
} 