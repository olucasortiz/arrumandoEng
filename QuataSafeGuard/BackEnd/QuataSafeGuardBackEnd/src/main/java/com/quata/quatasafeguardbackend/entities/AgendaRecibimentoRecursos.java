package com.quata.quatasafeguardbackend.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
@Getter
@Setter
@NoArgsConstructor
@Entity
public class AgendaRecibimentoRecursos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nomeDoador;
    private String cpfDoador;

    @Temporal(TemporalType.DATE)
    private Date dataVisita;

    private String endereco;

    private String status;

}
