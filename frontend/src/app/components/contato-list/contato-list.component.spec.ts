import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ContatoListComponent } from './contato-list.component';
import { ContatoService } from '../../services/contato.service';
import { ToastService } from '../../services/toast.service';
import { Contato } from '../../models/contato.model';

describe('ContatoListComponent', () => {
  let component: ContatoListComponent;
  let fixture: ComponentFixture<ContatoListComponent>;
  let contatoService: jasmine.SpyObj<ContatoService>;
  let toastService: jasmine.SpyObj<ToastService>;
  let route: jasmine.SpyObj<ActivatedRoute>;

  const mockContatos: Contato[] = [
    {
      id: 1,
      nome: 'João Silva',
      email: 'joao@email.com',
      celular: '11987654321',
      telefone: '1187654321',
      favorito: true,
      ativo: true
    },
    {
      id: 2,
      nome: 'Maria Santos',
      email: 'maria@email.com',
      celular: '11987654322',
      telefone: '1187654322',
      favorito: false,
      ativo: true
    }
  ];

  beforeEach(async () => {
    const contatoServiceSpy = jasmine.createSpyObj('ContatoService', [
      'listarContatos', 'listarFavoritos', 'alternarFavorito', 'inativarContato'
    ]);
    const toastServiceSpy = jasmine.createSpyObj('ToastService', ['success', 'error']);
    const routeSpy = jasmine.createSpyObj('ActivatedRoute', [], {
      url: of([{ path: 'contatos' }])
    });

    await TestBed.configureTestingModule({
      imports: [ContatoListComponent],
      providers: [
        { provide: ContatoService, useValue: contatoServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: ActivatedRoute, useValue: routeSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ContatoListComponent);
    component = fixture.componentInstance;
    contatoService = TestBed.inject(ContatoService) as jasmine.SpyObj<ContatoService>;
    toastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
    route = TestBed.inject(ActivatedRoute) as jasmine.SpyObj<ActivatedRoute>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load contacts on init', () => {
    contatoService.listarContatos.and.returnValue(of(mockContatos));
    
    component.ngOnInit();
    
    expect(contatoService.listarContatos).toHaveBeenCalled();
    expect(component.contatos).toEqual(mockContatos);
    expect(component.contatosFiltrados).toEqual(mockContatos);
  });

  it('should show error toast when loading contacts fails', () => {
    const error = { status: 500, error: 'Erro interno' };
    contatoService.listarContatos.and.returnValue(throwError(() => error));
    
    component.ngOnInit();
    
    expect(toastService.error).toHaveBeenCalledWith('Erro ao carregar contatos: Erro interno do servidor. Tente novamente mais tarde.');
  });

  it('should load favorite contacts when on favorites route', () => {
    // Set up route to simulate favorites path
    (route.url as any) = of([{ path: 'favoritos' }]);
    contatoService.listarContatos.and.returnValue(of(mockContatos));
    
    component.ngOnInit();
    
    expect(contatoService.listarContatos).toHaveBeenCalled();
    expect(component.mostrandoFavoritos).toBe(true);
  });

  it('should toggle favorite filter correctly', () => {
    component.contatos = mockContatos;
    component.contatosFiltrados = mockContatos;
    component.mostrandoFavoritos = false;
    
    component.alternarFiltroFavoritos();
    
    expect(component.mostrandoFavoritos).toBe(true);
    expect(component.contatosFiltrados).toEqual([mockContatos[0]]);
  });

  it('should search contacts correctly', () => {
    component.contatos = mockContatos;
    component.contatosFiltrados = mockContatos;
    component.termoBusca = 'João';
    
    component.buscarContatos();
    
    expect(component.contatosFiltrados).toEqual([mockContatos[0]]);
  });

  it('should clear search correctly', () => {
    component.contatos = mockContatos;
    component.contatosFiltrados = [mockContatos[0]];
    component.termoBusca = 'João';
    
    component.limparBusca();
    
    expect(component.termoBusca).toBe('');
    expect(component.contatosFiltrados).toEqual(mockContatos);
  });

  it('should toggle favorite status successfully', () => {
    const contato = { ...mockContatos[0] };
    contatoService.alternarFavorito.and.returnValue(of(contato));
    
    component.alternarFavorito(contato);
    
    expect(contatoService.alternarFavorito).toHaveBeenCalledWith(1);
    expect(toastService.success).toHaveBeenCalledWith('"João Silva" adicionado aos favoritos');
  });

  it('should show error toast when toggling favorite fails', () => {
    const contato = { ...mockContatos[0] };
    const error = { status: 400, error: 'Erro ao alterar favorito' };
    contatoService.alternarFavorito.and.returnValue(throwError(() => error));
    
    component.alternarFavorito(contato);
    
    expect(toastService.error).toHaveBeenCalledWith('Erro ao alterar favorito: Erro ao alterar favorito');
  });

  it('should inactivate contact successfully', () => {
    const contato = { ...mockContatos[0] };
    contatoService.inativarContato.and.returnValue(of(void 0));
    
    component.inativarContato(contato);
    
    expect(contatoService.inativarContato).toHaveBeenCalledWith(1);
    expect(toastService.success).toHaveBeenCalledWith('Contato inativado com sucesso!');
  });

  it('should show error toast when inactivating contact fails', () => {
    const contato = { ...mockContatos[0] };
    const error = { status: 404, error: 'Contato não encontrado' };
    contatoService.inativarContato.and.returnValue(throwError(() => error));
    
    component.inativarContato(contato);
    
    expect(toastService.error).toHaveBeenCalledWith('Erro ao inativar contato: Contato não encontrado');
  });

  it('should format celular for display', () => {
    const result = component.formatarCelular('11987654321');
    expect(result).toBe('11 9 8765 4321');
  });

  it('should format telefone for display', () => {
    const result = component.formatarTelefone('1187654321');
    expect(result).toBe('11 8765 4321');
  });

  it('should apply filters correctly', () => {
    component.contatos = mockContatos;
    component.termoBusca = 'João';
    component.mostrandoFavoritos = true;
    
    component.aplicarFiltros();
    
    expect(component.contatosFiltrados).toEqual([mockContatos[0]]);
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

  it('should handle validation errors correctly', () => {
    const error = { 
      status: 400, 
      error: { 
        errors: {
          nome: 'Nome é obrigatório',
          celular: 'Celular é obrigatório'
        }
      } 
    };
    
    const result = component.getMensagemErroAPI(error);
    expect(result).toBe('Nome é obrigatório; Celular é obrigatório');
  });
});
