import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DocumentService } from '../../services/document';

@Component({
  selector: 'app-document-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './document-form.html'
})
export class DocumentFormComponent implements OnInit {
  docForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private docService: DocumentService,
    private router: Router
  ) {}

  ngOnInit() {
    // Angular Rule 8: Form Group initialization containing separate custom controls 
    this.docForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]], // Angular Rule 9: Setting up form error validation boundaries 
      content: ['', Validators.required],
      status: ['Draft']
    });
  }

  onSubmit() {
    // Angular Rule 9: Validation gate ensuring application data models evaluate cleanly 
    if (this.docForm.valid) {
      this.docService.saveDocument(this.docForm.value).subscribe(() => {
        // Angular Rule 14: Executing programmatic URL routing logic
        this.router.navigate(['/dashboard']);
      });
    }
  }
}