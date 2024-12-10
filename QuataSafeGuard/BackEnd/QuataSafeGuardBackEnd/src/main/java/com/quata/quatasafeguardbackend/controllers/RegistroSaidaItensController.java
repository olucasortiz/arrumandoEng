package com.quata.quatasafeguardbackend.controllers;
import com.quata.quatasafeguardbackend.dto.registroSaida.RegistroSaidaRequest;
import com.quata.quatasafeguardbackend.entities.RegistroSaidaItens;
import com.quata.quatasafeguardbackend.services.RegistroSaidaItensService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@RestController
@RequestMapping("/api/saida-estoque")
public class RegistroSaidaItensController {

    @Autowired
    private RegistroSaidaItensService registroSaidaItensService;

    @PostMapping
    public ResponseEntity<List<RegistroSaidaItens>> registrarSaidas(@RequestBody List<RegistroSaidaRequest> saidasRequest) {
        System.out.println("Iniciando processamento de múltiplas saídas:");
        saidasRequest.forEach(saida -> {
            System.out.println("Produto ID: " + saida.getIdProduto());
            System.out.println("Quantidade: " + saida.getQuantidade());
            System.out.println("Motivo: " + saida.getMotivo());
            System.out.println("Data de Saída: " + saida.getDataSaida());
        });

        try {
            List<RegistroSaidaItens> registros = registroSaidaItensService.registrarSaidas(saidasRequest);
            return ResponseEntity.ok(registros);
        } catch (IllegalArgumentException e) {
            System.out.println("Erro: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (NoSuchElementException e) {
            System.out.println("Erro: Produto não encontrado.");
            return ResponseEntity.notFound().build();
        }
    }



    @GetMapping("/{id}")
    public ResponseEntity<RegistroSaidaItens> buscarSaidaPorId(@PathVariable Long id) {
        Optional<RegistroSaidaItens> saida = registroSaidaItensService.buscarPorId(id);
        return saida.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
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