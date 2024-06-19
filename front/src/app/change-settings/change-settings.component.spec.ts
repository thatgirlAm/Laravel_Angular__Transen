import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeSettingsComponent } from './change-settings.component';

describe('ChangeSettingsComponent', () => {
  let component: ChangeSettingsComponent;
  let fixture: ComponentFixture<ChangeSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeSettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
