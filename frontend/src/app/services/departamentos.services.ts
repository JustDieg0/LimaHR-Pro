import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError, map } from 'rxjs';
import { Departamento, DepartamentoItem } from '../models/departamento.model';
import { ApiResponse } from '../models/api.model';
import { environment } from '../environments/environment';

export type CreateDepartamentoDto = Omit<Departamento, 'id' | 'created_at'>;
export type UpdateDepartamentoDto = Partial<Omit<Departamento, 'id' | 'created_at'>>;

@Injectable({
  providedIn: 'root'
})
export class DepartamentosServices {
  private apiUrl = `${environment.apiUrl}/departamentos`;
  
  departamentos = signal<Departamento[]>([]);
  loading = signal(false);

  constructor(private http: HttpClient) {
    console.log('🔧 Servicio inicializado. API:', this.apiUrl);
  }

  getAll(): Observable<Departamento[]> {
    this.loading.set(true);
    
    return this.http.get<ApiResponse<Departamento[]>>(this.apiUrl).pipe(
      map(response => {
        return response.data || [];
      }),
      tap({
        next: (data) => {
          this.departamentos.set(data);
          this.loading.set(false);
        },
        error: (error) => {
          console.error('❌ Error:', error);
          this.departamentos.set([]);
          this.loading.set(false);
        }
      }),
      catchError(error => {
        console.error('Error al cargar departamentos:', error);
        return throwError(() => error);
      })
    );
  }

  create(data: CreateDepartamentoDto): Observable<Departamento> {
    return this.http.post<ApiResponse<Departamento>>(this.apiUrl, data).pipe(
      map(response => response.data),
      tap(newDepto => {
        this.departamentos.update(deptos => [...deptos, newDepto]);
      })
    );
  }

  update(id: number, data: UpdateDepartamentoDto): Observable<Departamento> {
    return this.http.put<ApiResponse<Departamento>>(`${this.apiUrl}/${id}`, data).pipe(
      map(response => response.data),
      tap(updatedDepto => {
        this.departamentos.update(deptos => 
          deptos.map(d => d.id === id ? updatedDepto : d)
        );
      })
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`).pipe(
      map(() => undefined),
      tap(() => {
        this.departamentos.update(deptos => 
          deptos.filter(d => d.id !== id)
        );
      })
    );
  }

  getAllItem(): Observable<DepartamentoItem[]> {
    this.loading.set(true);
    
    return this.http.get<ApiResponse<DepartamentoItem[]>>(this.apiUrl+"?format=item").pipe(
      map(response => {
        return response.data || [];
      }),
      tap({
        next: (data) => {
          this.departamentos.set(data);
          this.loading.set(false);
        },
        error: (error) => {
          console.error('❌ Error:', error);
          this.departamentos.set([]);
          this.loading.set(false);
        }
      }),
      catchError(error => {
        console.error('Error al cargar departamentos:', error);
        return throwError(() => error);
      })
    );
  }
}
