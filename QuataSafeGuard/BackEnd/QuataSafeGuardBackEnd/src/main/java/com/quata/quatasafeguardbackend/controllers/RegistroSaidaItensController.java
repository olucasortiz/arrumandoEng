package com.quata.quatasafeguardbackend.controllers;

import com.quata.quatasafeguardbackend.entities.RegistroSaidaItens;
import com.quata.quatasafeguardbackend.services.RegistroSaidaItensService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/saida-estoque")
public class RegistroSaidaItensController {

    @Autowired
    private RegistroSaidaItensService registroSaidaItensService;
    @PostMapping
    public ResponseEntity<RegistroSaidaItens> registrarSaida(
            @RequestParam Long idProduto,
            @RequestParam Integer quantidade,
            @RequestParam(required = false) String motivo) {
        try {
            RegistroSaidaItens registro = registroSaidaItensService.registrarSaida(idProduto, quantidade, motivo);
            return ResponseEntity.ok(registro);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<RegistroSaidaItens>> listarSaidas() {
        List<RegistroSaidaItens> saidas = registroSaidaItensService.listarSaidas();

        if (saidas.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(saidas);
    }

    @GetMapping("/produto/{idProduto}")
    public ResponseEntity<List<RegistroSaidaItens>> listarSaidasPorProduto(@PathVariable Long idProduto) {
        List<RegistroSaidaItens> saidas = registroSaidaItensService.listarSaidasPorProduto(idProduto);

        if (saidas.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(saidas);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarSaida(@PathVariable Long id) {
        try {
            registroSaidaItensService.deletarSaida(id);
            return ResponseEntity.noContent().build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }
    @PutMapping("/{id}")
    public ResponseEntity<RegistroSaidaItens> atualizarSaida(
            @PathVariable Long id,
            @RequestParam Integer novaQuantidade,
            @RequestParam(required = false) String novoMotivo) {

        try {
            RegistroSaidaItens updatedRegistro = registroSaidaItensService.atualizarSaida(id, novaQuantidade, novoMotivo);
            return ResponseEntity.ok(updatedRegistro);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

}