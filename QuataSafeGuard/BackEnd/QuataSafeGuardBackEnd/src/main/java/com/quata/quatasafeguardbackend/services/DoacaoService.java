package com.quata.quatasafeguardbackend.services;

import com.quata.quatasafeguardbackend.dto.doacao.DoacaoRequest;
import com.quata.quatasafeguardbackend.entities.*;
import com.quata.quatasafeguardbackend.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Local;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class DoacaoService {

    @Autowired
    private DoacaoRepository doacaoRepository;

    @Autowired
    private ProdutoService produtoService;

    @Autowired
    private FuncionarioRepository funcionarioRepository;

    @Autowired
    private CaixaRepository caixaRepository;

    @Autowired
    private DoadorService doadorService;
    //lucas ortiz - registrar doacao recursos
    /*public Doacao receberDoacaoDeRecursos(Doacao doacao) {
        if (doacao.getCaixa() != null && doacao.getCaixa().getId() != null) {
            Caixa caixa = caixaRepository.findById(doacao.getCaixa().getId())
                    .orElseThrow(() -> new NoSuchElementException("Caixa não encontrado"));
            doacao.setCaixa(caixa);
        }
        if (doacao.getFuncionario() != null && doacao.getFuncionario().getIdFuncionario() != null) {
            Funcionario funcionario = funcionarioRepository.findById(doacao.getFuncionario().getIdFuncionario())
                    .orElseThrow(() -> new NoSuchElementException("Funcionario não encontrado"));
            doacao.setFuncionario(funcionario);
        }
        doacao.setData(LocalDate.now());
        /*
        for (Item item : doacao.getItensDoacao()) {
            Produto produto = produtoRepository.findById(item.getProduto().getIdProduto())
                    .orElseThrow(() -> new NoSuchElementException("Produto não encontrado"));

            produto.setQuantidadeEstoque(produto.getQuantidadeEstoque() + item.getQtde());
            produtoRepository.save(produto);
            item.setDoacao(doacao);
        }

        return doacaoRepository.save(doacao);
    }*/

    public List<Doacao> registrarDoacoes(List<DoacaoRequest> doacoesRequest) {
        return doacoesRequest.stream().map(doacaoRequest -> {
            Doador doador = doadorService.buscarPorCpf(doacaoRequest.getCpfDoador());
            if (doador == null) {
                throw new NoSuchElementException("Doador não encontrado: " + doacaoRequest.getCpfDoador());
            }
            Produto produto = produtoService.getByIdProduto(doacaoRequest.getProdutoId());
            if (produto == null) {
                throw new NoSuchElementException("Produto não encontrado: " + doacaoRequest.getProdutoId());
            }
            produtoService.adicionarEstoque(produto.getIdProduto(), doacaoRequest.getQuantidade());
            Doacao doacao = new Doacao();
            doacao.setDoador(doador);
            doacao.setProduto(produto);
            doacao.setQuantidadeItens(doacaoRequest.getQuantidade());
            doacao.setData(doacaoRequest.getDataRecebimento());
            doacao.setCaixa(
                    caixaRepository.findById(3L)
                            .orElseThrow(() -> new NoSuchElementException("Caixa não encontrado"))
            );
            doacao.setFuncionario(
                    funcionarioRepository.findById(1L)
                            .orElseThrow(() -> new NoSuchElementException("Funcionário não encontrado"))
            );
            return doacaoRepository.save(doacao);
        }).collect(Collectors.toList());
    }


    public List<Doacao> getAllDoacoes() {
        return doacaoRepository.findAll();
    }


    public Doacao atualizar(Long doacaoId, Long produtoId, Integer quantidadeItens, LocalDate dataRecebimento) {
        Doacao doacaoExistente = doacaoRepository.findById(doacaoId)
                .orElseThrow(() -> new NoSuchElementException("Doação não encontrada"));

        Produto produto = produtoService.getByIdProduto(produtoId);
        if (produto == null) {
            throw new NoSuchElementException("Produto não encontrado");
        }

        doacaoExistente.setProduto(produto);
        doacaoExistente.setQuantidadeItens(quantidadeItens);
        doacaoExistente.setData(dataRecebimento);

        return doacaoRepository.save(doacaoExistente);
    }


    public void excluirDoacao(Long doacaoId) {
        Doacao doacao = doacaoRepository.findById(doacaoId)
                .orElseThrow(() -> new NoSuchElementException("Doação não encontrada"));
        Produto produto = doacao.getProduto();
        produto.setQuantidadeEstoque(produto.getQuantidadeEstoque() + doacao.getQuantidadeItens());
        produtoService.saveProduto(produto);
        doacaoRepository.delete(doacao);
    }





}
