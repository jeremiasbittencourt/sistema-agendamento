package sistema_agendamento.repository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;
import sistema_agendamento.entity.Contato;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
class ContatoRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private ContatoRepository contatoRepository;

    @Test
    void findAllAtivos_DeveRetornarApenasContatosAtivos() {
        // Given
        Contato contatoAtivo = criarContato("João Silva", "11999999999", 'S');
        Contato contatoInativo = criarContato("Maria Santos", "11888888888", 'N');
        
        entityManager.persist(contatoAtivo);
        entityManager.persist(contatoInativo);
        entityManager.flush();

        // When
        List<Contato> contatosAtivos = contatoRepository.findAllAtivos();

        // Then
        assertEquals(1, contatosAtivos.size());
        assertEquals("João Silva", contatosAtivos.get(0).getNome());
        assertEquals('S', contatosAtivos.get(0).getAtivo());
    }

    @Test
    void findAllFavoritos_DeveRetornarApenasContatosFavoritos() {
        // Given
        Contato contatoFavorito = criarContato("João Silva", "11999999999", 'S');
        contatoFavorito.setFavorito('S');
        
        Contato contatoNaoFavorito = criarContato("Maria Santos", "11888888888", 'S');
        contatoNaoFavorito.setFavorito('N');
        
        entityManager.persist(contatoFavorito);
        entityManager.persist(contatoNaoFavorito);
        entityManager.flush();

        // When
        List<Contato> contatosFavoritos = contatoRepository.findAllFavoritos();

        // Then
        assertEquals(1, contatosFavoritos.size());
        assertEquals("João Silva", contatosFavoritos.get(0).getNome());
        assertEquals('S', contatosFavoritos.get(0).getFavorito());
    }

    @Test
    void findByCelular_QuandoCelularExiste_DeveRetornarContato() {
        // Given
        Contato contato = criarContato("João Silva", "11999999999", 'S');
        entityManager.persist(contato);
        entityManager.flush();

        // When
        Optional<Contato> resultado = contatoRepository.findByCelular("11999999999");

        // Then
        assertTrue(resultado.isPresent());
        assertEquals("João Silva", resultado.get().getNome());
        assertEquals("11999999999", resultado.get().getCelular());
    }

    @Test
    void findByCelular_QuandoCelularNaoExiste_DeveRetornarVazio() {
        // Given
        Contato contato = criarContato("João Silva", "11999999999", 'S');
        entityManager.persist(contato);
        entityManager.flush();

        // When
        Optional<Contato> resultado = contatoRepository.findByCelular("11888888888");

        // Then
        assertFalse(resultado.isPresent());
    }

    @Test
    void buscarPorTermo_DeveRetornarContatosComTermoSimilar() {
        // Given
        Contato contato1 = criarContato("João Silva", "11999999999", 'S');
        Contato contato2 = criarContato("João Santos", "11888888888", 'S');
        Contato contato3 = criarContato("Maria Silva", "11777777777", 'S');
        
        entityManager.persist(contato1);
        entityManager.persist(contato2);
        entityManager.persist(contato3);
        entityManager.flush();

        // When
        List<Contato> resultado = contatoRepository.buscarPorTermo("joão");

        // Then
        assertEquals(2, resultado.size());
        assertTrue(resultado.stream().allMatch(c -> c.getNome().toLowerCase().contains("joão")));
    }

    @Test
    void buscarPorTermo_DeveRetornarContatosPorCelular() {
        // Given
        Contato contato1 = criarContato("João Silva", "11999999999", 'S');
        Contato contato2 = criarContato("Maria Santos", "11888888888", 'S');
        
        entityManager.persist(contato1);
        entityManager.persist(contato2);
        entityManager.flush();

        // When
        List<Contato> resultado = contatoRepository.buscarPorTermo("11999999999");

        // Then
        assertEquals(1, resultado.size());
        assertEquals("11999999999", resultado.get(0).getCelular());
    }

    @Test
    void save_DeveSalvarContatoComSucesso() {
        // Given
        Contato contato = criarContato("João Silva", "11999999999", 'S');

        // When
        Contato contatoSalvo = contatoRepository.save(contato);

        // Then
        assertNotNull(contatoSalvo.getId());
        assertEquals("João Silva", contatoSalvo.getNome());
        assertEquals("11999999999", contatoSalvo.getCelular());
        assertNotNull(contatoSalvo.getDataCadastro());
    }

    @Test
    void findById_QuandoIdExiste_DeveRetornarContato() {
        // Given
        Contato contato = criarContato("João Silva", "11999999999", 'S');
        entityManager.persist(contato);
        entityManager.flush();

        // When
        Optional<Contato> resultado = contatoRepository.findById(contato.getId());

        // Then
        assertTrue(resultado.isPresent());
        assertEquals("João Silva", resultado.get().getNome());
    }

    @Test
    void findById_QuandoIdNaoExiste_DeveRetornarVazio() {
        // When
        Optional<Contato> resultado = contatoRepository.findById(999L);

        // Then
        assertFalse(resultado.isPresent());
    }

    @Test
    void delete_DeveRemoverContato() {
        // Given
        Contato contato = criarContato("João Silva", "11999999999", 'S');
        entityManager.persist(contato);
        entityManager.flush();

        // When
        contatoRepository.delete(contato);
        entityManager.flush();

        // Then
        Optional<Contato> resultado = contatoRepository.findById(contato.getId());
        assertFalse(resultado.isPresent());
    }

    private Contato criarContato(String nome, String celular, char ativo) {
        Contato contato = new Contato();
        contato.setNome(nome);
        contato.setCelular(celular);
        contato.setAtivo(ativo);
        contato.setFavorito('N');
        contato.setDataCadastro(LocalDateTime.now());
        return contato;
    }
}
