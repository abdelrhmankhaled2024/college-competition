import { Component, OnInit, Injector, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GeneralApisService } from '../../shared/services/generalApis.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class Register implements OnInit {
  registerForm!: FormGroup;
  submitted = false;

  loading: WritableSignal<boolean> = signal(false);

  private toastr!: ToastrService;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: GeneralApisService,
    private router: Router,
    private injector: Injector
  ) {}

  ngOnInit(): void {
    // Initialize toastr after component construction
    this.toastr = this.injector.get(ToastrService);
    this.initializeForm();
  }

  // Initialize the reactive form
  initializeForm(): void {
    this.registerForm = this.formBuilder.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      collegeName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), this.passwordValidator]]
    });
  }

  // Custom validator for password (must contain letters and numbers)
  passwordValidator(control: any): { [key: string]: boolean } | null {
    const password = control.value;
    if (password) {
      const hasLetter = /[a-zA-Z]/.test(password);
      const hasNumber = /[0-9]/.test(password);

      if (!hasLetter || !hasNumber) {
        return { 'passwordInvalid': true };
      }
    }
    return null;
  }

  // Getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }

  // Toggle password visibility
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

  // Handle form submission with proper loading state management
  onSubmit(): void {
    this.submitted = true;

    // Stop if form is invalid
    if (this.registerForm.invalid) {
      this.toastr.warning('Please fill all required fields correctly', 'Validation Error', {
        timeOut: 3000,
        progressBar: true,
        positionClass: 'toast-top-right',
        closeButton: true
      });
      return;
    }

    // Set loading to true using signal
    this.loading.set(true);

    const userData = {
      fullName: this.registerForm.value.fullName,
      collegeName: this.registerForm.value.collegeName,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password
    };

    // Use add operator to ensure loading is set to false in all cases
    this.apiService.registerUser(userData).subscribe({
      next: (response: any) => {
        // Success - show toast and navigate
        this.toastr.success('Registration successful! Please login to continue.', 'Success', {
          timeOut: 3000,
          progressBar: true,
          positionClass: 'toast-top-right',
          closeButton: true
        });

        // Navigate to login page after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        console.error('Registration error:', error);

        // Handle specific error messages
        if (error.status === 409) {
          this.toastr.warning('Email already exists. Please use a different email.', 'Email Taken', {
            timeOut: 4000,
            progressBar: true,
            positionClass: 'toast-top-right',
            closeButton: true
          });
        } else if (error.status === 400) {
          const errorMessage = error.error?.message || 'Invalid data provided. Please check your information.';
          this.toastr.error(errorMessage, 'Bad Request', {
            timeOut: 4000,
            progressBar: true,
            positionClass: 'toast-top-right',
            closeButton: true
          });
        } else {
          this.toastr.error('Registration failed. Please try again later.', 'Error', {
            timeOut: 4000,
            progressBar: true,
            positionClass: 'toast-top-right',
            closeButton: true
          });
        }
      },
      complete: () => {
        // This runs after both next and error, ensuring loading is always set to false
        console.log('Registration request completed');
        this.loading.set(false);
      }
    });
  }
}
