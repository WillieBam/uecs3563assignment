import { Component, OnInit, OnDestroy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { DocumentService, Document } from '../../services/document';
import { AuthService } from '../../services/auth';
import { DocumentRowComponent } from '../document-row/document-row';

@Component({
  selector: 'app-document-dashboard',
  standalone: true,
  imports: [CommonModule, DocumentRowComponent, RouterOutlet],
  templateUrl: './document-dashboard.html'
})
// Angular Rule 4: Child component structural layer inside root component hierarchy
export class DocumentDashboardComponent implements OnInit, OnDestroy {
  documents = signal<Document[]>([]);
  selectedDocId: string | null = null;
  currentSort = 'title';
  authService = inject(AuthService);
  private sub: Subscription = new Subscription();

  constructor(
    private docService: DocumentService, 
    private router: Router, 
    private route: ActivatedRoute
  ) {}

  get currentUser() {
    return this.authService.currentUser();
  }

  ngOnInit() {
    this.loadDocs();
    
    // Track selected document ID from current URL or route navigation
    const initialMatch = this.router.url.match(/\/dashboard\/(?:edit|view)\/(\d+)/);
    if (initialMatch) {
      this.selectedDocId = initialMatch[1];
    }

    this.sub.add(
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe((event) => {
        const url = (event as NavigationEnd).urlAfterRedirects || this.router.url;
        const match = url.match(/\/dashboard\/(?:edit|view)\/(\d+)/);
        if (match) {
          this.selectedDocId = match[1];
        } else {
          this.selectedDocId = null;
        }

        if (url.split('?')[0] === '/dashboard') {
          this.loadDocs();
        }
      })
    );
  }

  loadDocs() {
    this.sub.add(
      this.docService.getDocuments(this.currentSort).subscribe(data => {
        this.documents.set(data);
      })
    );
  }

  onSortChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    if (target && target.value) {
      this.currentSort = target.value;
      this.loadDocs();
    }
  }

  onDeleteTriggered(id: number) {
    this.docService.deleteDocument(id).subscribe({
      next: () => {
        if (this.selectedDocId && Number(this.selectedDocId) === id) {
          this.selectedDocId = null;
          this.router.navigate(['/dashboard']);
        }
        this.loadDocs();
      },
      error: (err) => {
        const msg = typeof err.error === 'string' ? err.error : (err.error?.message || 'Failed to delete document');
        alert(msg);
      }
    });
  }

  navigateToForm() {
    this.router.navigate(['/manage-form'], { queryParams: { mode: 'create' } });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}