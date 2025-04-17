import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/Services/users.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
  standalone:true,
  imports :[FormsModule]
})

export class ForgotPasswordComponentComponent {
  email: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private userService: UsersService,
    private router: Router
  ) { }

  onSubmit() {
    this.userService.forgotPassword(this.email)
      .then(response => {
        if (response.statusCode === 200) {
          this.successMessage = 'Reset instructions sent to your email';
          this.errorMessage = '';
          this.router.navigate(['/reset-password', this.email]);
        } else {
          this.errorMessage = response.message;
          this.successMessage = '';
        }
      })
      .catch(error => {
        this.errorMessage = error.error?.message || 'An error occurred';
        this.successMessage = '';
      });
  }
}
