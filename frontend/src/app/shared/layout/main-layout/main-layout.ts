import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    PanelMenuModule,
    ButtonModule,
    MenuModule
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayout {
  sidebarVisible = signal(true);
  
  menuItems: MenuItem[] = [
    {
      label: 'Gestión',
      icon: 'pi pi-fw pi-briefcase',
      items: [
        {
          label: 'Departamentos',
          icon: 'pi pi-fw pi-building',
          routerLink: ['/departamentos']
        },
        {
          label: 'Empleados',
          icon: 'pi pi-fw pi-users',
          routerLink: ['/empleados']
        }
      ]
    },
    {
      label: 'Configuración',
      icon: 'pi pi-fw pi-cog',
      items: [
        {
          label: 'Perfil',
          icon: 'pi pi-fw pi-user'
        },
        {
          label: 'Salir',
          icon: 'pi pi-fw pi-sign-out'
        }
      ]
    }
  ];

  toggleSidebar() {
    this.sidebarVisible.update(v => !v);
  }
}
