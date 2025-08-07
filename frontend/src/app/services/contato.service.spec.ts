import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ContatoService } from './contato.service';
import { Contato } from '../models/contato.model';

describe('ContatoService', () => {
  let service: ContatoService;
  let httpMock: HttpTestingController;

  const mockContato: Contato = {
    id: 1,
    nome: 'João Silva',
    email: 'joao@email.com',
    celular: '11987654321',
    telefone: '1187654321',
    favorito: false,
    ativo: true
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ContatoService]
    });
    service = TestBed.inject(ContatoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should list all contacts', () => {
    const mockContatos = [mockContato];

    service.listarContatos().subscribe(contatos => {
      expect(contatos).toEqual(mockContatos);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/contatos');
    expect(req.request.method).toBe('GET');
    req.flush(mockContatos);
  });

  it('should list favorite contacts', () => {
    const mockContatos = [mockContato];

    service.listarFavoritos().subscribe(contatos => {
      expect(contatos).toEqual(mockContatos);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/contatos/favoritos');
    expect(req.request.method).toBe('GET');
    req.flush(mockContatos);
  });

  it('should get contact by id', () => {
    service.buscarPorId(1).subscribe(contato => {
      expect(contato).toEqual(mockContato);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/contatos/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockContato);
  });

  it('should search contacts by term', () => {
    const mockContatos = [mockContato];

    service.buscarPorTermo('João').subscribe(contatos => {
      expect(contatos).toEqual(mockContatos);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/contatos/buscar?termo=João');
    expect(req.request.method).toBe('GET');
    req.flush(mockContatos);
  });

  it('should create new contact', () => {
    const newContato = { ...mockContato, id: undefined };

    service.criarContato(newContato).subscribe(contato => {
      expect(contato).toEqual(mockContato);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/contatos');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newContato);
    req.flush(mockContato);
  });

  it('should update existing contact', () => {
    const updatedContato = { ...mockContato, nome: 'João Silva Atualizado' };

    service.atualizarContato(1, updatedContato).subscribe(contato => {
      expect(contato).toEqual(updatedContato);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/contatos/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedContato);
    req.flush(updatedContato);
  });

  it('should inactivate contact', () => {
    service.inativarContato(1).subscribe(() => {
      expect().nothing();
    });

    const req = httpMock.expectOne('http://localhost:8080/api/contatos/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should toggle favorite status', () => {
    const updatedContato = { ...mockContato, favorito: true };

    service.alternarFavorito(1).subscribe(contato => {
      expect(contato).toEqual(updatedContato);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/contatos/1/favorito');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({});
    req.flush(updatedContato);
  });

  it('should handle error when listing contacts fails', () => {
    const errorMessage = 'Internal Server Error';

    service.listarContatos().subscribe({
      next: () => fail('should have failed with 500 error'),
      error: (error) => {
        expect(error.status).toBe(500);
        expect(error.error).toBe(errorMessage);
      }
    });

    const req = httpMock.expectOne('http://localhost:8080/api/contatos');
    req.flush(errorMessage, { status: 500, statusText: 'Internal Server Error' });
  });

  it('should handle error when creating contact fails', () => {
    const errorMessage = 'Bad Request';
    const newContato = { ...mockContato, id: undefined };

    service.criarContato(newContato).subscribe({
      next: () => fail('should have failed with 400 error'),
      error: (error) => {
        expect(error.status).toBe(400);
        expect(error.error).toBe(errorMessage);
      }
    });

    const req = httpMock.expectOne('http://localhost:8080/api/contatos');
    req.flush(errorMessage, { status: 400, statusText: 'Bad Request' });
  });

  it('should handle error when updating contact fails', () => {
    const errorMessage = 'Not Found';
    const updatedContato = { ...mockContato, nome: 'João Silva Atualizado' };

    service.atualizarContato(1, updatedContato).subscribe({
      next: () => fail('should have failed with 404 error'),
      error: (error) => {
        expect(error.status).toBe(404);
        expect(error.error).toBe(errorMessage);
      }
    });

    const req = httpMock.expectOne('http://localhost:8080/api/contatos/1');
    req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
  });
});
