import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Departamento } from '../../../models/departamento.model';
import { CreateDepartamentoDto } from '../../../services/departamentos.services';

@Component({
  selector: 'app-departamento-form',
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, ButtonModule],
  templateUrl: './form.html'
})
export class Form implements OnInit, OnChanges {  // ✅ Implementar OnChanges
  private fb = inject(FormBuilder);

  @Input() departamento?: Departamento;
  @Input() loading = false;
  @Output() formSubmit = new EventEmitter<CreateDepartamentoDto>();
  @Output() formCancel = new EventEmitter<void>();

  form!: FormGroup;
  isEditMode = false;

  ngOnInit() {
    // Inicializar formulario vacío
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      jefe_id: ['']  // ✅ Cambiar según tu modelo
    });

    // Llenar si hay datos iniciales
    if (this.departamento) {
      this.loadDepartamento();
    }
  }

  // ✅ Detectar cambios en el Input
  ngOnChanges(changes: SimpleChanges) {
    if (changes['departamento'] && this.form) {
      if (this.departamento) {
        this.loadDepartamento();
      } else {
        this.form.reset();
      }
    }
  }

  private loadDepartamento() {
    this.isEditMode = true;
    console.log('📝 Cargando departamento en formulario:', this.departamento);
    
    this.form.patchValue({
      nombre: this.departamento!.nombre,
      jefe_id: this.departamento!.jefe_id || ''
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.markFormGroupTouched(this.form);
      return;
    }

    const formValue = this.form.value;
    
    if (!formValue.nombre || formValue.nombre.trim() === '') {
      return;
    }

    const data: CreateDepartamentoDto = {
      nombre: formValue.nombre.trim(),
      jefe_id: formValue.jefe_id || undefined
    };

    console.log('📤 Enviando formulario:', data);
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
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }
}
