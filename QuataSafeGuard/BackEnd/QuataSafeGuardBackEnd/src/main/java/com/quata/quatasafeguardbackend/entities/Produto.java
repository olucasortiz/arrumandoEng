package com.quata.quatasafeguardbackend.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Produto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idProduto;
    private String nomeProduto;
    private String descricaoProduto;
    private Integer quantidadeEstoque;

    @OneToMany(mappedBy = "produto",fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Item> itens;
    @JsonBackReference
    @OneToMany(mappedBy = "produto")
    private List<RegistroSaidaItens> registroSaidaItens;

}
