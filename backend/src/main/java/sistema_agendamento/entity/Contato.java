package sistema_agendamento.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "contato")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Contato {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "contato_id")
    private Long id;

    @NotBlank(message = "Nome é obrigatório")
    @Size(max = 100, message = "Nome deve ter no máximo 100 caracteres")
    @Column(name = "contato_nome", nullable = false, length = 100)
    private String nome;

    @Email(message = "Email deve ser válido")
    @Size(max = 255, message = "Email deve ter no máximo 255 caracteres")
    @Column(name = "contato_email", length = 255)
    private String email;

    @NotBlank(message = "Celular é obrigatório")
    @Pattern(regexp = "^[0-9]{11}$", message = "Celular deve ter 11 dígitos")
    @Column(name = "contato_celular", nullable = false, length = 11, unique = true)
    private String celular;

    @Pattern(regexp = "^[0-9]{10}$", message = "Telefone deve ter 10 dígitos")
    @Column(name = "contato_telefone", length = 10)
    private String telefone;

    @Column(name = "contato_sn_favorito", length = 1)
    private Character favorito = 'N';

    @Column(name = "contato_sn_ativo", length = 1)
    private Character ativo = 'S';

    @CreationTimestamp
    @Column(name = "contato_dh_cad", nullable = false)
    private LocalDateTime dataCadastro;

    @PrePersist
    protected void onCreate() {
        if (dataCadastro == null) {
            dataCadastro = LocalDateTime.now();
        }
        if (favorito == null) {
            favorito = 'N';
        }
        if (ativo == null) {
            ativo = 'S';
        }
    }
} 