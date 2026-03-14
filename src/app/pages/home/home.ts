import { GeneralApisService } from '../../shared/services/generalApis.service';
import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [RouterLink, NgClass],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  competitions = signal<any[]>([]);
  currentPage = signal<number>(1);
  readonly itemsPerPage = 9;

  constructor(
    private router: Router,
    private generalApisService: GeneralApisService
  ) {}

  ngOnInit(): void {
    this.getCompetitionDetails();
  }

  getCompetitionDetails(): void {
    this.generalApisService.getAllCompetitions().subscribe({
      next: (res: any) => {
        this.competitions.set(Array.isArray(res) ? res : Object.values(res));
        console.log('Competitions fetched:', this.competitions());
      },
      error: (err) => {
        console.error('Error fetching competitions:', err);
      }
    });
  }

  get paginatedCompetitions() {
    const start = (this.currentPage() - 1) * this.itemsPerPage;
    return this.competitions().slice(start, start + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.competitions().length / this.itemsPerPage);
  }

  get totalPagesArray() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  getVisiblePages(): (number | string)[] {
  const total = this.totalPages;
  const current = this.currentPage();
  const pages: (number | string)[] = [];

  if (total <= 4) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  pages.push(1);

  if (current > 3) pages.push('...');

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push('...');

  pages.push(total);

  return pages;
}
  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'ongoing':   return 'bg-success';
      case 'active':    return 'bg-primary';
      case 'upcoming':  return 'bg-warning text-dark';
      case 'closed':    return 'bg-secondary';
      case 'completed': return 'bg-info text-dark';
      default:          return 'bg-dark';
    }
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
