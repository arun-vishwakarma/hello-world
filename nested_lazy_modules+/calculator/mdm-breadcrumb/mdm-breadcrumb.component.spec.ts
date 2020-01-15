import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MdmBreadcrumbComponent } from './mdm-breadcrumb.component';

describe('MdmBreadcrumbComponent', () => {
  let component: MdmBreadcrumbComponent;
  let fixture: ComponentFixture<MdmBreadcrumbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MdmBreadcrumbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MdmBreadcrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
