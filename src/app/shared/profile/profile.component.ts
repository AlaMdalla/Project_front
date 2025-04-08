import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Problem } from 'src/app/models/Problem';
import { PoblemService } from 'src/app/Services/poblem.service';
import { SubmitionService } from 'src/app/Services/submition.service';
import { UsersService } from 'src/app/Services/users.service';
import { ChartsComponent } from '../Problems/charts/charts.component';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule,ChartsComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  passedProblems: String[] = [];
  submissions: any[] = [];
  submissions_dates: any[] = [];
  heatmapWeeks: { date: string; count: number }[][] = [];
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  problemTitle!: string;
  public chart: any;
  public lineChart: any;

  public numbPassedProblems: number = 0;
  public numbdoneProblems: number = 0;

  constructor(
    private readonly userService: UsersService,
    private problemsS: PoblemService,
    private submitionService: SubmitionService,
    private readonly router: Router
  ) {}

  profileInfo: any;
  errorMessage: string = '';

  async ngOnInit() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No Token Found');
      }

      this.profileInfo = await this.userService.getYourProfile(token);
    } catch (error: any) {
      this.showError(error.message);
    }

    this.problemsS.getPassedProblems(this.profileInfo.ourUsers.id).subscribe((data) => {
      this.passedProblems = data;
    });
    this.problemsS.getdoneProblems(this.profileInfo.ourUsers.id).subscribe((data) => {
      this.numbdoneProblems = data.length;
    });
    this.submitionService.getSubmitionsByUser(this.profileInfo.ourUsers.id).subscribe((data) => {
      this.submissions = data;
      this.submissions.forEach((element) => {
        if (element.submittedAt) this.submissions_dates.push(element.submittedAt);
      });

      const counter: { [key: string]: number } = {};
      for (const submission of this.submissions_dates) {
        const date = submission.slice(0, 10); 
        counter[date] = (counter[date] || 0) + 1;
      }

      const minDate = new Date(Math.min(...this.submissions_dates.map(d => new Date(d).getTime())));
      const maxDate = new Date(Math.max(...this.submissions_dates.map(d => new Date(d).getTime())));

      const startDate = new Date(minDate);
      startDate.setDate(startDate.getDate() - startDate.getDay());

      const endDate = new Date(maxDate);
      endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

      const weeks: { date: string; count: number }[][] = [];
      let currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        const week: { date: string; count: number }[] = [];
        for (let i = 0; i < 7; i++) {
          const formatted = currentDate.toISOString().split('T')[0];
          week.push({
            date: formatted,
            count: counter[formatted] || 0
          });
          currentDate.setDate(currentDate.getDate() + 1);
        }
        weeks.push(week);
      }

      this.heatmapWeeks = weeks;

      this.numbPassedProblems = this.passedProblems.length;
      this.createChart();
    });
  }

  updateProfile(id: string) {
    this.router.navigate(['/update', id]);
  }

  getTitle(id: number): string {
    this.submitionService.getProblemTitle(id).subscribe((data) => {
      this.problemTitle = data;
    });
    return this.problemTitle;
  }

  showError(mess: string) {
    this.errorMessage = mess;
    setTimeout(() => {
      this.errorMessage = '';
    }, 3000);
  }

  transparentize(color: string, opacity: number): string {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  colorize = (opaque: boolean, hover: boolean, ctx: any): string => {
    const v = ctx.parsed;
    const c = v < 50 ? '#c6e48b' : '#fdaeb7';
    const opacity = hover ? 1 - Math.abs(v / 150) - 0.2 : 1 - Math.abs(v / 150);
    return opaque ? c : this.transparentize(c, opacity);
  };

  hoverColorize = (ctx: any): string => {
    return this.colorize(false, true, ctx);
  };

  createChart() {
    const data = {
      labels: ['Done Problems', 'Passed Problems'],
      datasets: [
        {
          data: [this.numbdoneProblems, this.numbPassedProblems],
          backgroundColor: ['#fdaeb7', '#c6e48b']
        }
      ]
    };

    const config = {
      type: 'pie' as const,
      data: data,
      options: {
        plugins: {
          legend: {
            display: true
          },
          tooltip: {
            enabled: true
          }
        },
        elements: {
          arc: {
            backgroundColor: (ctx: any) => this.colorize(false, false, ctx)
          }
        }
      }
    };

    this.chart = new Chart('MyChart', config);
  }

  getColor(value: number): string {
    if (value === 0) return '#ebedf0';
    if (value < 2) return '#d6e685';
    if (value < 4) return '#8cc665';
    if (value < 6) return '#44a340';
    return '#1e6823';
  }
}
