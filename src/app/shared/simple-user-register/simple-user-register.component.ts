import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/Services/users.service';

@Component({
  selector: 'app-simple-user-register',
  templateUrl: './simple-user-register.component.html',
  styleUrls: ['./simple-user-register.component.css']
})
export class SimpleUserRegisterComponent {
  formData: any = {
    name: '',
    email: '',
    password: '',
    role: 'USER', 
    city: ''
  };
  errorMessage: string = '';
  
  constructor(
    private readonly userService: UsersService,
    private readonly router: Router
  ) { }

  async handleSubmit() {
    // Basic field check
    if (!this.formData.name || !this.formData.email || !this.formData.password || !this.formData.city) {
      this.showError('Please fill in all fields.');
      return;
    }

    // Advanced validation matching template rules
    if (this.formData.name.length < 4) {
      this.showError('Name must be at least 4 characters');
      return;
    }

    if (this.formData.city.length > 12) {
      this.showError('City must be maximum 12 characters');
      return;
    }

    if (!new RegExp('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$').test(this.formData.email)) {
      this.showError('Invalid email format');
      return;
    }

    if (this.formData.password.length < 6) {
      this.showError('Password must be at least 6 characters');
      return;
    }

    const confirmRegistration = confirm('Are you sure you want to register?');
    if (!confirmRegistration) return;
  
    try {
      const response = await this.userService.register(this.formData);
      if (response.statusCode === 200) {
        this.router.navigate(['/login']);
      } else {
        this.showError(response.message);
      }
    } catch (error: any) {
      this.showError(error.message);
    }
  }

  showError(message: string) {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = '';
    }, 3000);
  }
}