package com.quata.quatasafeguardbackend.services;

import com.quata.quatasafeguardbackend.entities.Produto;
import com.quata.quatasafeguardbackend.entities.RegistroSaidaItens;
import com.quata.quatasafeguardbackend.repositories.RegistroSaidaItensRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class RegistroSaidaItensService {

    @Autowired
    private RegistroSaidaItensRepository registroSaidaItensRepository;

    @Autowired
    private ProdutoService produtoService;

    // Registrar saída de estoque
    public RegistroSaidaItens registrarSaida(Long idProduto, Integer quantidade, String motivo) {
        Produto produto = produtoService.getByIdProduto(idProduto);
        if (produto.getQuantidadeEstoque() < quantidade) {
            throw new IllegalArgumentException("Estoque insuficiente para a saída.");
        }
        produtoService.reduzirEstoque(idProduto, quantidade);

        RegistroSaidaItens registro = new RegistroSaidaItens();
        registro.setProduto(produto);
        registro.setQtde(quantidade);
        registro.setMotivo(motivo);

        return registroSaidaItensRepository.save(registro);
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
        produtoService.adicionarEstoque(produto.getIdProduto(), registro.getQtde());
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
