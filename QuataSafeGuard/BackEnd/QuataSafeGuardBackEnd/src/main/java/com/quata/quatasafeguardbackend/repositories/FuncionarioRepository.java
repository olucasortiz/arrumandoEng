package com.quata.quatasafeguardbackend.repositories;

import com.quata.quatasafeguardbackend.entities.Funcionario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FuncionarioRepository extends JpaRepository<Funcionario, Long> {
    Optional<Funcionario> findById(Long idFuncionario);

}
