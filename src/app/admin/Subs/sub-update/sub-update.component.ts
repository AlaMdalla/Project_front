import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subs } from 'src/app/models/subs.model';
import { SubsService } from 'src/app/Services/subs.service';

@Component({
  selector: 'app-sub-update',
  templateUrl: './sub-update.component.html',
  styleUrls: ['./sub-update.component.css']
})
export class SubUpdateComponent {
  subscriptionId: number = 0;  // Initialize with a default value
  updatedSubs: Subs = { subid: 0, typesub: '', subsDescription: '', subsDiscountedPrice: 0, subsActualPrice: 0 };

  constructor(private subsService: SubsService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    // Get the subscription ID from the route parameters
    this.subscriptionId = Number(this.route.snapshot.paramMap.get('id'));
    this.getSubscription();
  }

  getSubscription(): void {
    this.subsService.getSubscriptionById(this.subscriptionId).subscribe(
      (data) => {
        // Ensure subid is always defined (set to 0 if undefined)
        if (data.subid === undefined) {
          data.subid = 0;  // Set to a default value (or adjust this based on your needs)
        }
        this.updatedSubs = data;
      },
      (error) => {
        console.error('Error fetching subscription', error);
      }
    );
  }
  
  cancel(): void {
    this.router.navigate(['/subscriptions']);
}
  updateSubscription(): void {
    // Update the subscription using the service
    this.subsService.updateSubscription(this.subscriptionId, this.updatedSubs).subscribe(
      (data) => {
        this.router.navigate(['/']);  // Navigate to home or another page on success
      },
      (error) => {
        console.error('Error updating subscription', error);
      }
    );
  }
}
