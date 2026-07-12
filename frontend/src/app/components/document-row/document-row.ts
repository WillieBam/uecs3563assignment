import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Document } from '../../services/document';

@Component({
  selector: '[app-document-row]',
  standalone: true,
  imports: [CommonModule],
  template: `
    <td style="padding: 10px;" [title]="documentData.title">{{ documentData.title }}</td>
    
    <td style="padding: 10px;" [ngClass]="{'approved-badge': documentData.status === 'Approved', 'draft-badge': documentData.status === 'Draft'}">
      {{ documentData.status }}
    </td>
    
    <td style="padding: 10px;">
      <button (click)="emitDelete()" style="color: white; background: #dc3545; border: none; padding: 4px 8px; cursor: pointer;">
        Remove
      </button>
    </td>
  `,
  styles: [`
    /* Angular Rule 2: Component layout visual rules mapping directly to ngClass binding rules [cite: 63] */
    .approved-badge { color: #155724; background-color: #d4edda; font-weight: bold; }
    .draft-badge { color: #856404; background-color: #fff3cd; font-weight: bold; }
  `]
})
// Angular Rule 4: Grand-child component layer completing the hierarchical chain sequence [cite: 63]
export class DocumentRowComponent {
  // Angular Rule 5: State binding entry passing parameters from parent container downwards [cite: 64]
  @Input() documentData!: Document;

  // Angular Rule 5: Event emitter signaling interactive actions backwards up to child nodes [cite: 64]
  @Output() deleteRequest = new EventEmitter<number>();

  emitDelete() {
    if (this.documentData.id) {
      this.deleteRequest.emit(this.documentData.id);
    }
  }
}