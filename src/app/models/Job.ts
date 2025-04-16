export class Job {
  jobId!: number;
  title!: string;
  department!: string;
  location!: string;
  image!: string; // Added to store base64 string
  description!: string;
  requirements!: string;
  postedDate!: Date; // Fixed to Date type
  status!: string;

  constructor() {
    this.title = '';
    this.department = '';
    this.location = '';
    this.image = ''; // Initialize as empty string
    this.description = '';
    this.requirements = '';
    this.postedDate = new Date(); // Default to current date
    this.status = 'Open'; // Default status
  }
}