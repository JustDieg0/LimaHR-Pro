import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError, map } from 'rxjs';
import { Empleado, EmpleadoItem } from '../models/empleado.model';
import { ApiResponse } from '../models/api.model';
import { environment } from '../environments/environment';

export type CreateEmpleadoDto = Omit<Empleado, 'id' | 'activo' | 'fecha_ingreso'>;
export type UpdateEmpleadoDto = Partial<Omit<Empleado, 'id' | 'activo'>>;

@Injectable({
  providedIn: 'root'
})
export class EmpleadosServices {
  private apiUrl = `${environment.apiUrl}/empleados`;
  
  empleados = signal<Empleado[]>([]);
  loading = signal(false);

  constructor(private http: HttpClient) {
    console.log('🔧 Servicio inicializado. API:', this.apiUrl);
  }

  getAll(): Observable<Empleado[]> {
    this.loading.set(true);
    
    return this.http.get<ApiResponse<Empleado[]>>(this.apiUrl).pipe(
      map(response => {
        return response.data || [];
      }),
      tap({
        next: (data) => {
          this.empleados.set(data);
          this.loading.set(false);
        },
        error: (error) => {
          console.error('❌ Error:', error);
          this.empleados.set([]);
          this.loading.set(false);
        }
      }),
      catchError(error => {
        console.error('Error al cargar empleados:', error);
        return throwError(() => error);
      })
    );
  }

  create(data: CreateEmpleadoDto): Observable<Empleado> {
    return this.http.post<ApiResponse<Empleado>>(this.apiUrl, data).pipe(
      map(response => response.data),
      tap(newEmpleado => {
        this.empleados.update(empleados => [...empleados, newEmpleado]);
      })
    );
  }

  update(id: number, data: UpdateEmpleadoDto): Observable<Empleado> {
    return this.http.put<ApiResponse<Empleado>>(`${this.apiUrl}/${id}`, data).pipe(
      map(response => response.data),
      tap(updatedEmpleado => {
        this.empleados.update(empleado => 
          empleado.map(e => e.id === id ? updatedEmpleado : e)
        );
      })
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`).pipe(
      map(() => undefined),
      tap(() => {
        this.empleados.update(empleado => 
          empleado.filter(e => e.id !== id)
        );
      })
    );
  }

  getAllItem(): Observable<EmpleadoItem[]> {
    this.loading.set(true);
    
    return this.http.get<ApiResponse<EmpleadoItem[]>>(this.apiUrl+"?format=item").pipe(
      map(response => {
        return response.data || [];
      }),
      tap({
        next: (data) => {
          this.empleados.set(data);
          this.loading.set(false);
        },
        error: (error) => {
          console.error('❌ Error:', error);
          this.empleados.set([]);
          this.loading.set(false);
        }
      }),
      catchError(error => {
        console.error('Error al cargar empleados:', error);
        return throwError(() => error);
      })
    );
  }
}
