import { Component } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { PoblemService } from 'src/app/Services/poblem.service';
import { SubmitionService } from 'src/app/Services/submition.service';
import { UsersService } from 'src/app/Services/users.service';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css'],
  standalone: true,
  exportAs: 'chartsComponent'
})
export class ChartsComponent {
 /* public chart: any;

  constructor(private readonly userService:UsersService,private problemsS:PoblemService, private submitionService:SubmitionService){}




  transparentize(color: string, opacity: number): string {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  colorize = (opaque: boolean, hover: boolean, ctx: any): string => {
    const v = ctx.parsed;
    const c = v < -50 ? '#c6e48b'
            : '#c6e48b';
           
        

    const opacity = hover ? 1 - Math.abs(v / 150) - 0.2 : 1 - Math.abs(v / 150);
    return opaque ? c : this.transparentize(c, opacity);
  };

  hoverColorize = (ctx: any): string => {
    return this.colorize(false, true, ctx);
  };

  createChart() {
    const data = {
      labels: ['Red', 'green'],
      datasets: [{
        data: [10, 20, 30, 40],
        backgroundColor: ['#c6e48b', '#c6e48b']
      }]
    };

    const config = {
      type: 'pie' as const,
      data: data,
      options: {
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: false
          }
        },
        elements: {
          arc: {
            backgroundColor: (ctx: any) => this.colorize(false, false, ctx),
            hoverBackgroundColor: (ctx: any) => this.hoverColorize(ctx)
          }
        }
      }
    };

    this.chart = new Chart("MyChart", config);
  }

  ngOnInit(): void {
    this.createChart();
  }*/
}
