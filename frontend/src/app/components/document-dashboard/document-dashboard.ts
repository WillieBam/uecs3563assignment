import { Component, OnInit, OnDestroy,signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { DocumentService, Document } from '../../services/document';
import { DocumentRowComponent } from '../document-row/document-row';

@Component({
  selector: 'app-document-dashboard',
  standalone: true,
  imports: [CommonModule, DocumentRowComponent, RouterOutlet],
  templateUrl: './document-dashboard.html'
})
// Angular Rule 4: Child component structural layer inside root component hierarchy
export class DocumentDashboardComponent implements OnInit, OnDestroy {
 documents = signal<Document[]>([]) // singnal helps to re-render the data when there's new data added, similar like React's useState
  selectedDocId: string | null = null;
  currentSort = 'title';
  private sub: Subscription = new Subscription(); // Angular Rule 10: Managing RxJS Subscriptions 

  // Angular Rule 12 & 14: Passing parameter states and injecting routing contexts
  constructor(
    private docService: DocumentService, 
    private router: Router, 
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadDocs();
    
    // Angular Rule 12: Passing and capturing parameters dynamically between routed components
    this.sub.add(
      this.route.firstChild?.params.subscribe(params => {
        if (params['id']) this.selectedDocId = params['id'];
      })
    );

    // Angular Rule 10: Re-fetch documents on NavigationEnd back to /dashboard to sync signal with latest backend state
    this.sub.add(
          this.router.events.pipe(
            filter(event => event instanceof NavigationEnd),
            filter(event => (event as NavigationEnd).urlAfterRedirects === '/dashboard')
          ).subscribe(() => {
            this.loadDocs(); // refresh signal with latest backend data
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

  onDeleteTriggered(id: number) {
    this.docService.deleteDocument(id).subscribe(() => this.loadDocs());
  }

  // Angular Rule 14: Implementing programmatic navigation to routes cleanly via typescript code
  navigateToForm() {
    this.router.navigate(['/manage-form'], { queryParams: { mode: 'create' } });
  }

  ngOnDestroy() {
    this.sub.unsubscribe(); // Securely clean subscriptions to eliminate memory leaks 
  }
}