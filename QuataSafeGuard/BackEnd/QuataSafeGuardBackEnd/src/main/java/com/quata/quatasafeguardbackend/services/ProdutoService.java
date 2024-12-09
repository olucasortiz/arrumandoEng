package com.quata.quatasafeguardbackend.services;

import com.quata.quatasafeguardbackend.entities.Produto;
import com.quata.quatasafeguardbackend.repositories.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;


@Service
public class ProdutoService {

    @Autowired
    private ProdutoRepository produtoRepository;

    public Produto atualizarEstoque(Long idProduto, Integer quantidade) {
        Produto produto = produtoRepository.findById(idProduto)
                .orElseThrow(() -> new NoSuchElementException("Produto não encontrado."));

        // Atualizando a quantidade no estoque
        produto.setQuantidadeEstoque(produto.getQuantidadeEstoque() + quantidade);
        return produtoRepository.save(produto);
    }

    public Produto reduzirEstoque(Long idProduto, Integer quantidade) {
        Produto produto = produtoRepository.findById(idProduto)
                .orElseThrow(() -> new NoSuchElementException("Produto não encontrado."));

        if (produto.getQuantidadeEstoque() < quantidade) {
            throw new IllegalArgumentException("Estoque insuficiente para a saída.");
        }
        produto.setQuantidadeEstoque(produto.getQuantidadeEstoque() - quantidade);
        return produtoRepository.save(produto);
    }

    public Produto adicionarEstoque(Long idProduto, Integer quantidade) {
        Produto produto = produtoRepository.findById(idProduto)
                .orElseThrow(() -> new NoSuchElementException("Produto não encontrado."));

        produto.setQuantidadeEstoque(produto.getQuantidadeEstoque() + quantidade);
        return produtoRepository.save(produto);
    }

    public Produto saveProduto(Produto produto) {
        return produtoRepository.save(produto);
    }

    public boolean deleteProduto(Long id) {
        try {
            produtoRepository.deleteById(id);
        } catch (Exception e)
        {
            return false;
        }
        return true;
    }

    public Produto alterarProduto(Long id,Produto produto) {
        Produto prod = this.produtoRepository.findById(id).orElse(null);
        if(prod != null)
        {
            prod.setNomeProduto(produto.getNomeProduto());
            prod.setDescricaoProduto(produto.getDescricaoProduto());
            prod.setItens(produto.getItens());
            prod.setQuantidadeEstoque(produto.getQuantidadeEstoque());
            prod.setRegistroSaidaItens(produto.getRegistroSaidaItens());
            return produtoRepository.save(prod);
        }
        return null;
    }

    public Produto getByIdProduto (Long id) {
        return produtoRepository.findById(id).orElseThrow(()-> new NoSuchElementException("Não encontrado"));
    }

    public List<Produto> getAllProdutos() {
        return produtoRepository.findAll();
    }
}
