package com.quata.quatasafeguardbackend.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.persistence.criteria.CriteriaBuilder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Doador {
    @Id
    private String cpf;
    private String nome;
    private String email;
    private String telefone;
    private Integer idade;

    @JsonBackReference
    @OneToMany(mappedBy = "doador")
    private List<Doacao> doacoes;

    @OneToMany(mappedBy = "doador")
    private List<Recebimento> recebimentos;
}
