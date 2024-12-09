package com.quata.quatasafeguardbackend.repositories;

import com.quata.quatasafeguardbackend.entities.empresa_parametrizacao.Empresa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmpresaRepository extends JpaRepository<Empresa, Long> {
//lucas ortiz
    Optional<Empresa> findByCnpj(String cnpj);
    @Query("SELECT COUNT(e) > 0 FROM Empresa e")
    boolean existsAny();

    Empresa findFirstByOrderByIdDesc();
}