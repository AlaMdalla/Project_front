import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SubsService } from 'src/app/Services/subs.service';

@Component({
  selector: 'app-subs-create-component',
  templateUrl: './subs-create-component.component.html',
  styleUrls: ['./subs-create-component.component.css']
})
export class SubsCreateComponentComponent {
  newSubs = { typesub: '', subsDescription: '', subsDiscountedPrice: 0, subsActualPrice: 0 };

  constructor(private subsService: SubsService, private router: Router) { }

  addSubscription(): void {
    this.subsService.addSubscription(this.newSubs).subscribe(
      (data) => {
        this.router.navigate(['/']);
      },
      (error) => {
        console.error('Error adding subscription', error);
      }
    );
  }
  cancel(): void {
    // Navigate back to the previous page or a subscriptions list
    this.router.navigate(['/subscriptions']);
}
}
