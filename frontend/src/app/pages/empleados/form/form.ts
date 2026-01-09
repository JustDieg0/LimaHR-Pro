import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Select } from 'primeng/select';  // ✅ CORRECTO
import { Empleado } from '../../../models/empleado.model';
import { CreateEmpleadoDto } from '../../../services/empleados.services';
import { DepartamentosServices } from '../../../services/departamentos.services';

@Component({
  selector: 'app-empleado-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule, 
    InputTextModule, 
    ButtonModule,
    Select
  ],
  templateUrl: './form.html'
})
export class Form implements OnInit, OnChanges {
  private fb = inject(FormBuilder);
  private departamentosService = inject(DepartamentosServices);

  @Input() empleado?: Empleado;
  @Input() loading = false;
  @Output() formSubmit = new EventEmitter<CreateEmpleadoDto>();
  @Output() formCancel = new EventEmitter<void>();

  form!: FormGroup;
  isEditMode = false;
  departamentos = signal<any[]>([]);
  loadingDepartamentos = signal(false);

  ngOnInit() {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/)]],
      telefono: ['', [Validators.pattern(/^[0-9]{9}$/)]],
      departamento_id: [''],
      salario: ['', [Validators.min(0)]]
    });

    this.loadDepartamentos();

    if (this.empleado) {
      this.loadEmpleado();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['empleado'] && this.form) {
      if (this.empleado) {
        this.loadEmpleado();
      } else {
        this.form.reset();
      }
    }
  }

  private loadDepartamentos() {
    this.loadingDepartamentos.set(true);
    this.departamentosService.getAll().subscribe({
      next: (data) => {
        console.log('📦 Departamentos:', data);
        this.departamentos.set(Array.isArray(data) ? data : []);
        this.loadingDepartamentos.set(false);
      },
      error: (err) => {
        console.error('❌ Error:', err);
        this.departamentos.set([]);
        this.loadingDepartamentos.set(false);
      }
    });
  }

  private loadEmpleado() {
    this.isEditMode = true;
    
    this.form.get('contrasena')?.clearValidators();
    this.form.get('contrasena')?.updateValueAndValidity();
    
    this.form.patchValue({
      nombre: this.empleado!.nombre,
      email: this.empleado!.email,
      contrasena: this.empleado!.contrasena,
      telefono: this.empleado!.telefono || '',
      departamento_id: this.empleado!.departamento_id || null,
      salario: this.empleado!.salario || ''
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.markFormGroupTouched(this.form);
      return;
    }

    const formValue = this.form.value;
    
    const data: CreateEmpleadoDto = {
      nombre: formValue.nombre.trim(),
      email: formValue.email.trim().toLowerCase(),
      contrasena: formValue.contrasena,
      telefono: formValue.telefono || undefined,
      departamento_id: formValue.departamento_id || undefined,
      salario: formValue.salario ? Number(formValue.salario) : undefined
    };

    if (formValue.contrasena && formValue.contrasena.trim() !== '') {
      data.contrasena = formValue.contrasena;
    }

    this.formSubmit.emit(data);
  }

  onCancel() {
    this.formCancel.emit();
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      formGroup.get(key)?.markAsTouched();
    });
  }
}
