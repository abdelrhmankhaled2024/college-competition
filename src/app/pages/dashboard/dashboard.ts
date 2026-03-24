import { Component, OnInit, Injector, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GeneralApisService } from '../../shared/services/generalApis.service';
import { AuthService, User } from '../../shared/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrls: []
})
export class Dashboard implements OnInit {
  summary: any = null;
  summaryLoading: WritableSignal<boolean> = signal(false);
  currentUser: User | null = null;

  private toastr!: ToastrService;

  constructor(
    private apiService: GeneralApisService,
    private authService: AuthService,
    private injector: Injector
  ) {}

  ngOnInit(): void {
    this.toastr = this.injector.get(ToastrService);
    this.currentUser = this.authService.currentUser;
    this.loadSummary();
  }

  loadSummary(): void {
    this.summaryLoading.set(true);
    this.apiService.getDashboardSummary().subscribe({
      next: (res: any) => {
        this.summary = res;
        this.summaryLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading dashboard:', err);
        this.summaryLoading.set(false);
        this.toastr.error('Failed to load dashboard data.', 'Error', {
          timeOut: 3000,
          progressBar: true,
          positionClass: 'toast-top-right',
          closeButton: true
        });
      }
    });
  }
}
