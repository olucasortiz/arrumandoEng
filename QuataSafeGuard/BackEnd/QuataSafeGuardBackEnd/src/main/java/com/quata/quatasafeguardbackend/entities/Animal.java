package com.quata.quatasafeguardbackend.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Animal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String nome;
    private Integer idade;

    @ManyToOne
    @JoinColumn(name = "tipoAnimal_id")
    private TipoAnimal tipoAnimal;

    @OneToMany(mappedBy = "animal")
    private List<Agenda> agendas;

    @ManyToOne
    @JoinColumn(name = "carteira_vacina_id")
    private CarteiraVacina carteiraVacina;

}
