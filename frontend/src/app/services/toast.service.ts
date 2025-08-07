import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toastr: ToastrService) { }

  success(message: string, title: string = 'Sucesso'): void {
    this.toastr.success(message, title, {
      timeOut: 3000,
      progressBar: true,
      closeButton: true,
      positionClass: 'toast-top-right'
    });
  }

  error(message: string, title: string = 'Erro'): void {
    this.toastr.error(message, title, {
      timeOut: 5000,
      progressBar: true,
      closeButton: true,
      positionClass: 'toast-top-right'
    });
  }

  warning(message: string, title: string = 'Atenção'): void {
    this.toastr.warning(message, title, {
      timeOut: 4000,
      progressBar: true,
      closeButton: true,
      positionClass: 'toast-top-right'
    });
  }

  info(message: string, title: string = 'Informação'): void {
    this.toastr.info(message, title, {
      timeOut: 3000,
      progressBar: true,
      closeButton: true,
      positionClass: 'toast-top-right'
    });
  }
} 