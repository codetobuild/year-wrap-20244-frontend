import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { finalize } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faChevronDown,
  faChevronUp,
  faPlus,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';

import { IEvent, Category } from '../../models/api.types';
import { Router } from '@angular/router';
import { ConfettiService } from '../../services/confetti.service';

interface WrapFormData {
  temporaryUsername: string;
  selectedEvents: Array<{ eventId: string }>;
  customEvents: Array<{
    id: string;
    title: string;
    points: number;
  }>;
}

interface CustomEvent {
  id: string;
  title: string;
  points: number;
}

@Component({
  selector: 'app-wrap-form',
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './wrap-form.component.html',
  styleUrl: './wrap-form.component.css',
})
export class WrapFormComponent implements OnInit {
  events: IEvent[] = [];
  groupedEvents: { [key: string]: IEvent[] } = {};
  selectedEvents: string[] = [];
  expandedCategory: string | null = null;
  expandedCategories: { [key: string]: boolean } = {};
  isLoading = false;
  submitLoading = false;
  error: string | null = null;
  temporaryUsername: string = '';
  customEvents: CustomEvent[] = [];
  newCustomEvent: { title: string; points: number } = { title: '', points: 1 };
  // Font Awesome Icons
  faChevronDown = faChevronDown;
  faChevronUp = faChevronUp;
  faPlus = faPlus;
  faTrash = faTrash; // Import this icon
  adultSlug = 'adult-18-plus-section';

  constructor(
    private apiService: ApiService,
    private router: Router,
    private confettiService: ConfettiService
  ) {}

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    this.isLoading = true;
    this.apiService
      .getEvents({ isAdult: false })
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response) => {
          this.events = response?.data ?? [];
          this.groupEventsByCategory();
          this.initializeFirstCategory();
        },
        error: (error) => {
          this.error = 'Failed to load events';
          console.error('Error loading events:', error);
        },
      });
  }

  groupEventsByCategory() {
    this.groupedEvents = this.events.reduce((groups, event) => {
      const categoryName = event.categoryId.name;
      if (!groups[categoryName]) {
        groups[categoryName] = [];
      }
      groups[categoryName].push(event);
      return groups;
    }, {} as { [key: string]: IEvent[] });
  }

  initializeFirstCategory() {
    const firstCategory = Object.keys(this.groupedEvents)[0];
    if (firstCategory) {
      this.expandedCategory = firstCategory;
    }
  }

  toggleCategory(categoryName: string) {
    let isAdult = false;
    if (categoryName.includes('Adult') || categoryName.includes('adult')) {
      isAdult = confirm('Are you 18 years or older?');
      if (!isAdult) {
        return;
      }
    }
    this.expandedCategory =
      this.expandedCategory === categoryName ? null : categoryName;
  }

  showMoreEvents(categoryName: string) {
    this.expandedCategories[categoryName] = true;
  }

  getVisibleEvents(events: IEvent[], categoryName: string): IEvent[] {
    if (this.expandedCategories[categoryName]) {
      return events;
    }
    return events.slice(0, 5);
  }

  toggleEvent(event: IEvent, checkboxEvent: Event) {
    const checkbox = checkboxEvent.target as HTMLInputElement;
    if (checkbox.checked) {
      // Only trigger confetti when checked
      const rect = checkbox.getBoundingClientRect();
      // Trigger confetti at checkbox position
      this.confettiService.triggerQuickBurst({
        clientX: rect.left,
        clientY: rect.top,
      } as MouseEvent);
    }
    const index = this.selectedEvents.indexOf(event._id);
    if (index === -1) {
      this.selectedEvents.push(event._id);
    } else {
      this.selectedEvents.splice(index, 1);
    }
  }

  isEventSelected(eventId: string): boolean {
    return this.selectedEvents.includes(eventId);
  }

  calculateTotalPoints(): number {
    return this.events
      .filter((event) => this.selectedEvents.includes(event._id))
      .reduce((total, event) => total + event.points, 0);
  }

  resetForm() {
    this.selectedEvents = [];
  }
  // Add these methods
  addCustomEvent() {
    if (this.newCustomEvent.title && this.newCustomEvent.points) {
      this.customEvents.push({
        id: `custom-${Date.now()}`,
        title: this.newCustomEvent.title,
        points: this.newCustomEvent.points,
      });
      this.confettiService.triggerQuickBurst();
      // Reset input
      this.newCustomEvent = { title: '', points: 1 };
    }
  }

  removeCustomEvent(id: string) {
    this.customEvents = this.customEvents.filter((event) => event.id !== id);
  }

  // Modify your existing onSubmit method
  onSubmit() {
    if (!this.temporaryUsername || this.selectedEvents.length === 0) return;

    this.submitLoading = true;

    const formData: WrapFormData = {
      temporaryUsername: this.temporaryUsername,
      selectedEvents: this.selectedEvents.map((eventId) => ({ eventId })),
      customEvents: this.customEvents,
    };
    // Handle submission
    this.apiService.createSubmission(formData).subscribe({
      next: (response) => {
        // Assuming the API returns a shareCode in the response
        const shareCode = response?.data?.shareCode;
        this.router.navigate(['/wrap/summary', shareCode], {
          replaceUrl: true,
        });
        this.submitLoading = false;
      },
      error: (error) => {
        console.error('Submission failed:', error);
        this.submitLoading = false;
      },
    });
  }
}
