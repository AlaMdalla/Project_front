import { Component } from '@angular/core';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent {
  courses = [
    {
      title: 'Introduction to JavaScript',
      description: 'Learn the fundamentals of JavaScript, one of the most popular programming languages in the world.',
      prices: ['Free', 'Premium'],
      imageUrl: 'assets/images/javascript-course.jpg'  // Path to the course image
    },
    {
      title: 'Advanced Python Programming',
      description: 'Dive deep into Python with advanced topics, frameworks, and real-world projects.',
      prices: ['Free', 'Paid'],
      imageUrl: 'assets/images/python-course.jpg'  // Path to the course image
    },
    {
      title: 'Web Development Bootcamp',
      description: 'Become a full-stack web developer by mastering HTML, CSS, JavaScript, and more.',
      prices: ['Paid'],
      imageUrl: 'assets/images/web-development-course.jpg'  // Path to the course image
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }
}
