import { Job } from './Job';

export class Candidate {
  id?: number;
  email: string = '';
  phone: string = '';
  resumeUrl: string = '';
  applicationDate: string = '';
  status: string = ''; 
  jobId: number | null = null; 
}

