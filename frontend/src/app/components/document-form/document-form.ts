import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentService, Document } from '../../services/document';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-document-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './document-form.html'
})
export class DocumentFormComponent implements OnInit {
  docForm!: FormGroup;
  editId: number | null = null;
  currentTeam: string = '';
  private authService = inject(AuthService);

  constructor(
    private fb: FormBuilder,
    private docService: DocumentService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  // Angular Rule 8: Getter exposes the tags FormArray for template iteration
  get tags(): FormArray {
    return this.docForm.get('tags') as FormArray;
  }

  get isEditMode(): boolean {
    return this.editId !== null;
  }

  ngOnInit() {
    const user = this.authService.currentUser();
    if (user && user.team) {
      this.currentTeam = user.team;
    }

    // Angular Rule 8: Root FormGroup containing a nested FormGroup and a FormArray
    this.docForm = this.fb.group({
      metadata: this.fb.group({           // Angular Rule 8: Nested FormGroup groups related title & status fields
        title:  ['', [Validators.required, Validators.minLength(5)]],  // Angular Rule 9: Built-in validators bound to FormControl
        status: ['Draft']
      }),
      content: ['', Validators.required],
      tags: this.fb.array([               // Angular Rule 8: FormArray holds dynamic list of tag FormControls
        this.fb.control('')
      ])
    });

    // Angular Rule 12: Read query parameter ?mode=create to determine form operation mode
    this.route.queryParamMap.subscribe(qParams => {
      const mode = qParams.get('mode');   // extracts value from URL query string via queryParamMap
      if (mode === 'create') {
        this.editId = null;
      }
    });

    // Angular Rule 12: Capture :id path parameter from parent route for edit mode population
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.editId = +params['id'];
        this.docService.getDocumentById(this.editId).subscribe({
          next: (doc) => {
            this.docForm.patchValue({
              metadata: { title: doc.title, status: doc.status },
              content:  doc.content
            });
            this.tags.clear();
            if (doc.tags && doc.tags.length > 0) {
              doc.tags.forEach(tag => this.tags.push(this.fb.control(tag)));
            } else {
              this.tags.push(this.fb.control(''));
            }
          },
          error: (err) => {
            alert(err.error || 'Access denied or document not found');
            this.router.navigate(['/dashboard']);
          }
        });
      }
    });
  }

  addTag() {
    // Angular Rule 8: push() dynamically extends the FormArray with a new empty FormControl
    this.tags.push(this.fb.control(''));
  }

  removeTag(index: number) {
    // Angular Rule 8: removeAt() removes the FormControl at the specified index from FormArray
    this.tags.removeAt(index);
  }

  onCancel() {
    this.router.navigate(['/dashboard']);
  }

  private getErrorMessage(err: any): string {
    if (typeof err.error === 'string') return err.error;
    if (err.error && typeof err.error === 'object' && err.error.message) return err.error.message;
    return err.message || 'An unexpected error occurred';
  }

  onSubmit() {
    // Angular Rule 9: Validation gate — only proceeds when entire FormGroup tree is valid
    if (this.docForm.valid) {
      const formVal = this.docForm.value;
      const doc: Document = {
        title:   formVal.metadata.title,
        content: formVal.content,
        status:  formVal.metadata.status,
        tags: (formVal.tags || []).filter((t: string) => t && t.trim().length > 0),
        team: this.currentTeam
      };
      if (this.isEditMode) {
        // Angular Rule 14: Programmatic navigation back to dashboard after successful PUT update
        this.docService.updateDocument(this.editId!, doc).subscribe({
          next: () => this.router.navigate(['/dashboard']),
          error: (err) => {
            alert(this.getErrorMessage(err));
            if (err.status === 404) {
              this.router.navigate(['/dashboard']);
            }
          }
        });
      } else {
        // Angular Rule 14: Programmatic navigation back to dashboard after successful POST create
        this.docService.saveDocument(doc).subscribe({
          next: () => this.router.navigate(['/dashboard']),
          error: (err) => alert(this.getErrorMessage(err))
        });
      }
    }
  }
}
