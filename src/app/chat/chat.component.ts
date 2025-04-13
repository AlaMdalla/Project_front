import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/chat.service';
import { UsersService } from 'src/app/Services/users.service';
import { Message } from 'src/app/models/message';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ChatComponent implements OnInit {
  newMessage = '';
  username: string = 'Anonymous';
  avatar: string = 'default-avatar.png';
  profileInfo: any;

  constructor(
    public chatService: ChatService,
    private usersService: UsersService,
    private http: HttpClient
  ) {}

  async ngOnInit() {
    await this.loadUserProfile();
    this.loadSavedMessages();
    this.chatService.messagesChanged.subscribe((messages) => {
      console.log('Messages updated:', messages);
    });
  }

  async loadUserProfile() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('No token found, using anonymous mode');
        return;
      }
      this.profileInfo = await this.usersService.getYourProfile(token);
      if (this.profileInfo?.ourUsers) {
        this.username = this.profileInfo.ourUsers.username || 'Anonymous';
        this.avatar = this.profileInfo.ourUsers.avatar || 'default-avatar.png';
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
      this.username = 'Anonymous';
      this.avatar = 'default-avatar.png';
    }
  }

  loadSavedMessages() {
    this.http.get<Message[]>('http://localhost:8090/api/messages').subscribe({
      next: (messages) => {
        messages.forEach((msg) => {
          this.chatService.addMessage({
            text: msg.text,
            username: msg.username,
            avatar: msg.avatar,
            timestamp: msg.timestamp
          });
        });
      },
      error: (error) => {
        console.error('Failed to load saved messages:', error);
      }
    });
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      const message: Message = {
        text: this.newMessage,
        username: this.username,
        avatar: this.avatar
      };
      this.chatService.sendMessage(message);
      this.newMessage = '';
    }
  }
}