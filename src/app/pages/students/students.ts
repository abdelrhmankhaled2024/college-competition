import { Component, OnInit, Injector, signal, WritableSignal, computed } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { GeneralApisService } from '../../shared/services/generalApis.service';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, NgClass],
  templateUrl: './students.html',
  styleUrls: []
})
export class Students implements OnInit {
  students: WritableSignal<any[]> = signal([]);
  loading: WritableSignal<boolean> = signal(false);
  currentPage: WritableSignal<number> = signal(1);
  readonly itemsPerPage = 10;

  private toastr!: ToastrService;

  paginatedStudents = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage;
    return this.students().slice(start, start + this.itemsPerPage);
  });

  totalPages = computed(() =>
    Math.ceil(this.students().length / this.itemsPerPage)
  );

  constructor(
    private apiService: GeneralApisService,
    private injector: Injector
  ) {}

  ngOnInit(): void {
    this.toastr = this.injector.get(ToastrService);
    this.loadStudents();
  }

  loadStudents(): void {
    this.loading.set(true);
    this.apiService.getAllUsers().subscribe({
      next: (res: any) => {
        this.students.set(Array.isArray(res) ? res : Object.values(res));
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading students:', err);
        this.loading.set(false);
        this.toastr.error('Failed to load students.', 'Error', {
          timeOut: 3000,
          progressBar: true,
          positionClass: 'toast-top-right',
          closeButton: true
        });
      }
    });
  }

  getVisiblePages(): (number | string)[] {
    const total = this.totalPages();
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

  getInitials(name: string): string {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  }
}
