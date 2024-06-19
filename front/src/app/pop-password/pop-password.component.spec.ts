import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopPasswordComponent } from './pop-password.component';

describe('PopPasswordComponent', () => {
  let component: PopPasswordComponent;
  let fixture: ComponentFixture<PopPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopPasswordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
