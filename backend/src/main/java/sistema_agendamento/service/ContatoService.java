package sistema_agendamento.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sistema_agendamento.dto.ContatoDTO;
import sistema_agendamento.entity.Contato;
import sistema_agendamento.repository.ContatoRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ContatoService {

    private final ContatoRepository contatoRepository;

    public List<ContatoDTO> listarTodos() {
        log.info("Listando todos os contatos ativos");
        return contatoRepository.findAllAtivos()
                .stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }

    public List<ContatoDTO> listarFavoritos() {
        log.info("Listando contatos favoritos");
        return contatoRepository.findAllFavoritos()
                .stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }

    public ContatoDTO buscarPorId(Long id) {
        log.info("Buscando contato por ID: {}", id);
        Contato contato = contatoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contato não encontrado"));
        return converterParaDTO(contato);
    }

    public List<ContatoDTO> buscarPorTermo(String termo) {
        log.info("Buscando contatos por termo: {}", termo);
        return contatoRepository.buscarPorTermo(termo)
                .stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }

    public ContatoDTO criar(ContatoDTO contatoDTO) {
        log.info("Criando novo contato: {}", contatoDTO.getNome());
        
        // Verificar se já existe contato com o mesmo celular
        if (contatoRepository.findByCelular(contatoDTO.getCelular()).isPresent()) {
            throw new RuntimeException("Já existe um contato cadastrado com este celular");
        }

        Contato contato = converterParaEntidade(contatoDTO);
        contato = contatoRepository.save(contato);
        return converterParaDTO(contato);
    }

    public ContatoDTO atualizar(Long id, ContatoDTO contatoDTO) {
        log.info("Atualizando contato ID: {}", id);
        
        Contato contatoExistente = contatoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contato não encontrado"));

        // Verificar se o celular já existe em outro contato
        if (!contatoExistente.getCelular().equals(contatoDTO.getCelular())) {
            if (contatoRepository.findByCelularExcludingId(contatoDTO.getCelular(), id).isPresent()) {
                throw new RuntimeException("Já existe outro contato cadastrado com este celular");
            }
        }

        atualizarDadosContato(contatoExistente, contatoDTO);
        contatoExistente = contatoRepository.save(contatoExistente);
        return converterParaDTO(contatoExistente);
    }

    public void inativar(Long id) {
        log.info("Inativando contato ID: {}", id);
        Contato contato = contatoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contato não encontrado"));
        contato.setAtivo('N');
        contatoRepository.save(contato);
    }

    public ContatoDTO alternarFavorito(Long id) {
        log.info("Alternando favorito do contato ID: {}", id);
        Contato contato = contatoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contato não encontrado"));
        
        contato.setFavorito(contato.getFavorito() == 'S' ? 'N' : 'S');
        contato = contatoRepository.save(contato);
        return converterParaDTO(contato);
    }

    private Contato converterParaEntidade(ContatoDTO dto) {
        Contato contato = new Contato();
        contato.setNome(dto.getNome());
        contato.setEmail(dto.getEmail());
        contato.setCelular(dto.getCelular());
        contato.setTelefone(dto.getTelefone());
        contato.setFavorito(dto.getFavorito() != null && dto.getFavorito() ? 'S' : 'N');
        contato.setAtivo(dto.getAtivo() != null && dto.getAtivo() ? 'S' : 'N');
        return contato;
    }

    private ContatoDTO converterParaDTO(Contato contato) {
        ContatoDTO dto = new ContatoDTO();
        dto.setId(contato.getId());
        dto.setNome(contato.getNome());
        dto.setEmail(contato.getEmail());
        dto.setCelular(contato.getCelular());
        dto.setTelefone(contato.getTelefone());
        dto.setFavorito(contato.getFavorito() == 'S');
        dto.setAtivo(contato.getAtivo() == 'S');
        dto.setDataCadastro(contato.getDataCadastro());
        return dto;
    }

    private void atualizarDadosContato(Contato contato, ContatoDTO dto) {
        contato.setNome(dto.getNome());
        contato.setEmail(dto.getEmail());
        contato.setCelular(dto.getCelular());
        contato.setTelefone(dto.getTelefone());
        if (dto.getFavorito() != null) {
            contato.setFavorito(dto.getFavorito() ? 'S' : 'N');
        }
        if (dto.getAtivo() != null) {
            contato.setAtivo(dto.getAtivo() ? 'S' : 'N');
        }
    }
} 