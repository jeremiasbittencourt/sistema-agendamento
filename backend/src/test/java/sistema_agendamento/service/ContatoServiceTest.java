package sistema_agendamento.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import sistema_agendamento.dto.ContatoDTO;
import sistema_agendamento.entity.Contato;
import sistema_agendamento.repository.ContatoRepository;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ContatoServiceTest {

    @Mock
    private ContatoRepository contatoRepository;

    @InjectMocks
    private ContatoService contatoService;

    private Contato contato1;
    private Contato contato2;
    private ContatoDTO contatoDTO;

    @BeforeEach
    void setUp() {
        contato1 = new Contato();
        contato1.setId(1L);
        contato1.setNome("João Silva");
        contato1.setEmail("joao@email.com");
        contato1.setCelular("11999999999");
        contato1.setTelefone("1133333333");
        contato1.setFavorito('S');
        contato1.setAtivo('S');
        contato1.setDataCadastro(LocalDateTime.now());

        contato2 = new Contato();
        contato2.setId(2L);
        contato2.setNome("Maria Santos");
        contato2.setEmail("maria@email.com");
        contato2.setCelular("11888888888");
        contato2.setTelefone("1144444444");
        contato2.setFavorito('N');
        contato2.setAtivo('S');
        contato2.setDataCadastro(LocalDateTime.now());

        contatoDTO = new ContatoDTO();
        contatoDTO.setNome("Novo Contato");
        contatoDTO.setEmail("novo@email.com");
        contatoDTO.setCelular("11777777777");
        contatoDTO.setTelefone("1155555555");
        contatoDTO.setFavorito(false);
        contatoDTO.setAtivo(true);
    }

    @Test
    void listarTodos_DeveRetornarListaDeContatosAtivos() {
        // Given
        when(contatoRepository.findAllAtivos()).thenReturn(Arrays.asList(contato1, contato2));

        // When
        List<ContatoDTO> resultado = contatoService.listarTodos();

        // Then
        assertNotNull(resultado);
        assertEquals(2, resultado.size());
        assertEquals("João Silva", resultado.get(0).getNome());
        assertEquals("Maria Santos", resultado.get(1).getNome());
        verify(contatoRepository).findAllAtivos();
    }

    @Test
    void listarFavoritos_DeveRetornarListaDeContatosFavoritos() {
        // Given
        when(contatoRepository.findAllFavoritos()).thenReturn(Arrays.asList(contato1));

        // When
        List<ContatoDTO> resultado = contatoService.listarFavoritos();

        // Then
        assertNotNull(resultado);
        assertEquals(1, resultado.size());
        assertEquals("João Silva", resultado.get(0).getNome());
        assertTrue(resultado.get(0).getFavorito());
        verify(contatoRepository).findAllFavoritos();
    }

    @Test
    void buscarPorId_QuandoContatoExiste_DeveRetornarContato() {
        // Given
        when(contatoRepository.findById(1L)).thenReturn(Optional.of(contato1));

        // When
        ContatoDTO resultado = contatoService.buscarPorId(1L);

        // Then
        assertNotNull(resultado);
        assertEquals("João Silva", resultado.getNome());
        assertEquals("11999999999", resultado.getCelular());
        verify(contatoRepository).findById(1L);
    }

    @Test
    void buscarPorId_QuandoContatoNaoExiste_DeveLancarExcecao() {
        // Given
        when(contatoRepository.findById(999L)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(RuntimeException.class, () -> contatoService.buscarPorId(999L));
        verify(contatoRepository).findById(999L);
    }

    @Test
    void criar_QuandoCelularNaoExiste_DeveCriarContato() {
        // Given
        when(contatoRepository.findByCelular("11777777777")).thenReturn(Optional.empty());
        when(contatoRepository.save(any(Contato.class))).thenReturn(contato1);

        // When
        ContatoDTO resultado = contatoService.criar(contatoDTO);

        // Then
        assertNotNull(resultado);
        verify(contatoRepository).findByCelular("11777777777");
        verify(contatoRepository).save(any(Contato.class));
    }

    @Test
    void criar_QuandoCelularJaExiste_DeveLancarExcecao() {
        // Given
        when(contatoRepository.findByCelular("11777777777")).thenReturn(Optional.of(contato1));

        // When & Then
        assertThrows(RuntimeException.class, () -> contatoService.criar(contatoDTO));
        verify(contatoRepository).findByCelular("11777777777");
        verify(contatoRepository, never()).save(any(Contato.class));
    }

    @Test
    void alternarFavorito_DeveAlternarStatusFavorito() {
        // Given
        when(contatoRepository.findById(1L)).thenReturn(Optional.of(contato1));
        when(contatoRepository.save(any(Contato.class))).thenReturn(contato1);

        // When
        ContatoDTO resultado = contatoService.alternarFavorito(1L);

        // Then
        assertNotNull(resultado);
        verify(contatoRepository).findById(1L);
        verify(contatoRepository).save(any(Contato.class));
    }

    @Test
    void inativar_DeveInativarContato() {
        // Given
        when(contatoRepository.findById(1L)).thenReturn(Optional.of(contato1));
        when(contatoRepository.save(any(Contato.class))).thenReturn(contato1);

        // When
        contatoService.inativar(1L);

        // Then
        verify(contatoRepository).findById(1L);
        verify(contatoRepository).save(any(Contato.class));
    }
} 