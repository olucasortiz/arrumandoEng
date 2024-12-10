document.addEventListener("DOMContentLoaded", function () {
    const tabela = document.querySelector("#saidaTable tbody");
    const form = document.getElementById("alterarForm");
    const messageContainer = document.getElementById("messageContainer");

    const idInput = document.getElementById("idSaida");
    const produtoSelect = document.getElementById("produto");
    const quantidadeInput = document.getElementById("quantidade");
    const motivoInput = document.getElementById("motivo");
    const dataSaidaInput = document.getElementById("dataSaida");

    // Exibir mensagens de sucesso ou erro
    function showMessage(message, type) {
        messageContainer.textContent = message;
        messageContainer.style.display = "block";
        messageContainer.className = `alert ${type === "success" ? "alert-success" : "alert-danger"}`;
        setTimeout(() => {
            messageContainer.style.display = "none";
        }, 5000);
    }

    // Carregar as saídas na tabela
    function carregarSaidas() {
        fetch("http://localhost:8080/api/saida-estoque")
            .then((response) => response.json())
            .then((saidas) => {
                console.log(saidas);
                tabela.innerHTML = ""; // Limpa a tabela
                saidas.forEach((saida) => {
                    const row = document.createElement("tr");
                    row.classList.add("table-row-clickable");
                    row.setAttribute("data-id", saida.id); // Adiciona o ID da saída na linha
                    row.innerHTML = `
                        <td>${saida.idRegistroSaidaItens}</td>
                        <td>${saida.produto.nomeProduto}</td>
                        <td>${saida.qtde}</td>
                        <td>${saida.motivo || "N/A"}</td>
                        <td>${saida.dataSaida}</td>
                    `;
                    tabela.appendChild(row);
                });

                // Adiciona evento de clique nas linhas
                document.querySelectorAll(".table-row-clickable").forEach((row) => {
                    row.addEventListener("click", function () {
                        const id = this.getAttribute("data-id");
                        if (confirm("Deseja alterar esta saída?")) {
                            carregarSaida(id);
                        }
                    });
                });
            })
            .catch((error) => {
                console.error("Erro ao carregar saídas:", error);
                showMessage("Erro ao carregar saídas.", "error");
            });
    }

    // Carregar os produtos para o select
    function carregarProdutos() {
        fetch("http://localhost:8080/api/produto/get-all-produto")
            .then((response) => response.json())
            .then((produtos) => {
                produtoSelect.innerHTML = ""; // Limpa o select
                produtos.forEach((produto) => {
                    const option = document.createElement("option");
                    option.value = produto.id;
                    option.textContent = produto.nome;
                    produtoSelect.appendChild(option);
                });
            })
            .catch((error) => console.error("Erro ao carregar produtos:", error));
    }

    // Carregar os dados de uma saída específica no formulário
    function carregarSaida(id) {
        fetch(`http://localhost:8080/api/saida-estoque/${id}`)
            .then((response) => response.json())
            .then((saida) => {
                // Preenche o formulário com os dados da saída
                idInput.value = saida.id;
                produtoSelect.value = saida.produto.id;
                quantidadeInput.value = saida.quantidade;
                motivoInput.value = saida.motivo || "";
                dataSaidaInput.value = saida.dataSaida;

                form.style.display = "block"; // Exibe o formulário
            })
            .catch((error) => {
                console.error("Erro ao carregar saída:", error);
                showMessage("Erro ao carregar dados da saída.", "error");
            });
    }

    // Submeter as alterações
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const id = idInput.value;
        const novaQuantidade = parseInt(quantidadeInput.value, 10);
        const novoMotivo = motivoInput.value;
        const novaDataSaida = dataSaidaInput.value;
        const idProduto = produtoSelect.value;

        // Validação
        if (!id || !idProduto || !novaQuantidade || !novaDataSaida) {
            showMessage("Todos os campos são obrigatórios.", "error");
            return;
        }

        const url = `http://localhost:8080/api/saida-estoque/${id}`;
        const params = new URLSearchParams();
        params.append("novaQuantidade", novaQuantidade);
        params.append("novoMotivo", novoMotivo);
        params.append("novaDataSaida", novaDataSaida);
        params.append("idProduto", idProduto);

        fetch(url + "?" + params.toString(), {
            method: "PUT",
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Erro ao atualizar saída.");
                }
                return response.json();
            })
            .then(() => {
                showMessage("Saída atualizada com sucesso!", "success");
                form.style.display = "none"; // Esconde o formulário
                carregarSaidas(); // Atualiza a tabela
            })
            .catch((error) => {
                console.error("Erro ao atualizar saída:", error);
                showMessage("Erro ao atualizar saída.", "error");
            });
    });

    // Inicializar
    carregarProdutos();
    carregarSaidas();
});
