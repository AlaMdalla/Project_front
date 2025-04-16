import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { ChatService } from '../chat.service';
import { UsersService } from '../Services/users.service';
import { Message } from '../models/message';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  readonly MAX_RECORDING_DURATION = 10000; // in milliseconds, e.g. 10 seconds
  showEmojiPicker = false;

  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }
  
  addEmoji(event: any) {
    this.newMessage += event.emoji.native;
  }
  availableUsers: any[] = [];
  selectedUserId: string = '';
  newMessage: string = '';
  messages: Message[] = [];
  isLoading = false;
  isMessagesLoading = false;
  error: string | null = null;
  connectionError: string | null = null;
  isRecording = false;
  mediaRecorder: MediaRecorder | null = null;
  audioChunks: Blob[] = [];

  get userId(): string | null {
    return localStorage.getItem('userId');
  }

  constructor(private usersService: UsersService, private chatService: ChatService) {}

  async ngOnInit() {
    this.isLoading = true;
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const profile = await this.usersService.getYourProfile(token);
        localStorage.setItem('userId', profile.ourUsers.id);
        await this.loadUsers(token);
        this.chatService.initializeWebSocketConnection();
      } catch (error: any) {
        console.error('Error fetching data:', error);
        this.error = 'Failed to load users. Please try again.';
      }
    } else {
      this.error = 'Please log in to access the chat.';
    }
    this.isLoading = false;

    this.chatService.messagesChanged.subscribe((msgs) => {
      this.messages = msgs;
      this.isMessagesLoading = false;
      if (!msgs.length && !this.isMessagesLoading) {
        this.error = this.error || 'No messages found.';
      } else {
        this.error = null;
      }
    });

    this.chatService.connectionError.subscribe((err) => {
      this.connectionError = err;
      setTimeout(() => (this.connectionError = null), 5000);
    });

    if (token) {
      this.usersService.usersChanged.subscribe(() => this.loadUsers(token));
    }
  }

  async loadUsers(token: string) {
    try {
      const response = await this.usersService.getAllUsers(token);
      if (response && response.statusCode === 200 && response.ourUsersList) {
        this.availableUsers = response.ourUsersList.filter(
          (user: any) => this.userId && user.id !== this.userId
        );
      } else {
        this.error = 'No users found.';
      }
    } catch (error: any) {
      console.error('Error refreshing users:', error);
      this.error = 'Failed to refresh users.';
    }
  }

  selectUser(user: any) {
    this.selectedUserId = user.id;
    this.newMessage = '';
    this.isMessagesLoading = true;
    this.error = null;
    this.connectionError = null;
    this.chatService.setRecipient(user.id);
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      this.chatService.sendMessage(this.newMessage.trim());
      this.newMessage = '';
    }
  }

  async startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        this.audioChunks.push(event.data);
      };

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        const audioFile = new File([audioBlob], `voice-note-${Date.now()}.webm`, { type: 'audio/webm' });
        this.chatService.sendVoiceNote(audioFile);
        stream.getTracks().forEach((track) => track.stop());
      };

      this.mediaRecorder.start();
      this.isRecording = true;

      // Automatically stop recording after MAX_RECORDING_DURATION
      setTimeout(() => {
        if (this.isRecording) {
          this.stopRecording();
        }
      }, this.MAX_RECORDING_DURATION);
    } catch (err) {
      console.error('Error starting recording:', err);
      this.connectionError = 'Failed to access microphone.';
    }
  }

  stopRecording() {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
      this.isRecording = false;
    }
  }

  getUsernameById(id: string): string {
    const user = this.availableUsers.find((u: any) => u.id === id);
    return user ? (user.name || user.username || 'Unknown') : 'Unknown';
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    if (this.messagesContainer) {
      const container = this.messagesContainer.nativeElement;
      container.scrollTop = container.scrollHeight;
    }
  }

  retry() {
    this.error = null;
    this.connectionError = null;
    this.isLoading = true;
    this.ngOnInit();
  }
}