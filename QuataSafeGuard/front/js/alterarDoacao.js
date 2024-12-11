document.addEventListener("DOMContentLoaded", function () {
    const tabela = document.querySelector("#doacaoTable tbody");
    const form = document.getElementById("alterarForm");
    const messageContainer = document.getElementById("messageContainer");

    const idInput = document.getElementById("idDoacao");
    const produtoSelect = document.getElementById("produto");
    const quantidadeInput = document.getElementById("quantidade");
    const dataRecebimentoInput = document.getElementById("dataRecebimento");

    // Exibir mensagens de sucesso ou erro
    function showMessage(message, type) {
        messageContainer.textContent = message;
        messageContainer.style.display = "block";
        messageContainer.className = `alert ${type === "success" ? "alert-success" : "alert-danger"}`;
        setTimeout(() => {
            messageContainer.style.display = "none";
        }, 5000);
    }

    // Carregar as doações na tabela
    function carregarDoacoes() {
        fetch("http://localhost:8080/api/doacoes/historico")
            .then((response) => response.json())
            .then((doacoes) => {
                console.log("Doações carregadas:", doacoes);
                tabela.innerHTML = ""; // Limpa a tabela
                doacoes.forEach((doacao) => {
                    const row = document.createElement("tr");
                    row.classList.add("table-row-clickable");
                    row.setAttribute("data-id", doacao.idDoacao);
                    row.innerHTML = `
                        <td>${doacao.idDoacao}</td>
                        <td>${doacao.produto?.nomeProduto || "Sem Produto"}</td>
                        <td>${doacao.quantidadeItens}</td>
                        <td>${new Date(doacao.data).toLocaleDateString()}</td>
                    `;
                    tabela.appendChild(row);
                });

                // Adiciona evento de clique nas linhas
                document.querySelectorAll(".table-row-clickable").forEach((row) => {
                    row.addEventListener("click", function () {
                        const id = this.getAttribute("data-id");
                        console.log("ID da linha clicada:", id);
                        carregarDoacao(id);
                    });
                });
            })
            .catch((error) => {
                console.error("Erro ao carregar doações:", error);
                showMessage("Erro ao carregar doações.", "error");
            });
    }

    // Carregar os produtos para o select
    function carregarProdutos() {
        fetch("http://localhost:8080/api/produto/get-all-produto")
            .then((response) => response.json())
            .then((produtos) => {
                produtoSelect.innerHTML = "<option value=''>Selecione um Produto</option>";
                produtos.forEach((produto) => {
                    const option = document.createElement("option");
                    option.value = produto.idProduto;
                    option.textContent = produto.nomeProduto;
                    produtoSelect.appendChild(option);
                });
            })
            .catch((error) => {
                console.error("Erro ao carregar produtos:", error);
                showMessage("Erro ao carregar produtos.", "error");
            });
    }

    // Carregar os dados de uma doação específica no formulário
    function carregarDoacao(id) {
        console.log(`Carregando doação com ID: ${id}`);
        fetch(`http://localhost:8080/api/doacoes/${id}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Falha ao carregar doação.");
                }
                return response.json();
            })
            .then((doacao) => {
                console.log("Doação carregada:", doacao);
                idInput.value = doacao.idDoacao;
                produtoSelect.value = doacao.produto.idProduto;
                quantidadeInput.value = doacao.quantidadeItens;
                dataRecebimentoInput.value = doacao.data.split("T")[0]; // Ajuste do formato da data

                form.style.display = "block";
            })
            .catch((error) => {
                console.error("Erro ao carregar doação:", error);
                showMessage("Erro ao carregar dados da doação.", "error");
            });
    }

    // Submeter as alterações
    form.addEventListener("submit", function (event) {
        event.preventDefault();
    
        const id = idInput.value;
        const novaQuantidade = parseInt(quantidadeInput.value, 10);
        const novaDataRecebimento = dataRecebimentoInput.value;
        const idProduto = produtoSelect.value;
    
        if (!id || !idProduto || !novaQuantidade || !novaDataRecebimento) {
            showMessage("Todos os campos são obrigatórios.", "error");
            return;
        }
    
        const url = `http://localhost:8080/api/doacoes/alterar/${id}`;
        const params = new URLSearchParams({
            produtoId: idProduto,
            quantidadeItens: novaQuantidade,
            data: novaDataRecebimento,
        });
    
        fetch(`${url}?${params.toString()}`, {
            method: "PUT",
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Erro ao atualizar doação.");
                }
                return response.json();
            })
            .then(() => {
                showMessage("Doação atualizada com sucesso!", "success");
                form.style.display = "none";
                carregarDoacoes();
            })
            .catch((error) => {
                console.error("Erro ao atualizar doação:", error);
                showMessage("Erro ao atualizar doação.", "error");
            });
    });
    
    

    // Inicializar
    carregarProdutos();
    carregarDoacoes();
});
