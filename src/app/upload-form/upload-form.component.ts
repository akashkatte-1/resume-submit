import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-upload-form',
  templateUrl: './upload-form.component.html',
  imports:[FormsModule,CommonModule],
  standalone: true,
  styleUrls: ['./upload-form.component.css'],
})
export class UploadFormComponent {
  name = '';
  email = '';
  positionApplied = '';
  resume: File | null = null;
  message = '';

  constructor(private http: HttpClient) {}

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.resume = file;
    } else {
      alert('Only PDF files allowed');
    }
  }

  submitForm() {
    if (!this.name || !this.email || !this.positionApplied || !this.resume) {
      alert('All fields are required');
      return;
    }

    const formData = new FormData();
    formData.append('name', this.name);
    formData.append('email', this.email);
    formData.append('positionApplied', this.positionApplied);
    formData.append('resume', this.resume);

    this.http.post('http://localhost:5000/api/upload-resume', formData).subscribe({
      next: () => (this.message = 'Resume uploaded successfully!'),
      error: () => (this.message = 'Failed to upload'),
    });
  }
}