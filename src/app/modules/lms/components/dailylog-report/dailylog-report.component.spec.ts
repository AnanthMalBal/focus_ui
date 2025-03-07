import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailylogReportComponent } from './dailylog-report.component';

describe('DailylogReportComponent', () => {
  let component: DailylogReportComponent;
  let fixture: ComponentFixture<DailylogReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailylogReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailylogReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
