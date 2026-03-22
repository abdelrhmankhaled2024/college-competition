import { Component, OnInit, Injector, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.html',
  styleUrls: []
})
export class Login implements OnInit {
  loginForm!: FormGroup;
  submitted = false;

  loading: WritableSignal<boolean> = signal(false);

  private toastr!: ToastrService;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private injector: Injector
  ) {}

  ngOnInit(): void {
    this.toastr = this.injector.get(ToastrService);
    this.initializeForm();
  }

  initializeForm(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  togglePasswordVisibility(): void {
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    const toggleIcon = document.querySelector('#togglePassword i');

    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      toggleIcon?.classList.remove('fa-eye');
      toggleIcon?.classList.add('fa-eye-slash');
    } else {
      passwordInput.type = 'password';
      toggleIcon?.classList.remove('fa-eye-slash');
      toggleIcon?.classList.add('fa-eye');
    }
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.loginForm.invalid) {
      this.toastr.warning('Please fill all required fields correctly', 'Validation Error', {
        timeOut: 3000,
        progressBar: true,
        positionClass: 'toast-top-right',
        closeButton: true
      });
      return;
    }

    this.loading.set(true);

    const credentials = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    this.authService.login(credentials).subscribe({
      next: () => {
        this.toastr.success('Login successful! Welcome back.', 'Success', {
          timeOut: 3000,
          progressBar: true,
          positionClass: 'toast-top-right',
          closeButton: true
        });

        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 1500);
      },
      error: (error) => {
        console.error('Login error:', error);
        this.loading.set(false);

        if (error.status === 401) {
          this.toastr.error('Invalid email or password. Please try again.', 'Unauthorized', {
            timeOut: 4000,
            progressBar: true,
            positionClass: 'toast-top-right',
            closeButton: true
          });
        } else if (error.status === 404) {
          this.toastr.warning('Account not found. Please register first.', 'Not Found', {
            timeOut: 4000,
            progressBar: true,
            positionClass: 'toast-top-right',
            closeButton: true
          });
        } else {
          this.toastr.error('Login failed. Please try again later.', 'Error', {
            timeOut: 4000,
            progressBar: true,
            positionClass: 'toast-top-right',
            closeButton: true
          });
        }
      },
      complete: () => {
        this.loading.set(false);
      }
    });
  }
}
