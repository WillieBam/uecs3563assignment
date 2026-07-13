import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Document } from '../../services/document';

@Component({
  selector: '[app-document-row]',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './document-row.html',
  styleUrl: './document-row.css',
  // Angular Rule 2: ViewEncapsulation.None allows badge CSS to apply without Angular scoping,
  // needed because this component uses an attribute selector ([app-document-row]) on a <tr> element
  encapsulation: ViewEncapsulation.None
})
// Angular Rule 4: Grand-child component layer completing the hierarchical chain sequence
export class DocumentRowComponent {
  // Angular Rule 5: State binding entry passing parameters from parent container downwards
  @Input() documentData!: Document;
  // Angular Rule 5: Event emitter signaling interactive actions backwards up to child nodes
  @Output() deleteRequest = new EventEmitter<number>();

  constructor(private router: Router) {}

  emitDelete() {
    // Angular Rule 3 & 5: Event binding triggers OutputEmitter to propagate delete ID to parent
    if (this.documentData.id) {
      this.deleteRequest.emit(this.documentData.id);
    }
  }

  viewItem() {
    // Angular Rule 14: Programmatic navigation to nested child view route with path param
    this.router.navigate(['/dashboard', 'view', this.documentData.id]);
  }

  editItem() {
    // Angular Rule 14: Programmatic navigation to nested child edit route with path param
    this.router.navigate(['/dashboard', 'edit', this.documentData.id]);
  }
}