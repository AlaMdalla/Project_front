import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Title } from 'chart.js';
import { Competition } from 'src/app/models/Competition';
import { CompetionService } from 'src/app/Services/competion.service';
import { UsersService } from 'src/app/Services/users.service';
declare var createGoogleEvent: any;

@Component({
  selector: 'app-competitions',
  templateUrl: './competitions.component.html',
  styleUrls: ['./competitions.component.css']
})
export class CompetitionsComponent {
  competitions: Competition[] = [];
    filteredCompetitions: Competition[] = [];
    displayedCompetitions: Competition[] = [];
    isLightMode = true;
    isLoading = true;
    isLoadingMore = false;
    searchTerm: string = '';
    pageSize: number = 3;
    currentPage: number = 1;
    profileInfo: any;
    email:any;


    @ViewChild('competitionsGrid', { static: false }) competitionsGrid!: ElementRef;

    constructor(private competionService: CompetionService,private usersService:UsersService) {}

    async ngOnInit(): Promise<void> {
        this.refresh();
        try {
            const token = localStorage.getItem('token')
            if(!token){
              throw new Error("No Token Found")
            }
        
            this.profileInfo = await this.usersService.getYourProfile(token);
            console.log(this.profileInfo)
            this.email=this.profileInfo.ourUsers.email;
           
          } catch (error:any) {
            console.log(error.message)
          }
    }
    refresh(): void {
      this.isLoading = true;
      this.competionService.getCompetitions().subscribe(data => {
          this.competitions = data;
          this.filteredCompetitions = data;
          this.currentPage = 1;
          this.loadMoreCompetitions();
          this.isLoading = false;
      });
  }
    onSearch(): void {
        if (!this.searchTerm.trim()) {
            this.filteredCompetitions = this.competitions;
        } else {
            this.filteredCompetitions = this.competitions.filter(competition =>
                competition.title.toLowerCase().includes(this.searchTerm.toLowerCase())
            );
        }
        this.currentPage = 1;
        this.displayedCompetitions = [];
        this.loadMoreCompetitions();
    }

    // Load more competitions based on current page
    loadMoreCompetitions(): void {
        const start = (this.currentPage - 1) * this.pageSize;
        const end = start + this.pageSize;
        const newCompetitions = this.filteredCompetitions.slice(start, end);
        
        if (newCompetitions.length > 0) {
            this.displayedCompetitions = [...this.displayedCompetitions, ...newCompetitions];
            this.currentPage++;
        }
    }

    onScroll(event: Event): void {
        if (this.isLoadingMore) return;

        const element = this.competitionsGrid.nativeElement;
        const atBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 50;

        if (atBottom && this.displayedCompetitions.length < this.filteredCompetitions.length) {
            this.isLoadingMore = true;
            setTimeout(() => {
                this.loadMoreCompetitions();
                this.isLoadingMore = false;
            }, 500);
        }
    }
    scheduleMeeting(competion :Competition) {
    console.log("dkhal")
        const appointmentTime = new Date(competion.dateOfComp);
        const startTime = appointmentTime.toISOString().slice(0, 18) + '-07:00';
        const endTime = this.getEndTime(appointmentTime);
    
        const eventDetails = {
          email: this.email,
          startTime,
          title:competion.title,
          description:competion.description,
          endTime
        };
    
        console.info(eventDetails);
        createGoogleEvent(eventDetails);
      }
    
      getEndTime(appointmentTime: Date) {
        appointmentTime.setHours(appointmentTime.getHours() + 1);
        return appointmentTime.toISOString().slice(0, 18) + '-07:00';
      }
    
      generateICSFile( competion :Competition) {
        const datetimeValue = competion.dateOfComp;
        const description=competion.description;
        const title=competion.title;
        const date = new Date(datetimeValue);
        const endTime = new Date(date);
        endTime.setHours(endTime.getHours() + 1);
    
        const formattedStartDate = date.toISOString().replace(/[-:]/g, '').slice(0, -5);
        const formattedEndDate = endTime.toISOString().replace(/[-:]/g, '').slice(0, -5);
    
        const icsContent = `BEGIN:VCALENDAR
    VERSION:2.0
    BEGIN:VEVENT
    DTSTAMP:${formattedStartDate}Z
    DTSTART:${formattedStartDate}Z
    DTEND:${formattedEndDate}Z
    SUMMARY:Sample Event
    DESCRIPTION:This is a sample event
    LOCATION:Sample Location
    END:VEVENT
    END:VCALENDAR`;
    
        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = 'event.ics';
        downloadLink.click();
      }

    @HostListener('window:scroll', ['$event'])
    onWindowScroll(event: Event): void {
        if (this.isLoadingMore) return;

        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const atBottom = scrollTop + windowHeight >= documentHeight - 50;

        if (atBottom && this.displayedCompetitions.length < this.filteredCompetitions.length) {
            this.isLoadingMore = true;
            setTimeout(() => {
                this.loadMoreCompetitions();
                this.isLoadingMore = false;
            }, 500);
        }}

}