import { Problem } from "./Problem";

export interface Competition {
  id: number;    
    title: string;          
    description: string;    
    prices: string[];  
    problems: Problem[];  
    image: string; 
    dateOfComp: string;  // ⚠️ Format YYYY-MM-DD

      
  }