import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contato } from '../models/contato.model';

@Injectable({
  providedIn: 'root'
})
export class ContatoService {
  private apiUrl = 'http://localhost:8080/api/contatos';

  constructor(private http: HttpClient) { }

  // Listar todos os contatos ativos
  listarContatos(): Observable<Contato[]> {
    return this.http.get<Contato[]>(this.apiUrl);
  }

  // Listar contatos favoritos
  listarFavoritos(): Observable<Contato[]> {
    return this.http.get<Contato[]>(`${this.apiUrl}/favoritos`);
  }

  // Buscar contato por ID
  buscarPorId(id: number): Observable<Contato> {
    return this.http.get<Contato>(`${this.apiUrl}/${id}`);
  }

  // Buscar contatos por termo
  buscarPorTermo(termo: string): Observable<Contato[]> {
    return this.http.get<Contato[]>(`${this.apiUrl}/buscar?termo=${termo}`);
  }

  // Criar novo contato
  criarContato(contato: Contato): Observable<Contato> {
    return this.http.post<Contato>(this.apiUrl, contato);
  }

  // Atualizar contato
  atualizarContato(id: number, contato: Contato): Observable<Contato> {
    return this.http.put<Contato>(`${this.apiUrl}/${id}`, contato);
  }

  // Inativar contato
  inativarContato(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Alternar status de favorito
  alternarFavorito(id: number): Observable<Contato> {
    return this.http.patch<Contato>(`${this.apiUrl}/${id}/favorito`, {});
  }
} 