
import { Component, OnInit, Injector, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GeneralApisService } from '../../shared/services/generalApis.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-submit-competition',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './submit-competition.html',
  styleUrls: []
})
export class SubmitCompetition implements OnInit {
  projectForm!: FormGroup;
  submitted = false;
  submitting: WritableSignal<boolean> = signal(false);
  competitionLoading: WritableSignal<boolean> = signal(false);
  competition: any = null;
  competitionId!: string;

  private toastr!: ToastrService;

  constructor(
    private fb: FormBuilder,
    private apiService: GeneralApisService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private injector: Injector
  ) {}

  ngOnInit(): void {
    this.toastr = this.injector.get(ToastrService);

    if (!this.authService.isLoggedIn) {
      this.toastr.warning('You must be logged in to submit a project.', 'Access Denied', {
        timeOut: 3000,
        progressBar: true,
        positionClass: 'toast-top-right',
        closeButton: true
      });
      this.router.navigate(['/login']);
      return;
    }

    this.competitionId = this.route.snapshot.paramMap.get('id')!;
    this.initForm();
    this.loadCompetition();
  }

  initForm(): void {
    this.projectForm = this.fb.group({
      projectTitle: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      teamMembers: [1, [Validators.required, Validators.min(1), Validators.max(20)]],
      githubLink: ['', Validators.required],
      submissionDate: ['', Validators.required]
    });
  }

  get f() {
    return this.projectForm.controls;
  }

  loadCompetition(): void {
    this.competitionLoading.set(true);
    this.apiService.getCompetitionById(this.competitionId).subscribe({
      next: (res: any) => {
        this.competition = res;
        this.competitionLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading competition:', err);
        this.competitionLoading.set(false);
        this.toastr.error('Failed to load competition details.', 'Error', {
          timeOut: 3000,
          progressBar: true,
          positionClass: 'toast-top-right',
          closeButton: true
        });
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.projectForm.invalid) {
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
      submissionId: 0,
      competitionId: this.competitionId,
      userId: this.authService.currentUser?.userId,
      projectTitle: this.projectForm.value.projectTitle,
      description: this.projectForm.value.description,
      githubLink: this.projectForm.value.githubLink,
      submissionDate: this.projectForm.value.submissionDate,
      status: '',
      rank: 0
    };

    this.apiService.createProject(payload).subscribe({
      next: () => {
        this.toastr.success('Project submitted successfully!', 'Success', {
          timeOut: 3000,
          progressBar: true,
          positionClass: 'toast-top-right',
          closeButton: true
        });
        setTimeout(() => {
          this.router.navigate(['/projects']);
        }, 1500);
      },
      error: (err) => {
        console.error('Error submitting project:', err);
        this.submitting.set(false);
        this.toastr.error('Failed to submit project. Please try again.', 'Error', {
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

  formatDate(dateStr: string): string {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '-';
    return d.toLocaleDateString('en-GB');
  }
}
