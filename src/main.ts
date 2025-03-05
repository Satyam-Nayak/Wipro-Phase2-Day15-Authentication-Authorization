import { bootstrapApplication } from '@angular/platform-browser';
import { Routes, provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { Component } from '@angular/core';
import { LoginComponent } from './app/components/login/login.component';
import { RegisterComponent } from './app/components/register/register.component';
import { TodoComponent } from './app/components/todo/todo.component';
import { ForgotPasswordComponent } from './app/components/forgot-password/forgot-password.component';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { authInterceptor } from './app/interceptors/auth.interceptor';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'todos', component: TodoComponent }
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatToolbarModule, MatButtonModule],
  template: `
    <mat-toolbar color="primary" class="toolbar">
  <span>Todo App</span>
  <span class="spacer"></span>
  <a mat-button routerLink="/login" class="nav-link">Login</a>
  <a mat-button routerLink="/register" class="nav-link">Register</a>
</mat-toolbar>
<router-outlet></router-outlet>
  `,
  styles: [`
    .spacer {
  flex: 1 1 auto;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-weight: bold;
}

.nav-link:hover {
  text-decoration: underline;
}

  `]
})
export class App {
  
}

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimations()
  ]
});
