import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Competition } from 'src/app/models/Competition';
import { CompetionService } from 'src/app/Services/competion.service';

@Component({
  selector: 'app-competitions',
  templateUrl: './competitions.component.html',
  styleUrls: ['./competitions.component.css']
})
export class CompetitionsComponent {
  competitions: Competition[] = [];
    filteredCompetitions: Competition[] = [];
    displayedCompetitions: Competition[] = [];
    isLightMode = true;
    isLoading = true;
    isLoadingMore = false;
    searchTerm: string = '';
    pageSize: number = 3;
    currentPage: number = 1;

    @ViewChild('competitionsGrid', { static: false }) competitionsGrid!: ElementRef;

    constructor(private competionService: CompetionService) {}

    ngOnInit(): void {
        this.refresh();
    }
    refresh(): void {
      this.isLoading = true;
      this.competionService.getCompetitions().subscribe(data => {
          this.competitions = data;
          this.filteredCompetitions = data;
          this.currentPage = 1;
          this.loadMoreCompetitions();
          this.isLoading = false;
      });
  }
    onSearch(): void {
        if (!this.searchTerm.trim()) {
            this.filteredCompetitions = this.competitions;
        } else {
            this.filteredCompetitions = this.competitions.filter(competition =>
                competition.title.toLowerCase().includes(this.searchTerm.toLowerCase())
            );
        }
        this.currentPage = 1;
        this.displayedCompetitions = [];
        this.loadMoreCompetitions();
    }

    // Load more competitions based on current page
    loadMoreCompetitions(): void {
        const start = (this.currentPage - 1) * this.pageSize;
        const end = start + this.pageSize;
        const newCompetitions = this.filteredCompetitions.slice(start, end);
        
        if (newCompetitions.length > 0) {
            this.displayedCompetitions = [...this.displayedCompetitions, ...newCompetitions];
            this.currentPage++;
        }
    }

    onScroll(event: Event): void {
        if (this.isLoadingMore) return;

        const element = this.competitionsGrid.nativeElement;
        const atBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 50;

        if (atBottom && this.displayedCompetitions.length < this.filteredCompetitions.length) {
            this.isLoadingMore = true;
            setTimeout(() => {
                this.loadMoreCompetitions();
                this.isLoadingMore = false;
            }, 500);
        }
    }

    @HostListener('window:scroll', ['$event'])
    onWindowScroll(event: Event): void {
        if (this.isLoadingMore) return;

        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const atBottom = scrollTop + windowHeight >= documentHeight - 50;

        if (atBottom && this.displayedCompetitions.length < this.filteredCompetitions.length) {
            this.isLoadingMore = true;
            setTimeout(() => {
                this.loadMoreCompetitions();
                this.isLoadingMore = false;
            }, 500);
        }}
}