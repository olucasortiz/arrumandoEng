package com.quata.quatasafeguardbackend.services;

import com.quata.quatasafeguardbackend.entities.Doador;
import com.quata.quatasafeguardbackend.repositories.DoadorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DoadorService {

    @Autowired
    private DoadorRepository doadorRepository;

    public Doador buscarPorCpf(String cpf) {
        return doadorRepository.findByCpf(cpf);
    }
}
