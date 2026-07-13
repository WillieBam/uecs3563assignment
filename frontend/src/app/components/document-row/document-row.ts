import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Document } from '../../services/document';

@Component({
  selector: '[app-document-row]',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './document-row.html'

})
// Angular Rule 4: Grand-child component layer completing the hierarchical chain sequence
export class DocumentRowComponent {
  // Angular Rule 5: State binding entry passing parameters from parent container downwards
  @Input() documentData!: Document;

  // Angular Rule 5: Event emitter signaling interactive actions backwards up to child nodes
  @Output() deleteRequest = new EventEmitter<number>();

  emitDelete() {
    if (this.documentData.id) {
      this.deleteRequest.emit(this.documentData.id);
    }
  }
}