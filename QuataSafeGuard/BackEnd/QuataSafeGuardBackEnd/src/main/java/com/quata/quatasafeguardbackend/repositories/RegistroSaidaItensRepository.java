package com.quata.quatasafeguardbackend.repositories;

import com.quata.quatasafeguardbackend.entities.Produto;
import com.quata.quatasafeguardbackend.entities.RegistroSaidaItens;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
//lucas ortiz
public interface RegistroSaidaItensRepository extends JpaRepository<RegistroSaidaItens,Long> {
    List<RegistroSaidaItens> findByProduto(Produto produto);
}
