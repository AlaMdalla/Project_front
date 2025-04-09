import { Component, OnInit, OnDestroy } from '@angular/core';
import { SubscriptionService } from 'src/app/Services/subscription.service';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-user-subscription-view',
  templateUrl: './user-subscription-view.component.html',
  styleUrls: ['./user-subscription-view.component.css']
})
export class UserSubscriptionViewComponent implements OnInit, OnDestroy {
  subscriptions: any[] = [];
  activeSubscription: any = null;
  countdown: string = 'N/A';
  private timerSubscription!: Subscription;

  // Define subscription type hierarchy
  private typeHierarchy: string[] = ['1 month', '3 months', '6 months', '1 year'];

  constructor(private subscriptionService: SubscriptionService, private router: Router) {}

  ngOnInit() {
    this.loadSubscriptions();
    this.timerSubscription = interval(1000).subscribe(() => {
      this.updateCountdown();
      this.subscriptions = [...this.subscriptions];
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
        this.subscriptions = data;
        this.activeSubscription = this.subscriptions.find(
          sub => sub.status === 'success' && sub.endDate && sub.endDate !== 'NULL'
        );
        this.updateCountdown();
      },
      error => {
        console.error('Error loading subscriptions', error);
      }
    );
  }

  payForSubscription(subid: number) {
    this.router.navigate(['/payment', subid]);
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

  // Check if a subscription can be paid for (upgrade only)
  canPayForSubscription(sub: any): boolean {
    if (sub.status === 'success') {
      return false; // Already paid
    }
    if (!this.activeSubscription) {
      return true; // No active subscription, can pay
    }
    // Allow payment only if the new subscription is a higher tier
    const newIndex = this.typeHierarchy.indexOf(sub.typesub);
    const activeIndex = this.typeHierarchy.indexOf(this.activeSubscription.typesub);
    return newIndex > activeIndex;
  }
}