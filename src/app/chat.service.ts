import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { Message } from './models/message';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  public messages: Message[] = [];
  private stompClient!: Client;
  private messagesSubject = new BehaviorSubject<Message[]>(this.messages);

  // Observable for components to listen to message updates
  messagesChanged = this.messagesSubject.asObservable();

  constructor() {
    this.initializeWebSocketConnection();
  }

  initializeWebSocketConnection() {
    const serverUrl = 'http://localhost:8090/chat-websocket';
    const ws = new SockJS(serverUrl);
    this.stompClient = new Client({
      webSocketFactory: () => ws as any,
      reconnectDelay: 5000
    });

    this.stompClient.onConnect = (frame) => {
      console.log('WebSocket Connected: ' + frame);
      this.stompClient.subscribe('/chat/messages', (message) => {
        if (message.body) {
          const receivedMessage: Message = JSON.parse(message.body);
          this.addMessage(receivedMessage);
        }
      });
    };

    this.stompClient.onStompError = (frame) => {
      console.error('WebSocket Error: ', frame);
    };

    this.stompClient.activate();
  }

  addMessage(message: Message) {
    this.messages.push({
      ...message,
      timestamp: message.timestamp || new Date().toISOString() // Fallback timestamp
    });
    this.messagesSubject.next(this.messages);
  }

  sendMessage(message: Message) {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.publish({
        destination: '/app/sendmsg',
        body: JSON.stringify(message)
      });
    } else {
      console.error('WebSocket not connected');
    }
  }
}