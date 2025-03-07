import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamReportComponent } from './team-report.component';

describe('TeamReportComponent', () => {
  let component: TeamReportComponent;
  let fixture: ComponentFixture<TeamReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
