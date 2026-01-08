import { TestBed } from '@angular/core/testing';

import { DepartamentosServices } from './departamentos.services';

describe('DepartamentosServices', () => {
  let service: DepartamentosServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DepartamentosServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
