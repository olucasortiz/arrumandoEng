package com.quata.quatasafeguardbackend.repositories;

import com.quata.quatasafeguardbackend.entities.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {
}
