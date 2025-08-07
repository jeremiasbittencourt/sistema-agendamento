import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Contato } from '../../models/contato.model';
import { ContatoService } from '../../services/contato.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-contato-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './contato-list.component.html',
  styleUrls: ['./contato-list.component.css']
})
export class ContatoListComponent implements OnInit {
  contatos: Contato[] = [];
  contatosFiltrados: Contato[] = [];
  termoBusca: string = '';
  carregando: boolean = false;
  erro: string = '';
  mostrandoFavoritos: boolean = false;

  constructor(
    private contatoService: ContatoService,
    private toastService: ToastService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.verificarRota();
    this.carregarContatos();
  }

  verificarRota(): void {
    this.route.url.subscribe(segments => {
      this.mostrandoFavoritos = segments.some(segment => segment.path === 'favoritos');
    });
  }

  carregarContatos(): void {
    this.carregando = true;
    this.erro = '';
    
    this.contatoService.listarContatos().subscribe({
      next: (contatos) => {
        this.contatos = contatos;
        this.aplicarFiltros();
        this.carregando = false;
      },
      error: (error) => {
        this.toastService.error('Erro ao carregar contatos: ' + this.getMensagemErroAPI(error));
        this.carregando = false;
      }
    });
  }

  aplicarFiltros(): void {
    let contatosFiltrados = this.contatos;

    // Aplicar filtro de favoritos se necessário
    if (this.mostrandoFavoritos) {
      contatosFiltrados = contatosFiltrados.filter(contato => contato.favorito);
    }

    // Aplicar filtro de busca se houver termo
    if (this.termoBusca.trim()) {
      const termo = this.termoBusca.toLowerCase();
      contatosFiltrados = contatosFiltrados.filter(contato => 
        contato.nome.toLowerCase().includes(termo) ||
        contato.celular.includes(termo) ||
        (contato.telefone && contato.telefone.includes(termo)) ||
        (contato.email && contato.email.toLowerCase().includes(termo))
      );
    }

    this.contatosFiltrados = contatosFiltrados;
  }

  buscarContatos(): void {
    this.aplicarFiltros();
  }

  alternarFavorito(contato: Contato): void {
    if (!contato.id) return;

    this.contatoService.alternarFavorito(contato.id).subscribe({
      next: (contatoAtualizado) => {
        const index = this.contatos.findIndex(c => c.id === contato.id);
        if (index !== -1) {
          this.contatos[index] = contatoAtualizado;
          this.aplicarFiltros();
          
          const mensagem = contatoAtualizado.favorito 
            ? `"${contatoAtualizado.nome}" adicionado aos favoritos` 
            : `"${contatoAtualizado.nome}" removido dos favoritos`;
          
          this.toastService.success(mensagem);
        }
      },
      error: (error) => {
        this.toastService.error('Erro ao alternar favorito: ' + this.getMensagemErroAPI(error));
      }
    });
  }

  inativarContato(contato: Contato): void {
    if (!contato.id) return;

    if (confirm(`Deseja realmente inativar o contato "${contato.nome}"?`)) {
      this.contatoService.inativarContato(contato.id).subscribe({
        next: () => {
          this.contatos = this.contatos.filter(c => c.id !== contato.id);
          this.aplicarFiltros();
          this.toastService.success(`Contato "${contato.nome}" inativado com sucesso`);
        },
        error: (error) => {
          this.toastService.error('Erro ao inativar contato: ' + this.getMensagemErroAPI(error));
        }
      });
    }
  }

  limparBusca(): void {
    this.termoBusca = '';
    this.aplicarFiltros();
  }

  alternarFiltroFavoritos(): void {
    this.mostrandoFavoritos = !this.mostrandoFavoritos;
    this.aplicarFiltros();
  }

  // Funções para formatar a exibição dos telefones
  formatarCelular(valor: string): string {
    if (!valor) return '';
    const value = valor.replace(/\D/g, '');
    if (value.length === 11) {
      return value.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, '$1 $2 $3 $4');
    }
    return valor;
  }

  formatarTelefone(valor: string): string {
    if (!valor) return '';
    const value = valor.replace(/\D/g, '');
    if (value.length === 10) {
      return value.replace(/(\d{2})(\d{4})(\d{4})/, '$1 $2 $3');
    }
    return valor;
  }

  // Função para obter mensagem de erro mais amigável da API
  getMensagemErroAPI(error: any): string {
    // Se a API retornou uma mensagem específica
    if (error.error && error.error.message) {
      return error.error.message;
    }
    
    // Se a API retornou uma string simples
    if (error.error && typeof error.error === 'string') {
      return error.error;
    }
    
    // Se há erros de validação específicos
    if (error.error && error.error.errors) {
      const errors = error.error.errors;
      const mensagens = Object.values(errors).join('; ');
      return mensagens;
    }
    
    // Tratamento por status HTTP
    if (error.status === 400) {
      return 'Dados inválidos. Verifique os campos preenchidos.';
    }
    
    if (error.status === 404) {
      return 'Contato não encontrado.';
    }
    
    if (error.status === 500) {
      return 'Erro interno do servidor. Tente novamente mais tarde.';
    }
    
    return 'Erro inesperado. Tente novamente.';
  }
} 