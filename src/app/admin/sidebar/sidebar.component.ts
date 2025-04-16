import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'] , 
  

  
})
export class SidebarComponent {
  currentRoute: string;
  isSidebarOpen: boolean = true; // Sync with HeaderComponent or use a service
  isAuth: boolean = true;
  profileInfo: any = null; // Replace with actual type
  isMenuOpen: boolean = false;

  constructor(private router: Router) {
    this.currentRoute = this.router.url;
  }
  ngOnInit() {
    // Subscribe to auth state


    // Track current route for sidebar active state
   /* this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.urlAfterRedirects;
      });*/
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }





}
