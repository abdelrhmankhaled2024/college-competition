import { Component, OnInit, Injector, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GeneralApisService } from '../../shared/services/generalApis.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './projects.html',
  styleUrls: []
})
export class Projects implements OnInit {
  projects: WritableSignal<any[]> = signal([]);
  loading: WritableSignal<boolean> = signal(false);

  private toastr!: ToastrService;

  constructor(
    private apiService: GeneralApisService,
    private authService: AuthService,
    private injector: Injector
  ) {}

  ngOnInit(): void {
    this.toastr = this.injector.get(ToastrService);
    this.loadProjects();
  }

  loadProjects(): void {
    const userId = this.authService.currentUser?.userId;
    if (!userId) return;

    this.loading.set(true);
    this.apiService.getUserById(userId).subscribe({
      next: (res: any) => {
        // API returns user with submissions array, or we fetch by user
        const submissions = res?.submissions ?? res?.projects ?? [];
        this.projects.set(Array.isArray(submissions) ? submissions : []);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading projects:', err);
        this.loading.set(false);
        this.toastr.error('Failed to load your projects.', 'Error', {
          timeOut: 3000,
          progressBar: true,
          positionClass: 'toast-top-right',
          closeButton: true
        });
      }
    });
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '-';
    return d.toLocaleDateString('en-GB');
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'approved':  return 'badge bg-success';
      case 'rejected':  return 'badge bg-danger';
      case 'winner':    return 'badge bg-warning text-dark';
      case 'pending':   return 'badge bg-secondary';
      default:          return 'badge bg-secondary';
    }
  }
}
