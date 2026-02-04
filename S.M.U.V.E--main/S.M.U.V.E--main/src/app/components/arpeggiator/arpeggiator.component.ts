import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AudioEngineService } from '../../services/audio-engine.service';

type ArpeggiatorMode = 'up' | 'down' | 'updown' | 'random';

@Component({
  selector: 'app-arpeggiator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './arpeggiator.component.html',
  styleUrls: ['./arpeggiator.component.css'],
})
export class ArpeggiatorComponent implements OnInit {
  private audioEngine = inject(AudioEngineService);

  mode = signal<ArpeggiatorMode>('up');
  octaveSpread = signal(1);
  tempo = signal(120);
  noteLength = signal(0.25);
  isEnabled = signal(false);
  currentNotes = signal<number[]>([60, 64, 67]); // C major triad

  modes: ArpeggiatorMode[] = ['up', 'down', 'updown', 'random'];

  ngOnInit(): void {
    this.audioEngine.onScheduleStep = (step) => {
      if (this.isEnabled()) {
        this.playArpeggiatedNote(step);
      }
    };
  }

  private playArpeggiatedNote(step: number): void {
    const notes = this.currentNotes();
    if (notes.length === 0) return;

    let noteIndex = 0;
    const mode = this.mode();

    if (mode === 'up') {
      noteIndex = step % notes.length;
    } else if (mode === 'down') {
      noteIndex = notes.length - 1 - (step % notes.length);
    } else if (mode === 'updown') {
      const cycle = notes.length * 2 - 2;
      const pos = step % cycle;
      noteIndex = pos < notes.length ? pos : cycle - pos;
    } else if (mode === 'random') {
      noteIndex = Math.floor(Math.random() * notes.length);
    }

    const note = notes[noteIndex];
    const frequency = this.midiToFrequency(note);
    const when = this.audioEngine.now();
    this.audioEngine.playNote(frequency, when, this.noteLength());
  }

  private midiToFrequency(midi: number): number {
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  setNotes(noteString: string): void {
    const notes = noteString.split(',').map((n) => parseInt(n.trim(), 10));
    if (notes.every((n) => !isNaN(n))) {
      this.currentNotes.set(notes);
    }
  }
}
