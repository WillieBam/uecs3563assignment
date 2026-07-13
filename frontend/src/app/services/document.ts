import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Document {
  id?: number;
  title: string;
  content: string;
  status: string;
  view_count?: number;
}

@Injectable({ providedIn: 'root' })
export class DocumentService {
  private apiUrl = 'http://localhost:8080/api/documents';

  // Angular Rule 10: Injecting HttpClient library to send standard HTTP requests 
  constructor(private http: HttpClient) {}

  // Returns an RxJS Observable performing asynchronous network interactions via GET 
  getDocuments(sortBy: string): Observable<Document[]> {
    return this.http.get<Document[]>(`${this.apiUrl}?sortBy=${sortBy}`);
  }

  // Performs an asynchronous POST request to save data into backend 
  saveDocument(doc: Document): Observable<Document> {
    return this.http.post<Document>(this.apiUrl, doc);
  }

  // Performs an asynchronous DELETE execution 
  deleteDocument(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Fetch single document by its ID 
  getDocumentById(id: number): Observable<Document> {                                                                                                                                                                                                                     
    return this.http.get<Document>(`${this.apiUrl}/${id}`);                                                                                                                                                                                                               
  } 

  // Peform async PUT Request to update an existing document
  updateDocument(id: number, doc:Document): Observable<Document> {
    return this.http.put<Document>(`${this.apiUrl}/${id}`, doc); 
  }
}
