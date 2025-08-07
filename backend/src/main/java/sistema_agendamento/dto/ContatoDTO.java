package sistema_agendamento.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContatoDTO {

    private Long id;

    @NotBlank(message = "Nome é obrigatório")
    @Size(max = 100, message = "Nome deve ter no máximo 100 caracteres")
    private String nome;

    @Email(message = "Email deve ser válido")
    @Size(max = 255, message = "Email deve ter no máximo 255 caracteres")
    private String email;

    @NotBlank(message = "Celular é obrigatório")
    @Pattern(regexp = "^[0-9]{11}$", message = "Celular deve ter 11 dígitos")
    private String celular;

    @Pattern(regexp = "^[0-9]{10}$", message = "Telefone deve ter 10 dígitos")
    private String telefone;

    private Boolean favorito = false;
    private Boolean ativo = true;
    private LocalDateTime dataCadastro;
} 