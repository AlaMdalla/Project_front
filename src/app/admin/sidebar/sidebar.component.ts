import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'] ,



})
export class SidebarComponent {
  currentRoute: string;
  constructor(private router: Router, private translate: TranslateService) {
    this.currentRoute = this.router.url;
  }

  switchLang(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedLang = selectElement.value;
    this.translate.use(selectedLang);
  }
}
