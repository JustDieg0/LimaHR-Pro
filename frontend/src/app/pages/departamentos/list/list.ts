import { ChangeDetectionStrategy, Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DepartamentosServices } from '../../../services/departamentos.services';
import { Departamento } from '../../../models/departamento.model';
import { Form } from '../form/form';
import { CreateDepartamentoDto, UpdateDepartamentoDto } from '../../../services/departamentos.services';
@Component({
  selector: 'app-departamentos-list',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    TableModule, 
    ButtonModule, 
    CardModule,
    DialogModule,
    InputTextModule,
    ConfirmDialogModule,
    ToastModule,
    TooltipModule,
    Form
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './list.html',
  styleUrl: './list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class List implements OnInit {
  private deptoService = inject(DepartamentosServices);
  private confirmService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private fb = inject(FormBuilder);
  

  // Signals existentes
  departamentos = this.deptoService.departamentos;
  loading = this.deptoService.loading;
  selectedDepartamentos = signal<Departamento[]>([]);

  // Nuevas propiedades para el formulario
  displayDialog = signal(false);
  isEditMode = signal(false);
  saving = signal(false);
  selectedDepartamento: Departamento | undefined = undefined;
  departamentoForm: FormGroup;

  constructor() {
    // Inicializar formulario en constructor
    this.departamentoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      jefe: ['']
    });
  }

  ngOnInit() {
    this.loadDepartamentos();
  }

  loadDepartamentos() {
    this.deptoService.getAllItem().subscribe({
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar departamentos'
        });
      }
    });
  }

  onCreate() {
    this.isEditMode.set(false);
    this.selectedDepartamento = undefined;
    this.displayDialog.set(true);
  }

  onEdit(depto: Departamento) {
    this.isEditMode.set(true);
    this.selectedDepartamento = depto;
    this.displayDialog.set(true);
  }

  handleFormSubmit(formValue: CreateDepartamentoDto) {
    this.saving.set(true);

    const request = this.isEditMode() && this.selectedDepartamento
      ? this.deptoService.update(this.selectedDepartamento.id!, formValue)
      : this.deptoService.create(formValue);

    request.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `Departamento ${this.isEditMode() ? 'actualizado' : 'creado'}`
        });
        this.closeDialog();
        this.loadDepartamentos();
        this.saving.set(false);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Operación fallida'
        });
        this.saving.set(false);
      }
    });
  }

  onDelete(departamento: Departamento) {
    this.confirmService.confirm({
      message: `¿Eliminar departamento "${departamento.nombre}"?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.deptoService.delete(departamento.id!).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Eliminado',
              detail: 'Departamento eliminado correctamente'
            });
            this.loadDepartamentos();
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo eliminar'
            });
          }
        });
      }
    });
  }

  closeDialog() {
    this.displayDialog.set(false);
    this.selectedDepartamento = undefined;
  }
}
