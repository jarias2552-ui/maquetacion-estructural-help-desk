import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroIncidente } from './registro-incidente';

describe('RegistroIncidente', () => {
  let component: RegistroIncidente;
  let fixture: ComponentFixture<RegistroIncidente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroIncidente],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroIncidente);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
