import { Component, OnInit, signal } from '@angular/core';
import {DocumentService, Document as KnowledgeDocument} from '../../services/document';
import {Router, ActivatedRoute} from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-document-view',
  imports: [CommonModule],
  standalone: true, 
  templateUrl: './document-view.html',
  styleUrl: './document-view.css',
})
export class DocumentViewComponent implements OnInit {
  doc = signal<KnowledgeDocument | null>(null);

  constructor(
    private docService: DocumentService,
    private router: Router,
    private route: ActivatedRoute
   ) {}

  ngOnInit(): void {
    // Angular Rule 12: Subscribe to paramMap so it fires reactively on every navigation change
     this.route.paramMap.subscribe(params => {
          const id = +params.get('id')!;
          this.doc.set(null); // reset signal to show loading state while fetching
          this.docService.getDocumentById(id).subscribe(data => {
            this.doc.set(data); // signal update triggers automatic template re-render
          });
        });     
  }

  goBack() {
    // Angular Rule 14: Programmatic navigation back to parent dashboard route
    this.router.navigate(['/dashboard']);
  }
}
