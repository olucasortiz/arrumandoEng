package com.quata.quatasafeguardbackend;

public class ValidadorDeCnpj {

    public static boolean isValid(String cnpj) {
        if (cnpj == null || cnpj.length() != 14 || cnpj.matches("(\\d)\\1{13}")) {
            return false;
        }

        try {
            int[] pesosPrimeiroDigito = {5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2};
            int[] pesosSegundoDigito = {6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2};

            char digito13 = calcularDigito(cnpj, pesosPrimeiroDigito);
            char digito14 = calcularDigito(cnpj, pesosSegundoDigito);

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
}
