import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CollaborationService } from '../../services/collaboration.service';
import { AuthService, AuthUser } from '../../services/auth.service';

@Component({
  selector: 'app-collaboration-hub',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './collaboration-hub.component.html',
  styleUrls: ['./collaboration-hub.component.css'],
})
export class CollaborationHubComponent implements OnInit, OnDestroy {
  readonly collaborationService = inject(CollaborationService);
  private authService = inject(AuthService);

  currentUser: AuthUser | null = null;
  sessionIdToJoin = '';

  ngOnInit(): void {
    // Wire up authentication/user context properly
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      console.warn('User not authenticated - collaboration features limited');
    }
  }

  ngOnDestroy(): void {}

  startSession(): void {
    if (this.currentUser) {
      // In a real app, the project state would be the actual DAW session data
      const initialProjectState = { tempo: 120, tracks: [] };
      const sessionId = this.collaborationService.startSession(
        this.currentUser,
        initialProjectState
      );
      console.log(`Started new collaboration session with ID: ${sessionId}`);
    }
  }

  joinSession(): void {
    if (this.currentUser && this.sessionIdToJoin) {
      this.collaborationService.joinSession(
        this.sessionIdToJoin,
        this.currentUser
      );
    }
  }

  leaveSession(): void {
    if (this.currentUser && this.collaborationService.currentSession()) {
      this.collaborationService.leaveSession(
        this.collaborationService.currentSession()!.sessionId,
        this.currentUser.id
      );
    } else {
      this.collaborationService.leaveSession('', '');
    }
  }

  // Helper to get a user-friendly name for the event type
  getEventIcon(type: 'start' | 'join' | 'leave' | 'update'): string {
    switch (type) {
      case 'start':
        return '🚀';
      case 'join':
        return '👋';
      case 'leave':
        return '🚪';
      case 'update':
        return '🔄';
      default:
        return '🔔';
    }
  }
}
