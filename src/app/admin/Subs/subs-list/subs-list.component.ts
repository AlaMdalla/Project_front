import { ChangeDetectorRef, Component } from '@angular/core';
import { Subs } from 'src/app/models/subs.model';
import { SubsService } from 'src/app/Services/subs.service';

@Component({
  selector: 'app-subs-list',
  templateUrl: './subs-list.component.html',
  styleUrls: ['./subs-list.component.css']
})
export class SubsListComponent {
  subscriptions: Subs[] = [];
  filteredSubscriptions: Subs[] = []; // Filtered subscriptions before pagination
  displayedSubscriptions: Subs[] = []; // Subset of subscriptions to display
  currentPage: number = 1;
  pageSize: number = 5; // Number of subscriptions per page
  totalItems: number = 0;
  totalPages: number = 0;
  searchTerm: string = ''; // Bound to the filter input
  sortColumnName: any; // Current column being sorted
  sortDirection: string = 'asc'; // Current sort direction ('asc' or 'desc')

  constructor(
      private subsService: SubsService,
      private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
      this.getSubscriptions();
  }

  getSubscriptions(): void {
      this.subsService.getAllSubscriptions().subscribe(
          (data: Subs[]) => {
              this.subscriptions = data;
              this.filteredSubscriptions = [...this.subscriptions];
              this.totalItems = this.filteredSubscriptions.length;
              this.totalPages = Math.ceil(this.totalItems / this.pageSize);
              this.applyPagination();
              this.cdr.detectChanges();
          },
          (error) => {
              console.error('Error fetching subscriptions', error);
          }
      );
  }

  applyPagination(): void {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      this.displayedSubscriptions = this.filteredSubscriptions.slice(start, end);
      this.totalItems = this.filteredSubscriptions.length;
      this.totalPages = Math.ceil(this.totalItems / this.pageSize);
      if (this.displayedSubscriptions.length === 0 && this.currentPage > 1) {
          this.currentPage--;
          this.applyPagination();
      }
  }

  filterSubscriptions(): void {
      if (!this.searchTerm.trim()) {
          this.filteredSubscriptions = [...this.subscriptions];
      } else {
          const term = this.searchTerm.toLowerCase();
          this.filteredSubscriptions = this.subscriptions.filter(sub =>
              sub.typesub.toLowerCase().includes(term)
          );
      }
      this.currentPage = 1;
      if (this.sortColumnName) {
          this.sortColumn(this.sortColumnName);
      }
      this.applyPagination();
  }

  sortColumn(columnName: keyof Subs): void {
      if (this.sortColumnName === columnName) {
          this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
          this.sortColumnName = columnName;
          this.sortDirection = 'asc';
      }

      this.filteredSubscriptions.sort((a, b) => {
          const valueA = a[columnName]?.toString().toLowerCase() || '';
          const valueB = b[columnName]?.toString().toLowerCase() || '';
          if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
          if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
          return 0;
      });

      this.applyPagination();
  }

  deleteSubscription(id: number): void {
      this.subsService.deleteSubscription(id).subscribe({
          next: () => {
              this.subscriptions = this.subscriptions.filter(sub => sub.subid !== id);
              this.filteredSubscriptions = this.filteredSubscriptions.filter(sub => sub.subid !== id);
              this.applyPagination();
              this.cdr.detectChanges();
          },
          error: (error) => {
              console.error('Error deleting subscription:', error);
              this.getSubscriptions();
          }
      });
  }

  changePage(page: number): void {
      if (page >= 1 && page <= this.totalPages) {
          this.currentPage = page;
          this.applyPagination();
      }
  }
}
