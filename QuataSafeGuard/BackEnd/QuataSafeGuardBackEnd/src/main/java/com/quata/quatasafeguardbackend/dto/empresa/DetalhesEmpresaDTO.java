package com.quata.quatasafeguardbackend.dto.empresa;

public record DetalhesEmpresaDTO(
        Long id,
        String nomeFantasia,
        String razaoSocial,
        String site,
        String email,
        String cnpj,
        String endereco,
        String bairro,
        String cidade,
        String uf,
        String cep,
        String telefone,
        String logoGrande,
        String logoPequeno,
        String dataCriacao
) {}
