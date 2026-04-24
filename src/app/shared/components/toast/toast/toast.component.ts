import { Component } from '@angular/core';
import { ToastService, Toast } from '../../../../core/services/Toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css'],
})
export class ToastComponent {
  constructor(public toastService: ToastService) {}

  dismiss(id: string): void {
    this.toastService.dismiss(id);
  }

  // Used for @for trackBy
  trackById(index: number, toast: Toast): string {
    return toast.id;
  }

  // Returns the right icon SVG path per type
  iconPath(type: Toast['type']): string {
    switch (type) {
      case 'success':
        return 'M20 6L9 17L4 12'; // checkmark
      case 'error':
        return 'M18 6L6 18M6 6l12 12'; // X
      case 'warning':
        return 'M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z'; // triangle
      case 'info':
        return 'M12 8h.01M12 12v4M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z'; // circle i
    }
  }
}