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
public class Pagamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idPagamento;

    @Temporal(TemporalType.DATE)
    private Date data;

    private Double valor;

    private String status;

    @ManyToOne
    @JoinColumn(name = "Funcionario_siFunc")
    private Funcionario funcionario;

    @ManyToOne
    @JoinColumn(name = "Agenda_idAgenda")
    private Agenda agenda;

    @ManyToOne
    @JoinColumn(name = "idDoacao")
    private Doacao doacao;

    @ManyToOne
    @JoinColumn(name = "idRecebimento")
    private Recebimento recebimento;
}