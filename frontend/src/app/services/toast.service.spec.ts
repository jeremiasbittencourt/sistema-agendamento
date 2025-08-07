import { TestBed } from '@angular/core/testing';
import { ToastrService } from 'ngx-toastr';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;
  let toastrService: jasmine.SpyObj<ToastrService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('ToastrService', ['success', 'error', 'warning', 'info']);
    
    TestBed.configureTestingModule({
      providers: [
        ToastService,
        { provide: ToastrService, useValue: spy }
      ]
    });
    
    service = TestBed.inject(ToastService);
    toastrService = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call success with default title', () => {
    const message = 'Operação realizada com sucesso';
    
    service.success(message);
    
    expect(toastrService.success).toHaveBeenCalledWith(message, 'Sucesso', {
      timeOut: 3000,
      progressBar: true,
      closeButton: true,
      positionClass: 'toast-top-right'
    });
  });

  it('should call success with custom title', () => {
    const message = 'Contato salvo';
    const title = 'Sucesso!';
    
    service.success(message, title);
    
    expect(toastrService.success).toHaveBeenCalledWith(message, title, {
      timeOut: 3000,
      progressBar: true,
      closeButton: true,
      positionClass: 'toast-top-right'
    });
  });

  it('should call error with default title', () => {
    const message = 'Erro ao salvar contato';
    
    service.error(message);
    
    expect(toastrService.error).toHaveBeenCalledWith(message, 'Erro', {
      timeOut: 5000,
      progressBar: true,
      closeButton: true,
      positionClass: 'toast-top-right'
    });
  });

  it('should call error with custom title', () => {
    const message = 'Campo obrigatório';
    const title = 'Validação';
    
    service.error(message, title);
    
    expect(toastrService.error).toHaveBeenCalledWith(message, title, {
      timeOut: 5000,
      progressBar: true,
      closeButton: true,
      positionClass: 'toast-top-right'
    });
  });

  it('should call warning with default title', () => {
    const message = 'Atenção aos dados';
    
    service.warning(message);
    
    expect(toastrService.warning).toHaveBeenCalledWith(message, 'Atenção', {
      timeOut: 4000,
      progressBar: true,
      closeButton: true,
      positionClass: 'toast-top-right'
    });
  });

  it('should call warning with custom title', () => {
    const message = 'Dados incompletos';
    const title = 'Aviso';
    
    service.warning(message, title);
    
    expect(toastrService.warning).toHaveBeenCalledWith(message, title, {
      timeOut: 4000,
      progressBar: true,
      closeButton: true,
      positionClass: 'toast-top-right'
    });
  });

  it('should call info with default title', () => {
    const message = 'Informação importante';
    
    service.info(message);
    
    expect(toastrService.info).toHaveBeenCalledWith(message, 'Informação', {
      timeOut: 3000,
      progressBar: true,
      closeButton: true,
      positionClass: 'toast-top-right'
    });
  });

  it('should call info with custom title', () => {
    const message = 'Processando dados';
    const title = 'Status';
    
    service.info(message, title);
    
    expect(toastrService.info).toHaveBeenCalledWith(message, title, {
      timeOut: 3000,
      progressBar: true,
      closeButton: true,
      positionClass: 'toast-top-right'
    });
  });
});
