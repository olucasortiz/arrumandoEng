package com.quata.quatasafeguardbackend.controllers;

import com.quata.quatasafeguardbackend.entities.Doador;
import com.quata.quatasafeguardbackend.services.DoadorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
@RequestMapping("/api")
@RestController
public class DoadorController {

    @Autowired
    private DoadorService doadorService;

    @GetMapping("/doadores/{cpf}")
    public ResponseEntity<Doador> buscarPorCpf(@PathVariable String cpf) {
        Doador doador = doadorService.buscarPorCpf(cpf);
        if (doador != null) {
            return ResponseEntity.ok(doador);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
