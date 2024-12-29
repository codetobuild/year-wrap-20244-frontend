import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faImage,
  faCopy,
  faArrowRight,
  faRocket,
  faSquareCheck,
  faDownload,
  faXmark,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, of } from 'rxjs';
import { ConfettiService } from '../../services/confetti.service';

@Component({
  selector: 'app-summary',
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.css',
})
export class SummaryComponent implements OnInit {
  submission: any = null;
  isLoading = true;
  error: string | null = null;
  shareUrl: string = '';
  shareCode: string = '';
  icons = {
    faImage,
    faCopy,
    faArrowRight,
    faRocket,
    faSquareCheck,
    faDownload,
    faXmark,
    faSpinner,
  };
  copied = false;
  copiedType: 'url' | 'code' | null = null;
  generateImageLoading = false;
  generateImageError: string | null = null;
  animatedTotalPoints: number = 0;
  animatedEventsCount: number = 0;
  generatedImageUrl$: BehaviorSubject<string | null> = new BehaviorSubject<
    string | null
  >(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private clipboard: Clipboard,
    private confettiService: ConfettiService
  ) {}

  ngOnInit() {
    this.shareCode = this.route.snapshot.paramMap.get('shareCode') || '';
    this.shareUrl = `${window.location.origin}/explore?view=${this.shareCode}`;

    if (this.shareCode) {
      this.loadSubmission();
    }
  }

  loadSubmission() {
    this.isLoading = true;
    this.apiService.getSubmissionByShareCode(this.shareCode).subscribe({
      next: (response) => {
        this.confettiService.triggerGrandCelebration();
        this.submission = response.data;
        this.isLoading = false;
        this.animateNumbers();
      },
      error: (error) => {
        console.error('Error loading submission:', error);
        this.error = 'Wrap details not found';
        this.isLoading = false;
      },
    });
  }

  copyToClipboard(text: string, type: 'url' | 'code') {
    this.clipboard.copy(text);
    this.copiedType = type;
    setTimeout(() => {
      this.copiedType = null;
    }, 2000);
  }

  createNewWrap() {
    this.router.navigate(['/wrap']);
  }

  generateImage() {
    this.generateImageLoading = true;
    const id = this.submission?._id;
    if (!id) {
      return;
    }
    this.apiService.generateWrapImage(id).subscribe({
      next: (response) => {
        this.generateImageLoading = false;
        if (response.data) {
          const imagePath = response.data?.imageUrl;
          this.generatedImageUrl$.next(
            `${environment.imageBaseUrl}/${imagePath}`
          );
        } else {
          this.generateImageError = 'Failed to generate image';
        }
        this.generateImageLoading = false;
      },
      error: (error) => {
        this.generateImageLoading = false;
        this.generateImageError = 'Failed to generate image';
      },
    });
  }

  async downloadImage(url: string) {
    try {
      // Fetch the image as blob
      const response = await fetch(url);
      const blob = await response.blob();

      // Create blob URL
      const blobUrl = window.URL.createObjectURL(blob);

      // Create link and trigger download
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `wrap-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download failed:', error);
      // Handle error - maybe show a toast notification
    }
  }

  removeGeneratedImage() {
    // Reset your generatedImageUrl$ observable
    this.generatedImageUrl$.next(null);
  }

  calculateTotalPoints(): number {
    if (!this.submission) return 0;

    const selectedPoints = this.submission.selectedEvents.reduce(
      (sum: number, event: any) => sum + event.eventId.points,
      0
    );

    const customPoints = this.submission.customEvents.reduce(
      (sum: number, event: any) => sum + event.points,
      0
    );

    return selectedPoints + customPoints;
  }

  animateNumbers() {
    // Animate Total Points
    const totalPoints = this.calculateTotalPoints();
    this.animateValue('totalPoints', 0, totalPoints, 2000);

    // Animate Events Count
    const eventsCount =
      this.submission.selectedEvents.length +
      this.submission.customEvents.length;
    this.animateValue('eventsCount', 0, eventsCount, 2000);
  }

  // Add this to your component
  easeOutQuad(x: number): number {
    return 1 - (1 - x) * (1 - x);
  }

  // Then modify the animateValue method:
  animateValue(
    type: 'totalPoints' | 'eventsCount',
    start: number,
    end: number,
    duration: number
  ) {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = this.easeOutQuad(progress);
      const currentValue = Math.floor(easeProgress * (end - start) + start);

      if (type === 'totalPoints') {
        this.animatedTotalPoints = currentValue;
      } else {
        this.animatedEventsCount = currentValue;
      }

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }
}
