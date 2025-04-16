// src/app/chat/chat.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './chat.component';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';

const routes: Routes = [
  { path: '', component: ChatComponent }
];

@NgModule({
  declarations: [ChatComponent],
  imports: [
    CommonModule,
    FormsModule,
    EmojiModule,
    RouterModule.forChild(routes)
  ]
})
export class ChatModule { }