import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ContatoFormComponent } from './contato-form.component';
import { ContatoService } from '../../services/contato.service';
import { ToastService } from '../../services/toast.service';
import { Contato } from '../../models/contato.model';

describe('ContatoFormComponent', () => {
  let component: ContatoFormComponent;
  let fixture: ComponentFixture<ContatoFormComponent>;
  let contatoService: jasmine.SpyObj<ContatoService>;
  let toastService: jasmine.SpyObj<ToastService>;
  let router: jasmine.SpyObj<Router>;
  let route: jasmine.SpyObj<ActivatedRoute>;

  const mockContato: Contato = {
    id: 1,
    nome: 'João Silva',
    email: 'joao@email.com',
    celular: '11987654321',
    telefone: '1187654321',
    favorito: false,
    ativo: true
  };

  beforeEach(async () => {
    const contatoServiceSpy = jasmine.createSpyObj('ContatoService', [
      'buscarPorId', 'criarContato', 'atualizarContato'
    ]);
    const toastServiceSpy = jasmine.createSpyObj('ToastService', ['success', 'error']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const routeSpy = jasmine.createSpyObj('ActivatedRoute', [], {
      params: of({ id: '1' })
    });

    await TestBed.configureTestingModule({
      imports: [ContatoFormComponent, ReactiveFormsModule],
      providers: [
        { provide: ContatoService, useValue: contatoServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: routeSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ContatoFormComponent);
    component = fixture.componentInstance;
    contatoService = TestBed.inject(ContatoService) as jasmine.SpyObj<ContatoService>;
    toastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    route = TestBed.inject(ActivatedRoute) as jasmine.SpyObj<ActivatedRoute>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    component.ngOnInit();
    expect(component.contatoForm.get('nome')?.value).toBe('');
    expect(component.contatoForm.get('email')?.value).toBe('');
    expect(component.contatoForm.get('celular')?.value).toBe('');
    expect(component.contatoForm.get('telefone')?.value).toBe('');
    expect(component.contatoForm.get('favorito')?.value).toBe(false);
    expect(component.contatoForm.get('ativo')?.value).toBe(true);
  });

  it('should load contact for editing when ID is provided', () => {
    contatoService.buscarPorId.and.returnValue(of(mockContato));
    
    component.contatoId = 1;
    component.carregarContato();

    expect(contatoService.buscarPorId).toHaveBeenCalledWith(1);
    expect(component.contatoForm.get('nome')?.value).toBe('João Silva');
    expect(component.contatoForm.get('email')?.value).toBe('joao@email.com');
  });

  it('should show error toast when loading contact fails', () => {
    const error = { status: 404, error: 'Contato não encontrado' };
    contatoService.buscarPorId.and.returnValue(throwError(() => error));
    
    component.contatoId = 1;
    component.carregarContato();

    expect(toastService.error).toHaveBeenCalledWith('Erro ao carregar contato: Contato não encontrado');
  });

  it('should create new contact successfully', () => {
    contatoService.criarContato.and.returnValue(of(mockContato));
    component.contatoForm.patchValue({
      nome: 'João Silva',
      celular: '11987654321'
    });

    component.onSubmit();

    expect(contatoService.criarContato).toHaveBeenCalled();
    expect(toastService.success).toHaveBeenCalledWith('Contato criado com sucesso!');
    expect(router.navigate).toHaveBeenCalledWith(['/contatos']);
  });

  it('should update existing contact successfully', () => {
    contatoService.atualizarContato.and.returnValue(of(mockContato));
    component.editando = true;
    component.contatoId = 1;
    component.contatoForm.patchValue({
      nome: 'João Silva',
      celular: '11987654321'
    });

    component.onSubmit();

    expect(contatoService.atualizarContato).toHaveBeenCalledWith(1, jasmine.any(Object));
    expect(toastService.success).toHaveBeenCalledWith('Contato atualizado com sucesso!');
    expect(router.navigate).toHaveBeenCalledWith(['/contatos']);
  });

  it('should show error toast when creating contact fails', () => {
    const error = { status: 400, error: 'Dados inválidos' };
    contatoService.criarContato.and.returnValue(throwError(() => error));
    component.contatoForm.patchValue({
      nome: 'João Silva',
      celular: '11987654321'
    });

    component.onSubmit();

    expect(toastService.error).toHaveBeenCalledWith('Erro ao criar contato: Dados inválidos');
  });

  it('should apply celular mask correctly', () => {
    const event = { target: { value: '11987654321' } };
    
    component.aplicarMascaraCelular(event);
    
    expect(event.target.value).toBe('11 9 8765 4321');
  });

  it('should apply telefone mask correctly', () => {
    const event = { target: { value: '1187654321' } };
    
    component.aplicarMascaraTelefone(event);
    
    expect(event.target.value).toBe('11 8765 4321');
  });

  it('should format values for display', () => {
    component.contatoForm.patchValue({
      celular: '11987654321',
      telefone: '1187654321'
    });
    
    component.formatarValoresParaExibicao();
    
    expect(component.contatoForm.get('celular')?.value).toBe('11987654321');
    expect(component.contatoForm.get('telefone')?.value).toBe('1187654321');
  });

  it('should format celular for display', () => {
    const result = component.formatarCelularParaExibicao('11987654321');
    expect(result).toBe('11 9 8765 4321');
  });

  it('should format telefone for display', () => {
    const result = component.formatarTelefoneParaExibicao('1187654321');
    expect(result).toBe('11 8765 4321');
  });

  it('should return user-friendly error message from API', () => {
    const error = { 
      status: 400, 
      error: { 
        message: 'Campo obrigatório: Nome' 
      } 
    };
    
    const result = component.getMensagemErroAPI(error);
    expect(result).toBe('Campo obrigatório: Nome');
  });

  it('should return generic error message for unknown errors', () => {
    const error = { status: 500 };
    
    const result = component.getMensagemErroAPI(error);
    expect(result).toBe('Erro interno do servidor. Tente novamente mais tarde.');
  });

  it('should mark invalid fields when form is invalid', () => {
    component.contatoForm.patchValue({
      nome: '',
      celular: ''
    });
    
    component.onSubmit();
    
    expect(component.contatoForm.get('nome')?.invalid).toBe(true);
    expect(component.contatoForm.get('celular')?.invalid).toBe(true);
  });

  it('should return correct error message for required field', () => {
    const result = component.getMensagemErro('nome');
    expect(result).toBe('Nome é obrigatório');
  });

  it('should return correct error message for email field', () => {
    component.contatoForm.get('email')?.setValue('invalid-email');
    const result = component.getMensagemErro('email');
    expect(result).toBe('Email deve ser válido');
  });

  it('should return correct error message for celular field', () => {
    component.contatoForm.get('celular')?.setValue('123');
    const result = component.getMensagemErro('celular');
    expect(result).toBe('Celular deve ter 11 dígitos');
  });

  it('should return correct error message for telefone field', () => {
    component.contatoForm.get('telefone')?.setValue('123');
    const result = component.getMensagemErro('telefone');
    expect(result).toBe('Telefone deve ter 10 dígitos');
  });
});
