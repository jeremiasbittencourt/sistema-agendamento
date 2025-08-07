package sistema_agendamento.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import sistema_agendamento.dto.ContatoDTO;
import sistema_agendamento.service.ContatoService;
import sistema_agendamento.exception.GlobalExceptionHandler;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;

@ExtendWith(MockitoExtension.class)
class ContatoControllerTest {

    @Mock
    private ContatoService contatoService;

    @InjectMocks
    private ContatoController contatoController;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    private ContatoDTO contatoDTO;
    private List<ContatoDTO> contatos;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(contatoController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
        objectMapper = new ObjectMapper();

        contatoDTO = new ContatoDTO();
        contatoDTO.setId(1L);
        contatoDTO.setNome("João Silva");
        contatoDTO.setEmail("joao@email.com");
        contatoDTO.setCelular("11999999999");
        contatoDTO.setTelefone("1133333333");
        contatoDTO.setFavorito(true);
        contatoDTO.setAtivo(true);
        contatoDTO.setDataCadastro(LocalDateTime.now());

        contatos = Arrays.asList(contatoDTO);
    }

    @Test
    void listarTodos_DeveRetornarListaDeContatos() throws Exception {
        // Given
        when(contatoService.listarTodos()).thenReturn(contatos);

        // When & Then
        mockMvc.perform(get("/contatos"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].nome").value("João Silva"))
                .andExpect(jsonPath("$[0].celular").value("11999999999"));

        verify(contatoService).listarTodos();
    }

    @Test
    void listarFavoritos_DeveRetornarListaDeContatosFavoritos() throws Exception {
        // Given
        when(contatoService.listarFavoritos()).thenReturn(contatos);

        // When & Then
        mockMvc.perform(get("/contatos/favoritos"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].favorito").value(true));

        verify(contatoService).listarFavoritos();
    }

    @Test
    void buscarPorId_QuandoContatoExiste_DeveRetornarContato() throws Exception {
        // Given
        when(contatoService.buscarPorId(1L)).thenReturn(contatoDTO);

        // When & Then
        mockMvc.perform(get("/contatos/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.nome").value("João Silva"));

        verify(contatoService).buscarPorId(1L);
    }

    @Test
    void buscarPorId_QuandoContatoNaoExiste_DeveRetornarErro() throws Exception {
        // Given
        when(contatoService.buscarPorId(999L)).thenThrow(new RuntimeException("Contato não encontrado"));

        // When & Then
        mockMvc.perform(get("/contatos/999"))
                .andDo(print());

        verify(contatoService).buscarPorId(999L);
    }

    @Test
    void criar_QuandoDadosValidos_DeveCriarContato() throws Exception {
        // Given
        ContatoDTO novoContato = new ContatoDTO();
        novoContato.setNome("Maria Santos");
        novoContato.setCelular("11888888888");
        novoContato.setEmail("maria@email.com");

        when(contatoService.criar(any(ContatoDTO.class))).thenReturn(contatoDTO);

        // When & Then
        mockMvc.perform(post("/contatos")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(novoContato)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nome").value("João Silva"));

        verify(contatoService).criar(any(ContatoDTO.class));
    }

    @Test
    void criar_QuandoDadosInvalidos_DeveRetornar400() throws Exception {
        // Given
        ContatoDTO contatoInvalido = new ContatoDTO();
        // Sem nome e celular (campos obrigatórios)

        // When & Then
        mockMvc.perform(post("/contatos")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(contatoInvalido)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void atualizar_QuandoDadosValidos_DeveAtualizarContato() throws Exception {
        // Given
        ContatoDTO contatoAtualizado = new ContatoDTO();
        contatoAtualizado.setNome("João Silva Atualizado");
        contatoAtualizado.setCelular("11999999999");

        when(contatoService.atualizar(anyLong(), any(ContatoDTO.class))).thenReturn(contatoDTO);

        // When & Then
        mockMvc.perform(put("/contatos/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(contatoAtualizado)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nome").value("João Silva"));

        verify(contatoService).atualizar(1L, contatoAtualizado);
    }

    @Test
    void alternarFavorito_DeveAlternarStatusFavorito() throws Exception {
        // Given
        when(contatoService.alternarFavorito(1L)).thenReturn(contatoDTO);

        // When & Then
        mockMvc.perform(patch("/contatos/1/favorito"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.favorito").value(true));

        verify(contatoService).alternarFavorito(1L);
    }

    @Test
    void inativar_DeveInativarContato() throws Exception {
        // Given
        doNothing().when(contatoService).inativar(1L);

        // When & Then
        mockMvc.perform(delete("/contatos/1"))
                .andExpect(status().isNoContent());

        verify(contatoService).inativar(1L);
    }

    @Test
    void buscarPorTermo_DeveRetornarContatosFiltrados() throws Exception {
        // Given
        when(contatoService.buscarPorTermo("João")).thenReturn(contatos);

        // When & Then
        mockMvc.perform(get("/contatos/buscar")
                .param("termo", "João"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].nome").value("João Silva"));

        verify(contatoService).buscarPorTermo("João");
    }
}
