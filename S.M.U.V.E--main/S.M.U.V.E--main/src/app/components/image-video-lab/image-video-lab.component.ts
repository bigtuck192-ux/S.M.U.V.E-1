import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiService } from '../../services/ai.service';

interface GeneratedMedia {
  id: string;
  type: 'image' | 'video';
  prompt: string;
  url: string;
  createdAt: Date;
  status: 'generating' | 'complete' | 'error';
}

@Component({
  selector: 'app-image-video-lab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './image-video-lab.component.html',
})
export class ImageVideoLabComponent implements OnInit {
  private aiService = inject(AiService);

  mediaType = signal<'image' | 'video'>('image');
  prompt = signal('');
  generatedMedia = signal<GeneratedMedia[]>([]);
  isGenerating = signal(false);
  selectedMedia = signal<GeneratedMedia | null>(null);

  presets = [
    'Album cover art for rap',
    'Music video concept - cyberpunk',
    'Visualizer background - abstract',
    'Promotional banner - neon style',
    'Lyric video background',
  ];

  ngOnInit(): void {
    this.loadMediaHistory();
  }

  private loadMediaHistory(): void {
    // Load previously generated media
  }

  async generateMedia(): Promise<void> {
    if (!this.prompt().trim()) return;

    this.isGenerating.set(true);
    try {
      const media: GeneratedMedia = {
        id: Date.now().toString(),
        type: this.mediaType(),
        prompt: this.prompt(),
        url: `https://via.placeholder.com/800x600?text=${encodeURIComponent(this.prompt())}`,
        createdAt: new Date(),
        status: 'complete',
      };

      this.generatedMedia.update((current) => [media, ...current]);
      this.prompt.set('');
    } catch (error) {
      console.error('Error generating media:', error);
    } finally {
      this.isGenerating.set(false);
    }
  }

  selectMedia(media: GeneratedMedia): void {
    this.selectedMedia.set(media);
  }

  downloadMedia(media: GeneratedMedia): void {
    console.log('Downloading:', media.id);
  }

  useAsArtwork(media: GeneratedMedia): void {
    console.log('Using as artwork:', media.id);
  }
}
