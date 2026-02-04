import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LibraryService } from '../../services/library.service';

interface Sample {
  id: string;
  name: string;
  category: string;
  duration: number;
  bpm: number;
  tags: string[];
}

@Component({
  selector: 'app-sample-library',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sample-library.component.html',
})
export class SampleLibraryComponent implements OnInit {
  private libraryService = inject(LibraryService);

  samples = signal<Sample[]>([]);
  selectedCategory = signal('All');
  searchTerm = signal('');
  isLoading = signal(false);
  selectedSample = signal<Sample | null>(null);

  categories = ['All', 'Drums', 'Vocals', 'Instruments', 'Effects', 'Ambient'];

  ngOnInit(): void {
    this.loadSamples();
  }

  private loadSamples(): void {
    this.isLoading.set(true);
    const allSamples: Sample[] = [
      {
        id: '1',
        name: '808 Kick - Deep',
        category: 'Drums',
        duration: 0.8,
        bpm: 120,
        tags: ['kick', 'deep', 'bass'],
      },
      {
        id: '2',
        name: 'Snare Crack',
        category: 'Drums',
        duration: 0.3,
        bpm: 120,
        tags: ['snare', 'crack', 'sharp'],
      },
      {
        id: '3',
        name: 'Vocal Chop Loop',
        category: 'Vocals',
        duration: 2.0,
        bpm: 120,
        tags: ['vocal', 'loop', 'chop'],
      },
      {
        id: '4',
        name: 'Synth String Swell',
        category: 'Instruments',
        duration: 4.0,
        bpm: 0,
        tags: ['synth', 'string', 'swell'],
      },
    ];
    this.samples.set(allSamples);
    this.isLoading.set(false);
  }

  get filteredSamples(): Sample[] {
    let filtered = this.samples();
    const cat = this.selectedCategory();
    const search = this.searchTerm().toLowerCase();

    if (cat !== 'All') {
      filtered = filtered.filter((s) => s.category === cat);
    }

    if (search) {
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(search) ||
          s.tags.some((t) => t.includes(search))
      );
    }

    return filtered;
  }

  selectSample(sample: Sample): void {
    this.selectedSample.set(sample);
  }

  playSample(sample: Sample): void {
    console.log('Playing sample:', sample.name);
    // Audio playback would be implemented here
  }
}
