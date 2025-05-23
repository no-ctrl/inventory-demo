import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MaterialModule } from '../../../shared/material.module';
import { AuthService } from '../../../services/auth.service';
import { CommonModule, AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-header',
  template: `
    <mat-toolbar color="primary">   
      <span routerLink="/" style="cursor: pointer">Inventory App</span>
      <span class="spacer"></span>
      <ng-container *ngIf="authService.isAuthenticated()">
        <button mat-button [matMenuTriggerFor]="menu">
          <mat-icon>account_circle</mat-icon>
          {{ (authService.currentUser$ | async)?.username }}
        </button>
        <mat-menu #menu="matMenu">
          <button mat-menu-item (click)="authService.logout()">
            <mat-icon>exit_to_app</mat-icon>
            Logout
          </button>
        </mat-menu>
      </ng-container>
      <ng-container *ngIf="!authService.isAuthenticated()">
        <button mat-button routerLink="/login">Login</button>
        <button mat-button routerLink="/register">Register</button>
      </ng-container>
    </mat-toolbar>
  `,
  styles: [`
    .spacer {
      flex: 1 1 auto;
    }
    button {
      margin-left: 8px;
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    RouterLink,
    AsyncPipe
  ]
})
export class HeaderComponent {
  constructor(public authService: AuthService) {}
} 