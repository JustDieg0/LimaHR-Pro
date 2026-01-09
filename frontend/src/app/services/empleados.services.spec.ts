import { TestBed } from '@angular/core/testing';

import { EmpleadosServices } from './empleados.services';

describe('EmpleadosServices', () => {
  let service: EmpleadosServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmpleadosServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
