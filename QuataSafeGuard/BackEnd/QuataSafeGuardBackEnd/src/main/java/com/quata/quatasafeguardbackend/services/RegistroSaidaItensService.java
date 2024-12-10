package com.quata.quatasafeguardbackend.services;

import com.quata.quatasafeguardbackend.dto.registroSaida.RegistroSaidaRequest;
import com.quata.quatasafeguardbackend.entities.Produto;
import com.quata.quatasafeguardbackend.entities.RegistroSaidaItens;
import com.quata.quatasafeguardbackend.repositories.RegistroSaidaItensRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RegistroSaidaItensService {

    @Autowired
    private RegistroSaidaItensRepository registroSaidaItensRepository;

    @Autowired
    private ProdutoService produtoService;

    // Registrar saída de estoque

    public List<RegistroSaidaItens> registrarSaidas(List<RegistroSaidaRequest> saidasRequest) {
        return saidasRequest.stream().map(saidaRequest -> {
            Produto produto = produtoService.getByIdProduto(saidaRequest.getIdProduto());

            if (produto.getQuantidadeEstoque() < saidaRequest.getQuantidade()) {
                throw new IllegalArgumentException("Estoque insuficiente para o produto: " + produto.getNomeProduto());
            }

            produtoService.reduzirEstoque(produto.getIdProduto(), saidaRequest.getQuantidade());

            RegistroSaidaItens registro = new RegistroSaidaItens();
            registro.setDataSaida(saidaRequest.getDataSaida());
            registro.setProduto(produto);
            registro.setQtde(saidaRequest.getQuantidade());
            registro.setMotivo(saidaRequest.getMotivo());

            return registroSaidaItensRepository.save(registro);
        }).collect(Collectors.toList());
    }


    public Optional<RegistroSaidaItens> buscarPorId(Long id) {
        return registroSaidaItensRepository.findById(id);
    }

    public List<RegistroSaidaItens> listarSaidas() {
        return registroSaidaItensRepository.findAll();
    }

    public List<RegistroSaidaItens> listarSaidasPorProduto(Long idProduto) {
        Produto produto = produtoService.atualizarEstoque(idProduto, 0);  // Simples chamada para garantir que o produto existe
        return registroSaidaItensRepository.findByProduto(produto);
    }

    public void deletarSaida(Long id) {
        RegistroSaidaItens registro = registroSaidaItensRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Registro de saída não encontrado."));

        Produto produto = registro.getProduto();

        int novaQuantidadeEstoque = produto.getQuantidadeEstoque() + registro.getQtde();
        if (novaQuantidadeEstoque < 0) {
            throw new IllegalArgumentException("Não é possível restaurar a quantidade de estoque para um valor negativo.");
        }
        produtoService.reduzirEstoque(produto.getIdProduto(), registro.getQtde());
        registroSaidaItensRepository.delete(registro);
    }


    public RegistroSaidaItens atualizarSaida(Long id, Integer novaQuantidade, String novoMotivo) {
        RegistroSaidaItens registro = registroSaidaItensRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Registro de saída não encontrado."));
        Produto produto = registro.getProduto();
        produtoService.adicionarEstoque(produto.getIdProduto(), registro.getQtde());
        produtoService.reduzirEstoque(produto.getIdProduto(), novaQuantidade);
        registro.setQtde(novaQuantidade);
        registro.setMotivo(novoMotivo);
        return registroSaidaItensRepository.save(registro);
    }
}
