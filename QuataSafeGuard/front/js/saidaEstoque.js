// Quando a página carregar, chama a função para carregar os produtos e o histórico de saídas
document.addEventListener("DOMContentLoaded", function () {
    carregarProdutos();   // Carrega a lista de produtos no estoque
    carregarHistoricoSaidas(); // Carrega o histórico de saídas de estoque
});

// Função para carregar os produtos disponíveis no estoque
function carregarProdutos() {
    fetch("http://localhost:8080/api/produto/get-all-produto", {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    })
        .then(response => response.json())
        .then(data => {
            const produtoSelect = document.getElementById("produto");

            // Verifica se a resposta é um array
            if (Array.isArray(data)) {
                produtoSelect.innerHTML = ""
                data.forEach(produto => {
                    const option = document.createElement("option");
                    option.value = produto.idProduto;
                    option.textContent = `${produto.nomeProduto} (${produto.quantidadeEstoque} disponíveis)`;
                    produtoSelect.appendChild(option);
                });
            } else {
                console.error("Erro: Dados não são um array", data);
            }
        })
        .catch(error => {
            console.error("Erro ao carregar produtos:", error);
        });
}



// Função para carregar o histórico de saídas de estoque
function carregarHistoricoSaidas() {
    fetch("http://localhost:8080/api/saida-estoque", {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    })
        .then(response => response.json())
        .then(data => {
            const tabela = document.getElementById("historicoTabela").getElementsByTagName('tbody')[0];

            // Limpa a tabela antes de inserir novos dados
            tabela.innerHTML = '';

            // Insere as novas linhas na tabela com o histórico de saídas
            data.forEach(saida => {
                const row = tabela.insertRow();

                row.insertCell(0).textContent = saida.produto.idProduto;
                row.insertCell(1).textContent = saida.produto.nomeProduto;

                // Campo editável para quantidade
                const quantidadeCell = row.insertCell(2);
                const quantidadeInput = document.createElement("input");
                quantidadeInput.type = "number";
                quantidadeInput.value = saida.qtde;
                quantidadeInput.classList.add("form-control", "form-control-sm");
                quantidadeCell.appendChild(quantidadeInput);

                // Campo editável para motivo
                const motivoCell = row.insertCell(3);
                const motivoInput = document.createElement("input");
                motivoInput.type = "text";
                motivoInput.value = saida.motivo || "Sem motivo";
                motivoInput.classList.add("form-control", "form-control-sm");
                motivoCell.appendChild(motivoInput);

                row.insertCell(4).textContent = new Date(saida.dataSaida).toLocaleDateString('pt-BR');

                const actionsCell = row.insertCell(5); // Coluna de ações
                const salvarBtn = document.createElement("button");
                salvarBtn.classList.add("btn", "btn-success", "btn-sm", "me-2");
                salvarBtn.textContent = "Salvar";
                salvarBtn.onclick = () => salvarAlteracoes(saida.idRegistroSaidaItens, quantidadeInput.value, motivoInput.value);

                const removerBtn = document.createElement("button");
                removerBtn.classList.add("btn", "btn-danger", "btn-sm");
                removerBtn.textContent = "Remover";
                removerBtn.onclick = () => removerSaida(saida.idRegistroSaidaItens);

                // Adiciona os botões à célula
                actionsCell.appendChild(salvarBtn);
                actionsCell.appendChild(removerBtn);
            });
        })
        .catch(error => {
            console.error("Erro ao carregar histórico de saídas:", error);
        });
}
function alterarSaida(idRegistro) {
    // Exemplo de como poderia ser feita a alteração.
    // Na prática, você pode abrir um modal ou um formulário com os dados para edição.
    const novaQuantidade = prompt("Digite a nova quantidade:");
    const novoMotivo = prompt("Digite o novo motivo:");

    if (novaQuantidade && novoMotivo) {
        const url = `http://localhost:8080/api/saida-estoque/${idRegistro}?novaQuantidade=${novaQuantidade}&novoMotivo=${novoMotivo}`;

        fetch(url, {
            method: "PUT",
            headers: { "Content-Type": "application/json" }
        })
            .then(response => response.json())
            .then(data => {
                alert("Saída de estoque atualizada com sucesso!");
                carregarHistoricoSaidas();  // Atualiza o histórico após a alteração
            })
            .catch(error => {
                alert("Erro ao atualizar saída de estoque: " + error.message);
            });
    }
}

function removerSaida(id) {
    const url = `http://localhost:8080/api/saida-estoque/${id}`;

    fetch(url, {
        method: 'DELETE',
        headers: { "Content-Type": "application/json" }
    })
        .then(response => {
            if (response.ok) {
                alert("Saída de estoque excluída com sucesso!");
                carregarHistoricoSaidas();  // Atualiza o histórico
            } else {
                alert("Erro ao excluir saída de estoque.");
            }
        })
        .catch(error => {
            alert("Erro ao conectar com o servidor.");
            console.error(error);
        });
}
const salvarAlteracoes = async () => {
    const id = 10; // Substitua pelo ID correto
    const novaQuantidade = 5; // Nova quantidade
    const novoMotivo = "Atualização manual"; // Opcional

    try {
        const response = await fetch(`http://localhost:8080/api/saida-estoque/${id}?novaQuantidade=${novaQuantidade}&novoMotivo=${encodeURIComponent(novoMotivo)}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("Erro ao atualizar saída de estoque");
        }

        const data = await response.json();
        console.log("Atualização bem-sucedida:", data);
    } catch (error) {
        console.error(error);
    }
};