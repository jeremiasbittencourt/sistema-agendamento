package sistema_agendamento.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sistema_agendamento.dto.ContatoDTO;
import sistema_agendamento.service.ContatoService;

import java.util.List;

@RestController
@RequestMapping("/contatos")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Contatos", description = "API para gerenciamento de contatos")
@CrossOrigin(origins = "*")
public class ContatoController {

    private final ContatoService contatoService;

    @GetMapping
    @Operation(summary = "Listar todos os contatos ativos")
    public ResponseEntity<List<ContatoDTO>> listarTodos() {
        log.info("Recebida requisição para listar todos os contatos");
        List<ContatoDTO> contatos = contatoService.listarTodos();
        return ResponseEntity.ok(contatos);
    }

    @GetMapping("/favoritos")
    @Operation(summary = "Listar contatos favoritos")
    public ResponseEntity<List<ContatoDTO>> listarFavoritos() {
        log.info("Recebida requisição para listar contatos favoritos");
        List<ContatoDTO> favoritos = contatoService.listarFavoritos();
        return ResponseEntity.ok(favoritos);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar contato por ID")
    public ResponseEntity<ContatoDTO> buscarPorId(@PathVariable Long id) {
        log.info("Recebida requisição para buscar contato ID: {}", id);
        ContatoDTO contato = contatoService.buscarPorId(id);
        return ResponseEntity.ok(contato);
    }

    @GetMapping("/buscar")
    @Operation(summary = "Buscar contatos por termo")
    public ResponseEntity<List<ContatoDTO>> buscarPorTermo(@RequestParam String termo) {
        log.info("Recebida requisição para buscar contatos por termo: {}", termo);
        List<ContatoDTO> contatos = contatoService.buscarPorTermo(termo);
        return ResponseEntity.ok(contatos);
    }

    @PostMapping
    @Operation(summary = "Criar novo contato")
    public ResponseEntity<ContatoDTO> criar(@Valid @RequestBody ContatoDTO contatoDTO) {
        log.info("Recebida requisição para criar contato: {}", contatoDTO.getNome());
        ContatoDTO contatoCriado = contatoService.criar(contatoDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(contatoCriado);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar contato")
    public ResponseEntity<ContatoDTO> atualizar(@PathVariable Long id, @Valid @RequestBody ContatoDTO contatoDTO) {
        log.info("Recebida requisição para atualizar contato ID: {}", id);
        ContatoDTO contatoAtualizado = contatoService.atualizar(id, contatoDTO);
        return ResponseEntity.ok(contatoAtualizado);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Inativar contato")
    public ResponseEntity<Void> inativar(@PathVariable Long id) {
        log.info("Recebida requisição para inativar contato ID: {}", id);
        contatoService.inativar(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/favorito")
    @Operation(summary = "Alternar status de favorito")
    public ResponseEntity<ContatoDTO> alternarFavorito(@PathVariable Long id) {
        log.info("Recebida requisição para alternar favorito do contato ID: {}", id);
        ContatoDTO contato = contatoService.alternarFavorito(id);
        return ResponseEntity.ok(contato);
    }
} 