import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import {
  faSearch,
  faTimes,
  faRocket,
  faSquareCheck,
} from '@fortawesome/free-solid-svg-icons';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ConfettiService } from '../../services/confetti.service';

@Component({
  selector: 'app-explore',
  imports: [FormsModule, ReactiveFormsModule, CommonModule, FontAwesomeModule],
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.css',
})
export class ExploreComponent implements OnInit {
  searchControl = new FormControl('');
  submission: any = null;
  isLoading = false;
  error: string | null = null;
  icons = { faSearch, faTimes, faRocket, faSquareCheck };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private confettiService: ConfettiService
  ) {}

  ngOnInit() {
    // Check for view parameter in URL
    this.route.queryParams.subscribe((params) => {
      if (params['view']) {
        this.fetchSubmission(params['view']);
      }
    });
  }

  searchWrap() {
    if (this.searchControl.value) {
      this.fetchSubmission(this.searchControl.value);
    }
  }

  fetchSubmission(code: string) {
    this.isLoading = true;
    this.error = null;

    this.apiService.getSubmissionByShareCode(code).subscribe({
      next: (response) => {
        this.submission = response.data;
        this.isLoading = false;
        this.confettiService.triggerExplosion();
      },
      error: (error) => {
        this.submission = null;
        this.error = '🥲 Couldn\'t find wrap with this code. Please try again.';
        this.isLoading = false;
        this.clearSubmission();
      },
    });
  }

  clearSubmission() {
    this.submission = null;
    this.searchControl.reset();
    // Clear URL parameter
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
    });
  }

  navigateToWrap() {
    this.router.navigate(['/wrap']);
  }

  calculateTotalPoints(): number {
    if (!this.submission) return 0;
    return 0;
    // Your existing calculation logic
  }
}
