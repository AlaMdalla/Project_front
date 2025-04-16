import { Injectable } from '@angular/core';
import { Client, Stomp } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Message } from './models/message';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private stompClient: Client | null = null;
  private serverUrl = 'http://localhost:8560/chat/chat-websocket';
  private apiUrl = 'http://localhost:8560/chat/api/messages';
  private recipientId: string | null = null;
  private messages: Message[] = [];
  public messagesChanged = new Subject<Message[]>();
  public connectionError = new Subject<string>();
  private readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

  constructor(private http: HttpClient) {}

  initializeWebSocketConnection() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      this.connectionError.next('No user ID found. Please log in.');
      return;
    }

    const ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    this.stompClient.reconnectDelay = 5000;

    this.stompClient.onConnect = (frame: any) => {
      console.log('WebSocket connected:', frame);
      this.stompClient!.subscribe(`/user/${userId}/private`, (message) => {
        const msg: Message = JSON.parse(message.body);
        if (
          this.recipientId &&
          (msg.senderId === this.recipientId || msg.recipientId === this.recipientId)
        ) {
          this.messages.push(msg);
          this.messagesChanged.next([...this.messages]);
        }
      });
    };

    this.stompClient.onStompError = (error: any) => {
      console.error('WebSocket error:', error);
      this.connectionError.next('Failed to connect to chat server.');
    };

    this.stompClient.onWebSocketClose = () => {
      console.warn('WebSocket closed. Attempting to reconnect...');
      this.connectionError.next('Chat connection lost. Reconnecting...');
    };

    this.stompClient.activate();
  }

  setRecipient(recipientId: string) {
    this.recipientId = recipientId;
    this.messages = [];
    this.loadMessageHistory();
    this.messagesChanged.next(this.messages);
  }

  loadMessageHistory() {
    const userId = localStorage.getItem('userId');
    if (!userId || !this.recipientId) {
      this.connectionError.next('Cannot load messages: missing user or recipient ID.');
      return;
    }
    this.http
      .get<Message[]>(`${this.apiUrl}/history`, {
        params: { userId, recipientId: this.recipientId },
      })
      .subscribe({
        next: (messages) => {
          this.messages = messages.map((msg) => ({
            ...msg,
            timestamp: new Date(msg.timestamp).toISOString(),
          }));
          this.messagesChanged.next([...this.messages]);
        },
        error: (err) => {
          console.error('Error loading message history:', err);
          this.connectionError.next('Failed to load message history.');
        },
      });
  }

  sendMessage(content: string) {
    if (!this.stompClient || !this.stompClient.connected) {
      this.connectionError.next('Chat server is disconnected. Please try again later.');
      return;
    }
    if (!this.recipientId || !content.trim()) {
      this.connectionError.next('Cannot send message: missing recipient or content.');
      return;
    }
    const userId = localStorage.getItem('userId');
    if (!userId) {
      this.connectionError.next('No user ID found. Please log in.');
      return;
    }
    const message: Message = {
      senderId: userId,
      recipientId: this.recipientId,
      content: content.trim(),
      timestamp: new Date().toISOString(),
    };
    this.stompClient.publish({
      destination: '/app/private',
      body: JSON.stringify(message),
    });
    this.messages.push(message);
    this.messagesChanged.next([...this.messages]);
  }

  sendVoiceNote(file: File) {
    const userId = localStorage.getItem('userId');
    if (!userId || !this.recipientId) {
      this.connectionError.next('Cannot send voice note: missing user or recipient ID.');
      return;
    }

    // Validate file size
    if (file.size > this.MAX_FILE_SIZE) {
      this.connectionError.next('Voice note is too large. Maximum size is 5MB.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('senderId', userId);
    formData.append('recipientId', this.recipientId);

    this.http.post<Message>(`${this.apiUrl}/upload-voice-note`, formData).subscribe({
      next: (message) => {
        if (this.stompClient && this.stompClient.connected) {
          this.stompClient.publish({
            destination: '/app/private',
            body: JSON.stringify(message),
          });
          this.messages.push(message);
          this.messagesChanged.next([...this.messages]);
        }
      },
      error: (err) => {
        console.error('Error uploading voice note:', err);
        if (err.status === 413) {
          this.connectionError.next('Voice note is too large. Maximum size is 5MB.');
        } else {
          this.connectionError.next('Failed to upload voice note.');
        }
      },
    });
  
    

    this.http.post<Message>(`${this.apiUrl}/upload-voice-note`, formData).subscribe({
      next: (message) => {
        if (this.stompClient && this.stompClient.connected) {
          this.stompClient.publish({
            destination: '/app/private',
            body: JSON.stringify(message),
          });
          this.messages.push(message);
          this.messagesChanged.next([...this.messages]);
        }
      },
      error: (err) => {
        console.error('Error uploading voice note:', err);
        this.connectionError.next('Failed to upload voice note.');
      },
    });
  }

  disconnect() {
    if (this.stompClient) {
      this.stompClient.deactivate();
      this.stompClient = null;
    }
  }
}