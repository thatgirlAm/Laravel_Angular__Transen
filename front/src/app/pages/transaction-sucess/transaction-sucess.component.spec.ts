import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionSucessComponent } from './transaction-sucess.component';

describe('TransactionSucessComponent', () => {
  let component: TransactionSucessComponent;
  let fixture: ComponentFixture<TransactionSucessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionSucessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionSucessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
