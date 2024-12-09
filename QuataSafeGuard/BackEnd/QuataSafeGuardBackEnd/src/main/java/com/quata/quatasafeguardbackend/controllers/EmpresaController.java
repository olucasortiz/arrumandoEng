package com.quata.quatasafeguardbackend.controllers;

import com.quata.quatasafeguardbackend.dto.empresa.DetalhesEmpresaDTO;
import com.quata.quatasafeguardbackend.dto.empresa.VerificaParametrizacaoDTO;
import com.quata.quatasafeguardbackend.entities.empresa_parametrizacao.Empresa;
import com.quata.quatasafeguardbackend.services.EmpresaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.NoSuchElementException;

@RestController
@RequestMapping(value = "api/empresa")
public class EmpresaController {
    //lucas ortiz
    @Autowired
    private EmpresaService empresaService;

    @GetMapping(value = "get-empresa/{id}")
    public ResponseEntity<Empresa> getEmpresa(@PathVariable Long id) {
        Empresa empresa = empresaService.getEmpresaById(id);
        return ResponseEntity.ok().body(empresa);
    }

    @PostMapping(value = "create-empresa")
    public ResponseEntity<Object> createEmpresa(@RequestBody Empresa empresa) {
        Empresa empresa1 = empresaService.saveEmpresa(empresa);
        return ResponseEntity.ok().body(empresa1);
    }

    @PutMapping(value="update-empresa")
    public ResponseEntity<Object> updateEmpresa(@RequestBody Empresa empresa) {
        Empresa empresa1 = empresaService.atualizarEmpresa(empresa);
        return ResponseEntity.ok().body(empresa1);
    }

    @GetMapping("/detalhes")
    public ResponseEntity<DetalhesEmpresaDTO> obterDetalhesEmpresa() {
        try {
            DetalhesEmpresaDTO detalhesEmpresa = empresaService.getDetalhesEmpresa();
            return ResponseEntity.ok(detalhesEmpresa);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/verifica-parametrizacao")
    public ResponseEntity<VerificaParametrizacaoDTO> verificarParametrizacao() {
        VerificaParametrizacaoDTO existe = empresaService.verificarParametrizacao();
        return ResponseEntity.ok(existe);
    }

    @DeleteMapping(value = "delete-empresa/{cnpj}")
    public ResponseEntity<Object> deleteEmpresa(@PathVariable String cnpj) {
        if (empresaService.deleteEmpresa(cnpj)) {
            return ResponseEntity.ok().body("Empresa excluída com sucesso");
        } else {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body("Erro ao excluir empresa");
        }
    }
}
