import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-submissions',
  templateUrl: './submissions.component.html',
  styleUrl: './submissions.component.css',
  standalone: true,
  imports:[CommonModule]
})
export class SubmissionsComponent implements OnInit {
  submissions: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:5000/api/submissions').subscribe((data) => {
      this.submissions = data;
    });
  }
}