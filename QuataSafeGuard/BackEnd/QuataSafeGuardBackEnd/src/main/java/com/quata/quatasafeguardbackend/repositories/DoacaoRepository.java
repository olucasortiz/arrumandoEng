package com.quata.quatasafeguardbackend.repositories;

import com.quata.quatasafeguardbackend.entities.Doacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DoacaoRepository extends JpaRepository<Doacao, Long> {
}
