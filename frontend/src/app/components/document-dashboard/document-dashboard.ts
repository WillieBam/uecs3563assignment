import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DocumentService, Document } from '../../services/document';
import { DocumentRowComponent } from '../document-row/document-row';

@Component({
  selector: 'app-document-dashboard',
  standalone: true,
  imports: [CommonModule, DocumentRowComponent],
  templateUrl: './document-dashboard.component.html'
})
// Angular Rule 4: Child component structural layer inside root component hierarchy [cite: 63]
export class DocumentDashboardComponent implements OnInit, OnDestroy {
  documents: Document[] = [];
  selectedDocId: string | null = null;
  currentSort = 'title';
  private sub: Subscription = new Subscription(); // Angular Rule 10: Managing RxJS Subscriptions 

  // Angular Rule 12 & 14: Passing parameter states and injecting routing contexts [cite: 68]
  constructor(
    private docService: DocumentService, 
    private router: Router, 
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadDocs();
    
    // Angular Rule 12: Passing and capturing parameters dynamically between routed components [cite: 68]
    this.sub.add(
      this.route.firstChild?.params.subscribe(params => {
        if (params['id']) this.selectedDocId = params['id'];
      })
    );
  }

  loadDocs() {
    this.sub.add(
      this.docService.getDocuments(this.currentSort).subscribe(data => this.documents = data)
    );
  }

  onDeleteTriggered(id: number) {
    this.docService.deleteDocument(id).subscribe(() => this.loadDocs());
  }

  // Angular Rule 14: Implementing programmatic navigation to routes cleanly via typescript code [cite: 68]
  navigateToForm() {
    this.router.navigate(['/manage-form'], { queryParams: { mode: 'create' } });
  }

  ngOnDestroy() {
    this.sub.unsubscribe(); // Securely clean subscriptions to eliminate memory leaks 
  }
}