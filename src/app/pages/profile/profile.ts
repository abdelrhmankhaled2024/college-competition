import { Component, OnInit, Injector, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GeneralApisService } from '../../shared/services/generalApis.service';
import { AuthService, User } from '../../shared/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.html',
  styleUrls: []
})
export class Profile implements OnInit {
  currentUser: User | null = null;
  userDetails: any = null;
  profileLoading: WritableSignal<boolean> = signal(false);

  private toastr!: ToastrService;

  constructor(
    private apiService: GeneralApisService,
    private authService: AuthService,
    private injector: Injector
  ) {}

  ngOnInit(): void {
    this.toastr = this.injector.get(ToastrService);
    this.currentUser = this.authService.currentUser;

    if (this.currentUser?.userId) {
      this.loadUserDetails(this.currentUser.userId);
    }
  }

  loadUserDetails(id: number): void {
    this.profileLoading.set(true);
    this.apiService.getUserById(id).subscribe({
      next: (res: any) => {
        this.userDetails = res;
        this.profileLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading profile:', err);
        this.profileLoading.set(false);
        // Silently fall back to currentUser data from localStorage
      }
    });
  }
}
