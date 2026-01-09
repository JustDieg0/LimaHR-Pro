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
import { EmpleadosServices } from '../../../services/empleados.services';
import { Empleado } from '../../../models/empleado.model';
import { Form } from '../form/form';
import { CreateEmpleadoDto, UpdateEmpleadoDto } from '../../../services/empleados.services';
@Component({
  selector: 'app-empleado-list',
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
  private deptoService = inject(EmpleadosServices);
  private confirmService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private fb = inject(FormBuilder);
  

  // Signals existentes
  empleados = this.deptoService.empleados;
  loading = this.deptoService.loading;
  selectedEmpleados = signal<Empleado[]>([]);

  // Nuevas propiedades para el formulario
  displayDialog = signal(false);
  isEditMode = signal(false);
  saving = signal(false);
  selectedEmpleado: Empleado | undefined = undefined;
  empleadoForm: FormGroup;

  constructor() {
    // Inicializar formulario en constructor
    this.empleadoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      jefe: ['']
    });
  }

  ngOnInit() {
    this.loadEmpleados();
  }

  loadEmpleados() {
    this.deptoService.getAllItem().subscribe({
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar empleados'
        });
      }
    });
  }

  onCreate() {
    this.isEditMode.set(false);
    this.selectedEmpleado = undefined;
    this.displayDialog.set(true);
  }

  onEdit(depto: Empleado) {
    this.isEditMode.set(true);
    this.selectedEmpleado = depto;
    this.displayDialog.set(true);
  }

  handleFormSubmit(formValue: CreateEmpleadoDto) {
    this.saving.set(true);

    const request = this.isEditMode() && this.selectedEmpleado
      ? this.deptoService.update(this.selectedEmpleado.id!, formValue)
      : this.deptoService.create(formValue);

    request.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `Empleado ${this.isEditMode() ? 'actualizado' : 'creado'}`
        });
        this.closeDialog();
        this.loadEmpleados();
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

  onDelete(empleado: Empleado) {
    this.confirmService.confirm({
      message: `¿Eliminar empleado "${empleado.nombre}"?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.deptoService.delete(empleado.id!).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Eliminado',
              detail: 'Empleado eliminado correctamente'
            });
            this.loadEmpleados();
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
    this.selectedEmpleado = undefined;
  }
}
