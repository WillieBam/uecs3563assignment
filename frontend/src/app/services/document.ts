import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth';

export interface Document {
  id?: number;
  title: string;
  content: string;
  status: string;
  view_count?: number;
  tags?: string[];
  team?: string;
}

@Injectable({ providedIn: 'root' })
export class DocumentService {
  private apiUrl = '/api/documents';
  private authService = inject(AuthService);

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const user = this.authService.currentUser();
    let headers = new HttpHeaders();
    if (user && user.team) {
      headers = headers.set('X-User-Team', user.team);
    }
    return headers;
  }

  // Returns an RxJS Observable performing asynchronous network interactions via GET 
  getDocuments(sortBy: string): Observable<Document[]> {
    return this.http.get<Document[]>(`${this.apiUrl}?sortBy=${sortBy}`, { headers: this.getAuthHeaders() });
  }

  // Performs an asynchronous POST request to save data into backend 
  saveDocument(doc: Document): Observable<Document> {
    return this.http.post<Document>(this.apiUrl, doc, { headers: this.getAuthHeaders() });
  }

  // Performs an asynchronous DELETE execution 
  deleteDocument(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  // Fetch single document by its ID 
  getDocumentById(id: number): Observable<Document> {
    return this.http.get<Document>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  // Peform async PUT Request to update an existing document
  updateDocument(id: number, doc: Document): Observable<Document> {
    return this.http.put<Document>(`${this.apiUrl}/${id}`, doc, { headers: this.getAuthHeaders() });
  }
}
