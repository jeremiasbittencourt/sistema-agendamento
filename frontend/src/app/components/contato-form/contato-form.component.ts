import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Contato } from '../../models/contato.model';
import { ContatoService } from '../../services/contato.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-contato-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contato-form.component.html',
  styleUrls: ['./contato-form.component.css']
})
export class ContatoFormComponent implements OnInit {
  contatoForm!: FormGroup;
  contatoId?: number;
  editando: boolean = false;
  carregando: boolean = false;

  constructor(
    private fb: FormBuilder,
    private contatoService: ContatoService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.inicializarFormulario();
    this.verificarSeEditando();
  }

  inicializarFormulario(): void {
    this.contatoForm = this.fb.group({
      nome: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.email, Validators.maxLength(255)]],
      celular: ['', [Validators.required, Validators.pattern('^[0-9]{11}$')]],
      telefone: ['', [Validators.pattern('^[0-9]{10}$')]],
      favorito: [false],
      ativo: [true]
    });
  }

  verificarSeEditando(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.contatoId = +id;
        this.editando = true;
        this.carregarContato();
      }
    });
  }

  carregarContato(): void {
    if (!this.contatoId) return;

    this.carregando = true;
    this.contatoService.buscarPorId(this.contatoId).subscribe({
      next: (contato) => {
        this.contatoForm.patchValue(contato);
        this.formatarValoresParaExibicao();
        this.carregando = false;
      },
      error: (error) => {
        this.toastService.error('Erro ao carregar contato: ' + this.getMensagemErroAPI(error));
        this.carregando = false;
      }
    });
  }

  onSubmit(): void {
    if (this.contatoForm.invalid) {
      this.marcarCamposInvalidos();
      return;
    }

    this.carregando = true;

    const contato: Contato = this.contatoForm.value;

    if (this.editando && this.contatoId) {
      this.contatoService.atualizarContato(this.contatoId, contato).subscribe({
        next: () => {
          this.toastService.success('Contato atualizado com sucesso!');
          this.router.navigate(['/contatos']);
        },
        error: (error) => {
          this.toastService.error('Erro ao atualizar contato: ' + this.getMensagemErroAPI(error));
          this.carregando = false;
        }
      });
    } else {
      this.contatoService.criarContato(contato).subscribe({
        next: () => {
          this.toastService.success('Contato criado com sucesso!');
          this.router.navigate(['/contatos']);
        },
        error: (error) => {
          this.toastService.error('Erro ao criar contato: ' + this.getMensagemErroAPI(error));
          this.carregando = false;
        }
      });
    }
  }

  marcarCamposInvalidos(): void {
    Object.keys(this.contatoForm.controls).forEach(key => {
      const control = this.contatoForm.get(key);
      if (control?.invalid) {
        control.markAsTouched();
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/contatos']);
  }

  isCampoInvalido(campo: string): boolean {
    const control = this.contatoForm.get(campo);
    return control ? (control.invalid && control.touched) : false;
  }

  getMensagemErro(campo: string): string {
    const control = this.contatoForm.get(campo);
    if (!control) return '';

    if (control.hasError('required')) {
      return 'Este campo é obrigatório';
    }
    if (control.hasError('email')) {
      return 'Email inválido';
    }
    if (control.hasError('maxlength')) {
      return `Máximo de ${control.getError('maxlength').requiredLength} caracteres`;
    }
    if (control.hasError('pattern')) {
      if (campo === 'celular') {
        return 'Celular deve ter 11 dígitos (ex: 11999999999)';
      }
      if (campo === 'telefone') {
        return 'Telefone deve ter 10 dígitos (ex: 1133333333)';
      }
    }

    return 'Campo inválido';
  }

  // Função para aplicar máscara de celular (## # #### ####)
  aplicarMascaraCelular(event: any): void {
    const input = event.target;
    let valor = input.value.replace(/\D/g, '');
    
    // Limitar a 11 dígitos
    if (valor.length > 11) {
      valor = valor.substring(0, 11);
    }
    
    // Aplicar máscara ## # #### ####
    let valorFormatado = '';
    if (valor.length > 0) {
      if (valor.length <= 2) {
        valorFormatado = valor;
      } else if (valor.length <= 3) {
        valorFormatado = valor.substring(0, 2) + ' ' + valor.substring(2);
      } else if (valor.length <= 7) {
        valorFormatado = valor.substring(0, 2) + ' ' + valor.substring(2, 3) + ' ' + valor.substring(3);
      } else {
        valorFormatado = valor.substring(0, 2) + ' ' + valor.substring(2, 3) + ' ' + valor.substring(3, 7) + ' ' + valor.substring(7);
      }
    }
    
    input.value = valorFormatado;
    
    // Atualizar o valor no formulário sem formatação
    this.contatoForm.patchValue({ celular: valor }, { emitEvent: false });
  }

  // Função para aplicar máscara de telefone (## #### ####)
  aplicarMascaraTelefone(event: any): void {
    const input = event.target;
    let valor = input.value.replace(/\D/g, '');
    
    // Limitar a 10 dígitos
    if (valor.length > 10) {
      valor = valor.substring(0, 10);
    }
    
    // Aplicar máscara ## #### ####
    let valorFormatado = '';
    if (valor.length > 0) {
      if (valor.length <= 2) {
        valorFormatado = valor;
      } else if (valor.length <= 6) {
        valorFormatado = valor.substring(0, 2) + ' ' + valor.substring(2);
      } else {
        valorFormatado = valor.substring(0, 2) + ' ' + valor.substring(2, 6) + ' ' + valor.substring(6);
      }
    }
    
    input.value = valorFormatado;
    
    // Atualizar o valor no formulário sem formatação
    this.contatoForm.patchValue({ telefone: valor }, { emitEvent: false });
  }

  // Função para formatar valores para exibição quando carregar dados
  formatarValoresParaExibicao(): void {
    // Formatar celular para exibição
    const celularControl = this.contatoForm.get('celular');
    if (celularControl && celularControl.value) {
      const celularFormatado = this.formatarCelularParaExibicao(celularControl.value);
      const inputCelular = document.getElementById('celular') as HTMLInputElement;
      if (inputCelular) {
        inputCelular.value = celularFormatado;
      }
    }

    // Formatar telefone para exibição
    const telefoneControl = this.contatoForm.get('telefone');
    if (telefoneControl && telefoneControl.value) {
      const telefoneFormatado = this.formatarTelefoneParaExibicao(telefoneControl.value);
      const inputTelefone = document.getElementById('telefone') as HTMLInputElement;
      if (inputTelefone) {
        inputTelefone.value = telefoneFormatado;
      }
    }
  }

  // Função para formatar celular para exibição (## # #### ####)
  formatarCelularParaExibicao(valor: string): string {
    if (!valor) return '';
    const value = valor.replace(/\D/g, '');
    if (value.length === 11) {
      return value.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, '$1 $2 $3 $4');
    }
    return valor;
  }

  // Função para formatar telefone para exibição (## #### ####)
  formatarTelefoneParaExibicao(valor: string): string {
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