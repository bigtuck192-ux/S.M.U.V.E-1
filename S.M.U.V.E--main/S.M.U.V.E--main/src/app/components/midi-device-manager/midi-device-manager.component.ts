import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface MidiDevice {
  id: string;
  name: string;
  manufacturer: string;
  type: 'keyboard' | 'controller' | 'pad' | 'other';
  connected: boolean;
}

@Component({
  selector: 'app-midi-device-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './midi-device-manager.component.html',
  styleUrls: ['./midi-device-manager.component.css'],
})
export class MidiDeviceManagerComponent implements OnInit {
  midiDevices = signal<MidiDevice[]>([]);
  selectedDevice = signal<MidiDevice | null>(null);
  isScanningDevices = signal(false);

  ngOnInit(): void {
    this.scanMidiDevices();
  }

  scanMidiDevices(): void {
    this.isScanningDevices.set(true);

    // Request MIDI access
    if ((navigator as any).requestMIDIAccess) {
      (navigator as any)
        .requestMIDIAccess()
        .then((access: any) => {
          const devices: MidiDevice[] = [];

          // Collect input devices
          access.inputs.forEach((input: any) => {
            devices.push({
              id: input.id,
              name: input.name || 'Unknown Device',
              manufacturer: input.manufacturer || 'Unknown',
              type: 'keyboard',
              connected: true,
            });
          });

          this.midiDevices.set(devices);
          this.isScanningDevices.set(false);
        })
        .catch(() => {
          console.warn('MIDI Access not granted');
          this.isScanningDevices.set(false);
        });
    } else {
      console.warn('Web MIDI API not supported');
      this.isScanningDevices.set(false);
    }
  }

  selectDevice(device: MidiDevice): void {
    this.selectedDevice.set(device);
  }

  connectDevice(device: MidiDevice): void {
    console.log('Connecting to MIDI device:', device.name);
    device.connected = true;
  }

  disconnectDevice(device: MidiDevice): void {
    console.log('Disconnecting from MIDI device:', device.name);
    device.connected = false;
  }

  // Return currently discovered devices (used by template)
  availableDevices(): MidiDevice[] {
    return this.midiDevices();
  }

  // Handle selection change from the template
  onSelectionChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const id = target.value;
    const device = this.midiDevices().find((d) => d.id === id) || null;
    if (device) {
      this.selectDevice(device);
      this.connectDevice(device);
    }
  }
}
