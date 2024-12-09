package com.quata.quatasafeguardbackend.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idItem;
    private Integer qtde;

    @ManyToOne
    @JoinColumn(name = "produtos_idProduto")
    @JsonBackReference
    private Produto produto;
}
