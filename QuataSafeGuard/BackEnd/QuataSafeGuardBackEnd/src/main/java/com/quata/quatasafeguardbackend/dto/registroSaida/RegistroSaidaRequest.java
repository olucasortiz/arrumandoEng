package com.quata.quatasafeguardbackend.dto.registroSaida;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDate;

public class RegistroSaidaRequest {
    @JsonProperty("produtoId")
    private Long idProduto;
    private Integer quantidade;
    private String motivo;
    private LocalDate dataSaida;

    // Getters e Setters
    public Long getIdProduto() {
        return idProduto;
    }

    public void setIdProduto(Long idProduto) {
        this.idProduto = idProduto;
    }

    public Integer getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(Integer quantidade) {
        this.quantidade = quantidade;
    }

    public String getMotivo() {
        return motivo;
    }

    public void setMotivo(String motivo) {
        this.motivo = motivo;
    }

    public LocalDate getDataSaida() {
        return dataSaida;
    }

    public void setDataSaida(LocalDate dataSaida) {
        this.dataSaida = dataSaida;
    }
}
