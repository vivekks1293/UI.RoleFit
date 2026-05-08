import { Injectable, signal } from '@angular/core';

// ── Types ─────────────────────────────────────────────────────────────────────

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;       // optional subtitle
  duration: number;       // ms before auto-dismiss (0 = stay until closed)
  dismissible: boolean;   // show close button
}

type ToastInput = Omit<Toast, 'id'>;

// ── Service ───────────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class ToastService {

  private _toasts = signal<Toast[]>([]);
  readonly toasts = this._toasts.asReadonly();

  private timers = new Map<string, ReturnType<typeof setTimeout>>();

  // ── Public API ────────────────────────────────────────────────────────────

  success(title: string, message?: string, duration = 4000): void {
    this.add({ type: 'success', title, message, duration, dismissible: true });
  }

  error(title: string, message?: string, duration = 6000): void {
    this.add({ type: 'error', title, message, duration, dismissible: true });
  }

  warning(title: string, message?: string, duration = 5000): void {
    this.add({ type: 'warning', title, message, duration, dismissible: true });
  }

  info(title: string, message?: string, duration = 4000): void {
    this.add({ type: 'info', title, message, duration, dismissible: true });
  }

  // Persistent toast — stays until manually dismissed
  // Useful for "Processing..." states
  loading(title: string, message?: string): string {
    const id = this.add({
      type: 'info',
      title,
      message,
      duration: 0,        // 0 = don't auto-dismiss
      dismissible: false, // user can't close it manually either
    });
    return id; // caller uses this id to dismiss when done
  }

  dismiss(id: string): void {
    this.clearTimer(id);
    this._toasts.update(list =>
      list.filter(t => t.id !== id)
    );
  }

  dismissAll(): void {
    this.timers.forEach((_, id) => this.clearTimer(id));
    this._toasts.set([]);
  }

  // ── Internal ──────────────────────────────────────────────────────────────

  private add(input: ToastInput): string {
    const id = crypto.randomUUID();
    const toast: Toast = { ...input, id };

    this._toasts.update(list => [...list, toast]);

    if (toast.duration > 0) {
      const timer = setTimeout(() => this.dismiss(id), toast.duration);
      this.timers.set(id, timer);
    }

    return id;
  }

  private clearTimer(id: string): void {
    const timer = this.timers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(id);
    }
  }
}