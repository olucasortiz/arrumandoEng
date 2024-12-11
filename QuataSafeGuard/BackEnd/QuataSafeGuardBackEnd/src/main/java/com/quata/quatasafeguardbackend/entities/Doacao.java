package com.quata.quatasafeguardbackend.entities;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
@Entity
@Getter
@Setter
@NoArgsConstructor
public class Doacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idDoacao;

    @Column(nullable = false)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate data;

    private Double valor;

    private Integer quantidadeItens;

    @ManyToOne
    @JoinColumn(name = "produto_id", nullable = false)
    @JsonManagedReference // Garante que o Jackson processe essa relação corretamente
    private Produto produto;

    @ManyToOne
    @JoinColumn(name = "funcionario_id", nullable = false)
    @JsonManagedReference
    private Funcionario funcionario;

    @ManyToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "caixa_id")
    private Caixa caixa;

    @ManyToOne
    @JoinColumn(name = "doador_id")
    @JsonManagedReference
    private Doador doador;
}
