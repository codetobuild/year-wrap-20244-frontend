import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faArrowRight,
  faChartLine,
  faShare,
  faImage,
  faPalette,
  faTrophy,
  faSearch,
  faCalendarCheck,
} from '@fortawesome/free-solid-svg-icons';
import {
  faTwitter,
  faFacebook,
  faLinkedin,
  faInstagram,
} from '@fortawesome/free-brands-svg-icons';

import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { ApiResponse, TrendingEvent } from '../../models/api.types';
import { map } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  // Font Awesome icons
  faArrowRight = faArrowRight;
  faChartLine = faChartLine;
  faShare = faShare;
  faPalette = faPalette;
  faTrophy = faTrophy;
  faSearch = faSearch;
  faCalendarCheck = faCalendarCheck;
  faTwitter = faTwitter;
  faFacebook = faFacebook;
  faInstagram = faInstagram;
  faLinkedin = faLinkedin;
  faImage = faImage;
  trendingEvents: TrendingEvent[] = [
    { title: 'Traveled solo for the first time', _id: 'faPlaneDeparture' },
    { title: 'Adopted a healthier lifestyle', _id: 'faHeartPulse' },
    { title: 'Started a new career journey', _id: 'faBriefcase' },
    { title: 'Learned a new skill', _id: 'faGraduationCap' },
    { title: 'Made lifelong friendships', _id: 'faUserGroup' },
  ];

  constructor(private router: Router, private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService
      .getTrendingEvents()
      .pipe(
        map((response: ApiResponse<TrendingEvent[]>) => response.data || []) // Access the 'data' property from the response
      )
      .subscribe({
        next: (events: TrendingEvent[]) => {
          this.trendingEvents = events; // Set the trending events
        },
        error: (err) => {
          console.error('Error fetching trending events:', err); // Log any errors
        },
      });
  }

  navigateToWrap() {
    this.router.navigate(['/wrap']);
  }

  navigateToExplore() {
    this.router.navigate(['/explore']);
  }

  shareOnSocial(url: string) {
    const width = 600;
    const height = 400;
    const left = window.innerWidth / 2 - width / 2;
    const top = window.innerHeight / 2 - height / 2;
    window.open(url + 'https://wrap2024.vercel.app', '_blank');
  }
}
