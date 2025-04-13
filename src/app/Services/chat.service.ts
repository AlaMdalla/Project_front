import { Injectable } from '@angular/core';
import { Message } from '../models/message';
import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  public messages: any[] = [];
  public stompClient: Stomp.Client | null = null;

  constructor() {
    this.initializeWebSocketConnection();
  }

  initializeWebSocketConnection() {
    const serverUrl = 'http://localhost:8090/chat-websocket';
    const ws = new SockJS(serverUrl);
    this.stompClient = Stomp.over(ws);
    const that = this;

    this.stompClient.connect(
      {},
      (frame: any) => {
        console.log('WebSocket connected:', frame);
        that.stompClient?.subscribe('/chat/messages', (message: Stomp.Message) => {
          if (message.body) {
            const obj = JSON.parse(message.body);
            that.addMessage(obj.text, obj.username, obj.avatar);
          }
        });
      },
      (error: any) => {
        console.error('WebSocket connection error:', error);
      }
    );
  }

  addMessage(message: string, username: string, avatar: string) {
    this.messages.push({
      text: message,
      date: new Date(),
      user: {
        name: username,
        avatar: avatar
      }
    });
  }

  sendMessage(msg: Message) {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.send('/app/sendmsg', {}, JSON.stringify(msg));
    } else {
      console.error('Cannot send message: WebSocket is not connected.');
    }
  }
}