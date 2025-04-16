import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';

declare var createGoogleEvent: any;

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [ReactiveFormsModule], 
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent {
  appointmentForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.appointmentForm = this.fb.group({
      appointmentTime: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  scheduleMeeting() {
    
    const appointmentTime = new Date(this.appointmentForm.value.appointmentTime);
    const startTime = appointmentTime.toISOString().slice(0, 18) + '-07:00';
    const endTime = this.getEndTime(appointmentTime);

    const eventDetails = {
      email: this.appointmentForm.value.email,
      startTime,
      endTime
    };

    console.info(eventDetails);
    createGoogleEvent(eventDetails);
  }

  getEndTime(appointmentTime: Date) {
    appointmentTime.setHours(appointmentTime.getHours() + 1);
    return appointmentTime.toISOString().slice(0, 18) + '-07:00';
  }

  generateICSFile() {
    const datetimeValue = this.appointmentForm.value.appointmentTime;
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
}