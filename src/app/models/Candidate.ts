export class Candidate {
  id: number = 0;
  email: string = '';
  phone: string = '';
  resumeUrl: string = '';
  applicationDate: string | null = ''; // Allow null
  status: string = '';
  jobId: number | null = null;
  jobTitle?: string;

  constructor() {
    this.applicationDate = new Date().toISOString().slice(0, 16);
    this.status = 'applied';
  }
}