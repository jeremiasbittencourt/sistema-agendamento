package sistema_agendamento.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import sistema_agendamento.entity.Contato;

import java.util.List;
import java.util.Optional;

@Repository
public interface ContatoRepository extends JpaRepository<Contato, Long> {

    @Query("SELECT c FROM Contato c WHERE c.celular = :celular AND c.id != :id")
    Optional<Contato> findByCelularExcludingId(@Param("celular") String celular, @Param("id") Long id);

    @Query("SELECT c FROM Contato c WHERE c.celular = :celular")
    Optional<Contato> findByCelular(@Param("celular") String celular);

    @Query("SELECT c FROM Contato c WHERE c.ativo = 'S' ORDER BY c.nome")
    List<Contato> findAllAtivos();

    @Query("SELECT c FROM Contato c WHERE c.favorito = 'S' AND c.ativo = 'S' ORDER BY c.nome")
    List<Contato> findAllFavoritos();

    @Query("SELECT c FROM Contato c WHERE c.ativo = 'S' AND (LOWER(c.nome) LIKE LOWER(CONCAT('%', :termo, '%')) OR c.celular LIKE CONCAT('%', :termo, '%')) ORDER BY c.nome")
    List<Contato> buscarPorTermo(@Param("termo") String termo);
} 