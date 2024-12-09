
package com.quata.quatasafeguardbackend.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Agenda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idAgenda;

    private Date dataHora; // Data e hora do agendamento
    private String motivo; // Informações adicionais (ex: "Nome do animal")

    @ManyToOne
    @JoinColumn(name = "funcionario_id")
    private Funcionario funcionario;


    @ManyToOne
    @JoinColumn(name = "doador_id") // Relacionamento com Doador
    private Doador doador;

    @ManyToOne
    @JoinColumn(name = "animal_id") // Relacionamento com Animal
    private Animal animal;

    private String carteiraVacinaPath; // Caminho da carteira de vacinação
}
