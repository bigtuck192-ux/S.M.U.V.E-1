import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  loginForm!: FormGroup;
  isLoading = signal(false);
  errorMessage = signal('');
  isLoginMode = signal(true);

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      artistName: [''],
    });
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    try {
      const { email, password, artistName } = this.loginForm.value;

      if (this.isLoginMode()) {
        await this.authService.login({ email, password });
      } else {
        await this.authService.signup(email, password, artistName || email);
      }

      this.router.navigate(['/hub']);
    } catch (error: any) {
      this.errorMessage.set(error?.message || 'Authentication failed');
    } finally {
      this.isLoading.set(false);
    }
  }

  toggleMode(): void {
    this.isLoginMode.update((v) => !v);
    this.errorMessage.set('');
    this.loginForm.reset();
  }

  async loginAsGuest(): Promise<void> {
    await this.authService.loginAsGuest();
    this.router.navigate(['/hub']);
  }
}
