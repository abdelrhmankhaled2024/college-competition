import { Component, OnInit, Injector, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  deleting = signal<number | null>(null); // stores id being deleted
  submitted = false;

  // Edit mode
  editingId: number | null = null;

  // Delete confirm
  confirmDeleteId: number | null = null;

  // Pagination
  currentPage = signal<number>(1);
  readonly itemsPerPage = 10;

  competitionForm!: FormGroup;

  private toastr!: ToastrService;

  readonly statusOptions = [
    'Upcoming', 'Ongoing', 'Active', 'Completed', 'Closed', 'Cancelled'
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

  get isEditMode(): boolean {
    return this.editingId !== null;
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

  // ─── CREATE / UPDATE ───────────────────────────────────────────────
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

    const request$ = this.isEditMode
      ? this.apiService.updateCompetition(this.editingId!, payload)
      : this.apiService.createCompetition(payload);

    const successMsg = this.isEditMode
      ? 'Competition updated successfully!'
      : 'Competition created successfully!';

    request$.subscribe({
      next: () => {
        this.toastr.success(successMsg, 'Success', {
          timeOut: 3000,
          progressBar: true,
          positionClass: 'toast-top-right',
          closeButton: true
        });
        this.clearForm();
        this.loadCompetitions();
      },
      error: (err) => {
        console.error('Error saving competition:', err);
        this.submitting.set(false);
        this.toastr.error('Failed to save competition. Please try again.', 'Error', {
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

  // ─── EDIT ──────────────────────────────────────────────────────────
  onEdit(competition: any): void {
    this.editingId = competition.competitionId;
    this.submitted = false;
    this.confirmDeleteId = null;

    // Format dates to yyyy-MM-dd for date inputs
    const startDate = competition.startDate
      ? new Date(competition.startDate).toISOString().split('T')[0]
      : '';
    const endDate = competition.endDate
      ? new Date(competition.endDate).toISOString().split('T')[0]
      : '';

    this.competitionForm.patchValue({
      title: competition.title,
      description: competition.description || '',
      startDate,
      endDate,
      status: competition.status || 'Upcoming'
    });

    // Scroll to form
    document.getElementById('competition-form-card')?.scrollIntoView({ behavior: 'smooth' });
  }

  // ─── DELETE ────────────────────────────────────────────────────────
  onDeleteConfirm(id: number): void {
    this.confirmDeleteId = id;
  }

  onDeleteCancel(): void {
    this.confirmDeleteId = null;
  }

  onDeleteConfirmed(): void {
    if (this.confirmDeleteId === null) return;

    const id = this.confirmDeleteId;
    this.deleting.set(id);

    this.apiService.deleteCompetition(id).subscribe({
      next: () => {
        this.toastr.success('Competition deleted successfully.', 'Deleted', {
          timeOut: 3000,
          progressBar: true,
          positionClass: 'toast-top-right',
          closeButton: true
        });
        this.confirmDeleteId = null;
        this.deleting.set(null);
        // If we were editing this one, clear the form
        if (this.editingId === id) this.clearForm();
        this.loadCompetitions();
      },
      error: (err) => {
        console.error('Error deleting competition:', err);
        this.deleting.set(null);
        this.toastr.error('Failed to delete competition.', 'Error', {
          timeOut: 4000,
          progressBar: true,
          positionClass: 'toast-top-right',
          closeButton: true
        });
      }
    });
  }

  // ─── CLEAR / CANCEL EDIT ───────────────────────────────────────────
  clearForm(): void {
    this.submitted = false;
    this.editingId = null;
    this.confirmDeleteId = null;
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
