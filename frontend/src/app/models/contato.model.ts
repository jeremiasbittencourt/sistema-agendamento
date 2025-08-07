export interface Contato {
  id?: number;
  nome: string;
  email?: string;
  celular: string;
  telefone?: string;
  favorito: boolean;
  ativo: boolean;
  dataCadastro?: Date;
} 