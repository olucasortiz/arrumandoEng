package com.quata.quatasafeguardbackend.entities.empresa_parametrizacao;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "parametrizacao")
public class Empresa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nome_fantasia", nullable = false)
    private String nomeFantasia;

    @Column(name = "razao_social", nullable = false)
    private String razaoSocial;

    @Column(name = "site")
    private String site;

    @Column(name = "email")
    private String email;

    @Column(name = "cnpj", unique = true)
    private String cnpj;

    @Column(name = "endereco")
    private String endereco;

    @Column(name = "bairro")
    private String bairro;

    @Column(name = "cidade")
    private String cidade;

    @Column(name = "uf")
    private String uf;

    @Column(name = "cep")
    private String cep;

    @Column(name = "tel")
    private String telefone;

    @Column(name = "logo_grande")
    private String logoGrande;

    @Column(name = "logo_pequeno")
    private String logoPequeno;

    @Column(name = "data_criacao", nullable = false)
    private LocalDate dataCriacao;

    public static boolean isCNPJ(String cnpj) {
        if (cnpj == null || cnpj.length() != 14 || cnpj.matches("(\\d)\\1{13}")) {//regex par a verificar se os digitos sao sequenciais
            return false;
        }

        try {
            int[] pesosPrimeiroDigito = {5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2};
            int[] pesosSegundoDigito = {6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2};

            //calcula o primeiro digito verificador
            char digito13 = calcularDigito(cnpj, pesosPrimeiroDigito);

            //calcula o segundo digito verificador
            char digito14 = calcularDigito(cnpj, pesosSegundoDigito);

            //compara os dígitos calculados com os fornecidos
            return digito13 == cnpj.charAt(12) && digito14 == cnpj.charAt(13);
        } catch (Exception e) {
            return false;
        }
    }

    private static char calcularDigito(String cnpj, int[] pesos) {
        int soma = 0;
        for (int i = 0; i < pesos.length; i++) {
            soma += (cnpj.charAt(i) - '0') * pesos[i];
        }
        int resto = soma % 11;
        return (resto < 2) ? '0' : (char) ((11 - resto) + '0');
    }
    public static String imprimeCNPJ(String cnpj) {
        if (cnpj == null || cnpj.length() != 14) {
            throw new IllegalArgumentException("CNPJ inválido: deve conter exatamente 14 dígitos.");
        }
        return String.format("%s.%s.%s/%s-%s",
                cnpj.substring(0, 2),
                cnpj.substring(2, 5),
                cnpj.substring(5, 8),
                cnpj.substring(8, 12),
                cnpj.substring(12, 14)
        );
    }
}

