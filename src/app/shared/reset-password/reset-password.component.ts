import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from 'src/app/Services/users.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  email: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UsersService
  ) { }

  ngOnInit() {
    this.email = this.route.snapshot.paramMap.get('email') || '';
  }

  onSubmit() {
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.userService.resetPassword(this.email, this.newPassword, this.confirmPassword)
      .then(response => {
        if (response.statusCode === 200) {
          this.successMessage = 'Password reset successfully!';
          this.errorMessage = '';
          setTimeout(() => this.router.navigate(['/login']), 2000);
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