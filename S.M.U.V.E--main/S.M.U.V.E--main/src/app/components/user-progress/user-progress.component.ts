import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GamificationService } from '../../services/gamification.service';

@Component({
  selector: 'app-user-progress',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-progress.component.html',
  styleUrls: ['./user-progress.component.css'],
})
export class UserProgressComponent implements OnInit {
  private gamificationService = inject(GamificationService);
  progress = signal<any>(null);
  isLoading = signal(true);

  ngOnInit(): void {
    this.loadProgress();
  }

  private loadProgress(): void {
    // Simulate loading user progress
    setTimeout(() => {
      this.progress.set({
        artistName: 'Artist Name',
        currentLevel: 1,
        totalPoints: 0,
      });
      this.isLoading.set(false);
    }, 500);
  }

  getProgressPercentage(current: number, max: number): number {
    return Math.round((current / max) * 100);
  }
}
