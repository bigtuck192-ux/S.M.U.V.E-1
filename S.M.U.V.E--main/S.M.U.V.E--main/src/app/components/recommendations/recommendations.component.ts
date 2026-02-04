import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  OnInit,
} from '@angular/core';
import { AiService, StrategicRecommendation } from '../../services/ai.service';
import {
  UserContextService,
  ViewMode,
} from '../../services/user-context.service';

@Component({
  selector: 'app-recommendations',
  standalone: true,
  imports: [],
  templateUrl: './recommendations.component.html',
  styleUrls: ['./recommendations.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecommendationsComponent implements OnInit {
  private readonly aiService = inject(AiService);
  private readonly userContext = inject(UserContextService);

  recommendations = signal<StrategicRecommendation[]>([]);
  isLoading = signal(true);

  async ngOnInit() {
    this.loadRecommendations();
  }

  async loadRecommendations() {
    this.isLoading.set(true);
    const recs = await this.aiService.getStrategicRecommendations();
    this.recommendations.set(recs);
    this.isLoading.set(false);
  }

  executeRecommendation(rec: StrategicRecommendation) {
    this.userContext.setMainViewMode(rec.toolId as ViewMode);
    // Store the recommendation context for the tool to access
    if (rec.context) {
      sessionStorage.setItem(
        'recommendationContext',
        JSON.stringify(rec.context)
      );
    }
    console.log('Executing recommendation:', rec.title);
  }
}
