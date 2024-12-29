import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notfound',
  imports: [],
  templateUrl: './notfound.component.html',
  styleUrl: './notfound.component.css',
})
export class NotfoundComponent {
  constructor(private router: Router) {}

  goHome(): void {
    this.router.navigate(['/'], { replaceUrl: true });
  }
}
