import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  menuOpen = false;

  // Method to toggle the menu
  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
    const navList = document.querySelector('.nav-list');
    if (navList) {
      if (this.menuOpen) {
        navList.classList.add('show');
      } else {
        navList.classList.remove('show');
      }
    }
  }
}
