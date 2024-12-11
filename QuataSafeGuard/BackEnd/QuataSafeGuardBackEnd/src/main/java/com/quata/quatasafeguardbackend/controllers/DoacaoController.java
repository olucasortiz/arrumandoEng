package com.quata.quatasafeguardbackend.controllers;

import com.quata.quatasafeguardbackend.dto.doacao.DoacaoRequest;
import com.quata.quatasafeguardbackend.entities.*;
import com.quata.quatasafeguardbackend.repositories.DoacaoRepository;
import com.quata.quatasafeguardbackend.services.DoacaoService;
import com.quata.quatasafeguardbackend.services.DoadorService;
import com.quata.quatasafeguardbackend.services.ProdutoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@RestController
@RequestMapping(value = "api/doacoes")
public class DoacaoController {

    @Autowired
    private ProdutoService produtoService;

    @Autowired
    private DoadorService doadorService;

    @Autowired
    private DoacaoService doacaoService;
    @Autowired
    private DoacaoRepository doacaoRepository;

    @GetMapping("{id}")
    public ResponseEntity<Doacao> buscarDoacao(@PathVariable Long id) {
        Optional<Doacao> doacao = doacaoRepository.findById(id);
        if (doacao.isPresent()) {
            return ResponseEntity.ok(doacao.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<List<Doacao>> registrarDoacoes(@RequestBody List<DoacaoRequest> doacoesRequest) {
        System.out.println("Processando múltiplas doações:");
        doacoesRequest.forEach(doacao -> {
            System.out.println("Produto ID: " + doacao.getProdutoId());
            System.out.println("Quantidade: " + doacao.getQuantidade());
            System.out.println("CPF Doador: " + doacao.getCpfDoador());
            System.out.println("Data de Recebimento: " + doacao.getDataRecebimento());
        });

        try {
            List<Doacao> registros = doacaoService.registrarDoacoes(doacoesRequest);
            return ResponseEntity.ok(registros);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /*@PostMapping
    public ResponseEntity<String> registrarDoacao(
            @RequestParam String cpf,
            @RequestParam Long produtoId,
            @RequestParam int quantidade) {

        if (produtoId == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Produto ID não pode ser nulo.");
        }

        Doacao doacao = new Doacao();

        Caixa caixa = new Caixa();
        caixa.setId(3L); // Define o caixa com ID 3
        doacao.setCaixa(caixa);

        Funcionario funcionario = new Funcionario();
        funcionario.setIdFuncionario(1L); // Define o funcionário com ID 1
        doacao.setFuncionario(funcionario);

        Doador doador = doadorService.buscarPorCpf(cpf);
        if (doador == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Doador não encontrado.");
        }
        doacao.setDoador(doador);

        Produto produto = produtoService.getByIdProduto(produtoId);
        if (produto == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Produto não encontrado.");
        }

        // Associar o produto diretamente à doação
        doacao.setProduto(produto);

        // Atualizar o estoque do produto
        produtoService.adicionarEstoque(produtoId, quantidade);

        doacao.setData(LocalDate.now());
        doacao.setQuantidadeItens(quantidade);

        doacaoService.receberDoacaoDeRecursos(doacao);

        return ResponseEntity.ok("Doação registrada com sucesso!");
    }*/

    @GetMapping("/historico")
    public ResponseEntity<List<Doacao>> getHistoricoDoacoes() {
        List<Doacao> doacoes = doacaoService.getAllDoacoes();
        return ResponseEntity.ok(doacoes);
    }

    @PutMapping("/alterar/{id}")
    public ResponseEntity<Doacao> atualizarDoacao(
            @PathVariable Long id,
            @RequestParam Long produtoId,
            @RequestParam Integer quantidadeItens,
            @RequestParam String data) {
        try {
            LocalDate dataRecebimento = LocalDate.parse(data);
            Doacao doacaoAtualizada = doacaoService.atualizar(id, produtoId, quantidadeItens, dataRecebimento);
            return ResponseEntity.ok(doacaoAtualizada);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }


    @DeleteMapping("/deletar/{id}")
    public ResponseEntity<String> excluirDoacao(@PathVariable Long id) {
        try {
            doacaoService.excluirDoacao(id);
            return ResponseEntity.ok("Doação excluída com sucesso!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Erro ao excluir a doação.");
        }
    }


}
