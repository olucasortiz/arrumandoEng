package com.quata.quatasafeguardbackend.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.web.csrf.CsrfToken;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Funcionario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idFuncionario;
    private String nome;
    private String cpf;
    private String cargo;
    private Double salario;
    private String permissoes;
    private String login;
    private String senha;

    @OneToMany(mappedBy = "funcionario")
    private List<Agenda> agendas;

    @OneToMany(mappedBy = "funcionario")
    @JsonIgnore
    private List<Doacao> doacoes;

    @OneToMany(mappedBy = "funcionario")
    private List<Recebimento> recebimentos;

    @ManyToOne
    @JoinColumn(name = "caixa_id")
    private Caixa caixa;
}