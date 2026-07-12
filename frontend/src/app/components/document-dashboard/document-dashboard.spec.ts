import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentDashboard } from './document-dashboard';

describe('DocumentDashboard', () => {
  let component: DocumentDashboard;
  let fixture: ComponentFixture<DocumentDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentDashboard],
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
