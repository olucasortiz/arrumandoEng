document.addEventListener("DOMContentLoaded", function () {
    carregarProdutos();
    carregarHistoricoDoacoes();
});

// Função para carregar os produtos do backend
function carregarProdutos() {
    console.log("Carregando lista de produtos...");

    fetch("http://localhost:8080/api/produto/get-all-produto", {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    })
        .then(response => response.json())
        .then(data => {
            console.log("Produtos carregados:", data);

            const produtoSelect = document.getElementById("produto");

            if (Array.isArray(data)) {
                data.forEach(produto => {
                    const option = document.createElement("option");
                    option.value = produto.idProduto;  // Usando idProduto como valor
                    option.textContent = `${produto.nomeProduto} (${produto.quantidadeEstoque} disponíveis)`;  // Exibe nome e quantidade
                    produtoSelect.appendChild(option);
                });
            } else {
                console.error("Erro: Dados de produtos não são um array:", data);
            }
        })
        .catch(error => {
            console.error("Erro ao carregar produtos:", error);
        });
}

function buscarDoadorPorCpf(cpf) {
    return fetch(`http://localhost:8080/api/doadores/${cpf}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Doador não encontrado");
            }
            return response.json();  // Isso vai retornar os dados do doador
        })
        .catch(error => {
            console.error("Erro ao buscar doador:", error);
            throw new Error("Doador não encontrado");
        });
}


function carregarHistoricoDoacoes() {
    fetch("http://localhost:8080/api/doacoes/historico", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const historicoTableBody = document.getElementById("historicoTabela").getElementsByTagName('tbody')[0];

            // Limpar a tabela antes de adicionar os novos dados
            historicoTableBody.innerHTML = '';

            data.forEach(doacao => {
                const row = historicoTableBody.insertRow();

                let produtoNome = "N/A";
                let quantidade = "N/A";
                let valor = doacao.valor || "N/A";
                let nomeDoador = doacao.doador ? doacao.doador.nome : "Doador desconhecido";
                let cpfDoador = doacao.doador ? doacao.doador.cpf : "CPF desconhecido";
                let funcionarioNome = doacao.funcionario ? doacao.funcionario.nome : "Funcionário desconhecido";

                // Verificar se itensDoacao existe
                produtoNome = doacao?.produto?.nomeProduto || "Produto desconhecido";
                quantidade = doacao.quantidadeItens || "Quantidade desconhecida";

                // Adicionar as células com dados
                row.insertCell(0).textContent = new Date(doacao.data).toLocaleDateString({ language: 'pt-br' });
                row.insertCell(1).textContent = `${nomeDoador} (CPF: ${cpfDoador})`;
                row.insertCell(2).textContent = produtoNome;
                row.insertCell(3).textContent = quantidade;
                row.insertCell(4).textContent = !isNaN(valor) ? `R$ ${valor}` : valor;
                row.insertCell(5).textContent = funcionarioNome;

                // Coluna de Ações
                const actionsCell = row.insertCell(6);

                // Botão de Alterar
                const alterarBtn = document.createElement("button");
                alterarBtn.classList.add("btn", "btn-warning", "btn-sm", "me-2");
                alterarBtn.textContent = "Alterar";
                alterarBtn.onclick = () => alterarDoacao(doacao.idDoacao);  // Passa o id da doação para alteração

                // Botão de Remover
                const removerBtn = document.createElement("button");
                removerBtn.classList.add("btn", "btn-danger", "btn-sm");
                removerBtn.textContent = "Remover";
                removerBtn.onclick = () => excluirDoacao(doacao.idDoacao);  // Passa o id da doação para remoção

                // Adicionar os botões na célula de ações
                actionsCell.appendChild(alterarBtn);
                actionsCell.appendChild(removerBtn);
            });
        })
        .catch(error => {
            console.error("Erro ao carregar histórico de doações:", error);
        });
}

function alterarDoacao(id) {
    // Exibir o modal de alteração
    const modal = new bootstrap.Modal(document.getElementById('alterarDoacaoModal'));
    modal.show();

    // Carregar os dados da doação para o modal
    fetch(`http://localhost:8080/api/doacoes/alterar/${id}`)
        .then(response => response.json())
        .then(data => {
            // Preenche os valores no formulário com os dados da doação
            document.getElementById('modalProduto').value = data.produto.idProduto;
            document.getElementById('novaQuantidadeInput').value = data.quantidadeItens;
        })
        .catch(error => {
            console.error("Erro ao carregar dados da doação:", error);
            alert("Erro ao carregar dados da doação.");
        });

    // Submeter o formulário de alteração
    document.getElementById("formAlterarDoacao").onsubmit = function (event) {
        event.preventDefault();

        const novaQuantidade = document.getElementById("novaQuantidadeInput").value;
        const produtoId = document.getElementById("modalProduto").value;

        // Verificar se os campos estão preenchidos corretamente
        if (!novaQuantidade || !produtoId) {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        const url = `http://localhost:8080/api/doacoes/alterar/${id}`;

        const doacaoAtualizada = {
            produto: { id: produtoId },
            quantidadeItens: novaQuantidade
        };

        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(doacaoAtualizada)
        })
            .then(response => response.json())
            .then(data => {
                if (data) {
                    alert('Doação atualizada com sucesso!');
                    modal.hide(); // Fechar o modal
                    carregarHistoricoDoacoes(); // Atualizar o histórico após a alteração
                }
            })
            .catch(error => {
                alert('Erro ao atualizar a doação');
                console.error(error);
            });
    };
}

