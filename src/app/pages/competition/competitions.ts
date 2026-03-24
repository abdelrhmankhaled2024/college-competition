import { Component, OnInit, Injector, signal, WritableSignal } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GeneralApisService } from '../../shared/services/generalApis.service';
import { AuthService } from '../../shared/services/auth.service';
@Component({
  selector: 'app-competitions',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './competitions.html',
  styleUrls: []
})
export class Competitions implements OnInit {
  competitions = signal<any[]>([]);
  loading = signal<boolean>(false);
  submitting = signal<boolean>(false);
  submitted = false;

  // Pagination
  currentPage = signal<number>(1);
  readonly itemsPerPage = 10;

  competitionForm!: FormGroup;

  private toastr!: ToastrService;

  readonly statusOptions = [
    'Upcoming', 'Ongoing', 'Active'
  ];

  constructor(
    private fb: FormBuilder,
    private apiService: GeneralApisService,
    private authService: AuthService,
    private router: Router,
    private injector: Injector
  ) {}

  ngOnInit(): void {
    this.toastr = this.injector.get(ToastrService);

    if (!this.authService.isLoggedIn) {
      this.toastr.warning('You must be logged in to access this page.', 'Access Denied', {
        timeOut: 3000,
        progressBar: true,
        positionClass: 'toast-top-right',
        closeButton: true
      });
      this.router.navigate(['/login']);
      return;
    }

    this.initForm();
    this.loadCompetitions();
  }

  initForm(): void {
    this.competitionForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      status: ['Upcoming', Validators.required]
    });
  }

  get f() {
    return this.competitionForm.controls;
  }

  loadCompetitions(): void {
    this.loading.set(true);
    this.apiService.getAllCompetitions().subscribe({
      next: (res: any) => {
        this.competitions.set(Array.isArray(res) ? res : Object.values(res));
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading competitions:', err);
        this.loading.set(false);
        this.toastr.error('Failed to load competitions.', 'Error', {
          timeOut: 3000,
          progressBar: true,
          positionClass: 'toast-top-right',
          closeButton: true
        });
      }
    });
  }

  // Pagination
  get paginatedCompetitions() {
    const start = (this.currentPage() - 1) * this.itemsPerPage;
    return this.competitions().slice(start, start + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.competitions().length / this.itemsPerPage);
  }

  getVisiblePages(): (number | string)[] {
    const total = this.totalPages;
    const current = this.currentPage();
    const pages: (number | string)[] = [];

    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);

    pages.push(1);
    if (current > 3) pages.push('...');

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    for (let i = start; i <= end; i++) pages.push(i);

    if (current < total - 2) pages.push('...');
    pages.push(total);

    return pages;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.competitionForm.invalid) {
      this.toastr.warning('Please fill all required fields correctly.', 'Validation Error', {
        timeOut: 3000,
        progressBar: true,
        positionClass: 'toast-top-right',
        closeButton: true
      });
      return;
    }

    this.submitting.set(true);

    const payload = {
      title: this.competitionForm.value.title,
      description: this.competitionForm.value.description,
      startDate: this.competitionForm.value.startDate,
      endDate: this.competitionForm.value.endDate,
      status: this.competitionForm.value.status
    };

    this.apiService.createCompetition(payload).subscribe({
      next: () => {
        this.toastr.success('Competition created successfully!', 'Success', {
          timeOut: 3000,
          progressBar: true,
          positionClass: 'toast-top-right',
          closeButton: true
        });
        this.submitted = false;
        this.competitionForm.reset({ status: 'Upcoming' });
        this.loadCompetitions();
      },
      error: (err) => {
        console.error('Error creating competition:', err);
        this.submitting.set(false);
        this.toastr.error('Failed to create competition. Please try again.', 'Error', {
          timeOut: 4000,
          progressBar: true,
          positionClass: 'toast-top-right',
          closeButton: true
        });
      },
      complete: () => {
        this.submitting.set(false);
      }
    });
  }

  clearForm(): void {
    this.submitted = false;
    this.competitionForm.reset({ status: 'Upcoming' });
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '-';
    return d.toLocaleDateString('en-GB');
  }

getStatusClass(status: string): string {
  switch (status?.toLowerCase()) {
    case 'ongoing':   return 'bg-success';
    case 'active':    return 'bg-primary';
    case 'upcoming':  return 'bg-warning text-dark';
    case 'closed':    return 'bg-secondary';
    case 'completed': return 'bg-info text-dark';
    case 'cancelled': return 'bg-danger';
    default:          return 'bg-dark';
  }
}
}
