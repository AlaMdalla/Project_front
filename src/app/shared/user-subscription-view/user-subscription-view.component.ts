import { Component, OnInit, OnDestroy } from '@angular/core';
import { SubscriptionService } from 'src/app/Services/subscription.service';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CancelReasonDialogComponent } from 'src/app/cancel-reason-dialog/cancel-reason-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-subscription-view',
  templateUrl: './user-subscription-view.component.html',
  styleUrls: ['./user-subscription-view.component.css']
})
export class UserSubscriptionViewComponent implements OnInit, OnDestroy {
  subscriptions: any[] = [];
  filteredSubscriptions: any[] = [];
  activeSubscription: any = null;
  countdown: string = 'N/A';
  private timerSubscription!: Subscription;
  statuses: string[] = ['All', 'success', 'pending', 'canceled'];
  selectedStatus: string = 'All';

  private typeHierarchy: string[] = ['1 month', '3 months', '6 months', '1 year'];

  constructor(
    private subscriptionService: SubscriptionService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog  ,
    // Inject the MatDialog service
    private snackBar: MatSnackBar  // Add MatSnackBar for notifications


  ) {}

  ngOnInit() {
    this.loadSubscriptions();
    this.timerSubscription = interval(1000).subscribe(() => {
      this.updateCountdown();
    });
  }

  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  loadSubscriptions() {
    this.subscriptionService.getSubscriptions().subscribe(
      (data: any[]) => {
        console.log('Subscriptions loaded:', data);
        this.subscriptions = data || [];
        this.applyStatusFilter();
        this.activeSubscription = this.subscriptions.find(
          sub => sub.status === 'success' && sub.endDate && sub.endDate !== 'NULL'
        );
        console.log('Active subscription:', this.activeSubscription);
        this.updateCountdown();
        this.cdr.detectChanges();
      },
      error => {
        console.error('Error loading subscriptions', error);
        alert('Failed to load subscriptions: ' + (error.error || error.message));
        this.subscriptions = [];
        this.filteredSubscriptions = [];
        this.activeSubscription = null;
        this.cdr.detectChanges();
      }
    );
  }

  applyStatusFilter() {
    if (this.selectedStatus === 'All') {
      this.filteredSubscriptions = [...this.subscriptions];
    } else {
      this.filteredSubscriptions = this.subscriptions.filter(
        sub => sub.status === this.selectedStatus
      );
    }
  }

  onStatusFilterChange() {
    this.applyStatusFilter();
    this.cdr.detectChanges();
  }

  payForSubscription(subid: number) {
    this.router.navigate(['/payment', subid]);
  }
 // Modify the cancelSubscription method
cancelSubscription(subid: number) {
  const dialogRef = this.dialog.open(CancelReasonDialogComponent, {
    width: '400px' // Adjust the dialog size as needed
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      // If the user selected a reason, cancel the subscription
      if (confirm('Are you sure you want to cancel this subscription?')) {
        this.subscriptionService.cancelSubscription(subid, result).subscribe(
          response => {
            console.log('Subscription canceled:', response);
            const subIndex = this.subscriptions.findIndex(sub => sub.subid === subid);
            if (subIndex !== -1) {
              this.subscriptions[subIndex].status = 'canceled';
            }
            this.activeSubscription = this.subscriptions.find(
              sub => sub.status === 'success' && sub.endDate && sub.endDate !== 'NULL'
            );
            this.applyStatusFilter();
            this.updateCountdown();
            this.cdr.detectChanges();
            this.loadSubscriptions();
          },
          error => {
            console.error('Error canceling subscription:', error);
            let errorMessage = 'Failed to cancel subscription.';
            if (error.status === 400) {
              errorMessage += ' ' + (error.error || 'Invalid request.');
            } else if (error.status === 500) {
              errorMessage += ' A server error occurred.';
            } else {
              errorMessage += ' ' + (error.error || error.message);
            }
            alert(errorMessage);
          }
        );
      }
    }
  });
}
  submitCancelReason(subid: number, reason: string) {
    this.subscriptionService.cancelSubscription(subid, reason).subscribe(
      response => {
        console.log('Subscription canceled:', response);
        const subIndex = this.subscriptions.findIndex(sub => sub.subid === subid);
        if (subIndex !== -1) {
          this.subscriptions[subIndex].status = 'canceled';
        }
        this.activeSubscription = this.subscriptions.find(sub => sub.status === 'success');
        this.applyStatusFilter();
        this.updateCountdown();
        this.cdr.detectChanges();
        this.loadSubscriptions();
      },
      error => {
        console.error('Error canceling subscription:', error);
      }
    );
  }

  updateCountdown() {
    if (!this.activeSubscription || !this.activeSubscription.endDate) {
      this.countdown = 'N/A';
      return;
    }

    const now = new Date();
    const end = new Date(this.activeSubscription.endDate);
    const diffMs = end.getTime() - now.getTime();

    if (diffMs <= 0) {
      this.countdown = 'Expired';
      this.activeSubscription = null;
      this.loadSubscriptions();
      return;
    }

    const diffSeconds = Math.floor(diffMs / 1000);
    const months = Math.floor(diffSeconds / (60 * 60 * 24 * 30));
    const days = Math.floor((diffSeconds % (60 * 60 * 24 * 30)) / (60 * 60 * 24));
    const hours = Math.floor((diffSeconds % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((diffSeconds % (60 * 60)) / 60);
    const seconds = diffSeconds % 60;

    let result = '';
    if (months > 0) result += `${months} month${months > 1 ? 's' : ''} `;
    if (days > 0 || months > 0) result += `${days} day${days > 1 ? 's' : ''} `;
    result += `${hours}h ${minutes}m ${seconds}s`;
    this.countdown = result.trim();
  }

  getTimeRemaining(endDate: string): string {
    if (!endDate || endDate === 'NULL') {
      return 'N/A';
    }

    const now = new Date();
    const end = new Date(endDate);
    const diffMs = end.getTime() - now.getTime();

    if (diffMs <= 0) {
      return 'Expired';
    }

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const months = Math.floor(diffDays / 30);
    const days = diffDays % 30;

    let result = '';
    if (months > 0) result += `${months} month${months > 1 ? 's' : ''} `;
    if (days > 0 || months === 0) result += `${days} day${days > 1 ? 's' : ''}`;
    return result.trim();
  }

  canPayForSubscription(sub: any): boolean {
    if (sub.status === 'success') {
      return false;
    }
    if (!this.activeSubscription) {
      return true;
    }
    const newIndex = this.typeHierarchy.indexOf(sub.typesub);
    const activeIndex = this.typeHierarchy.indexOf(this.activeSubscription.typesub);
    return newIndex > activeIndex;
  }

  isNearingExpiration(endDate: string): boolean {
    if (!endDate || endDate === 'NULL') {
      return false;
    }

    const now = new Date();
    const end = new Date(endDate);
    const diffMs = end.getTime() - now.getTime();

    if (diffMs <= 0) {
      return false;
    }

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  }

  renewSubscription(subid: number) {
    this.router.navigate(['/payment', subid]);
  }
}