function excluirDoacao(id) {
    const url = `http://localhost:8080/api/doacoes/deletar/${id}`;

    fetch(url, {
        method: 'DELETE'
    })
        .then(response => {
            console.log(response); // Verifique a resposta no console
            if (response.ok) {
                alert('Doação excluída com sucesso!');
                carregarHistoricoDoacoes(); // Atualiza o histórico após a exclusão
            } else {
                alert('Erro ao excluir a doação');
            }
        })
        .catch(error => {
            alert('Erro ao excluir a doação');
            console.error(error);
        });
}
document.getElementById("doacaoForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const cpf = document.getElementById("cpf").value.trim();  // Captura o CPF do doador
    const produtoId = document.getElementById("produto").value;
    const quantidade = document.getElementById("quantidade").value;
    const dataSaida = document.getElementById('dataSaida').value;
    // Validação simples
    if (!cpf || !produtoId || !quantidade || quantidade <= 0) {
        alert("Por favor, preencha todos os campos corretamente.");
        return;
    }

    // Buscar doador pelo CPF
    buscarDoadorPorCpf(cpf)
        .then(() => {
            // Montar URL com os parâmetros da requisição
            const url = `http://localhost:8080/api/doacoes?cpf=${cpf}&produtoId=${produtoId}&quantidade=${quantidade}&dataSaida=${dataSaida}`;

            // Fazer a requisição
            fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                }
            })
                .then(response => {
                    console.log("Resposta do servidor:", response);
                    if (!response.ok) {
                        console.error("Erro na resposta do servidor:", response.status, response.statusText);
                        throw new Error("Erro ao registrar doação");
                    }
                    return response.text(); // Para capturar a mensagem de sucesso do servidor
                })
                .then(message => {
                    console.log("Mensagem do servidor:", message);

                    // Exibir a mensagem clicável para agendar a entrega
                    document.getElementById("mensagemAgendar").style.display = "block";

                    // Resetar o formulário e carregar histórico de doações
                    document.getElementById("doacaoForm").reset();
                    carregarHistoricoDoacoes();
                })
                .catch(error => {
                    console.error("Erro ao registrar doação:", error);
                    alert("Erro ao registrar doação: " + error.message);
                });
        })
        .catch(error => {
            alert("Erro: " + error.message);
        });
});

