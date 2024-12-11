document.addEventListener("DOMContentLoaded", function () {
    const produtoSelect = document.getElementById("produto");
    const quantidadeInput = document.getElementById("quantidade");
    const cpfInput = document.getElementById("cpf");
    const dataInput = document.getElementById("data");
    const itensTabela = document.getElementById("itensTabela")?.querySelector("tbody");
    const adicionarDoacaoButton = document.getElementById("adicionarDoacao");
    const registrarDoacoesButton = document.getElementById("registrarDoacoes");
    const messageContainer = document.getElementById("messageContainer");
    const historicoTabela = document.getElementById("historicoTabela");
    const filtroDoadorInput = document.getElementById("filtroDoador");
    const ordenarDataAscButton = document.getElementById("ordenarDataAsc");
    const ordenarDataDescButton = document.getElementById("ordenarDataDesc");

    if (historicoTabela) {
        // Código específico para a página de histórico
        carregarHistoricoDoacoes();
    }

    if (itensTabela && adicionarDoacaoButton && registrarDoacoesButton) {
        // Código específico para a página de registro de doações

        let doacoes = []; // Lista para armazenar as doações adicionadas

        // Máscara para o campo de CPF
        if (cpfInput) {
            cpfInput.addEventListener("input", function () {
                let cpf = cpfInput.value.replace(/\D/g, ""); // Remove caracteres não numéricos
                if (cpf.length > 11) cpf = cpf.slice(0, 11); // Limita o tamanho a 11 dígitos

                // Formata o CPF (000.000.000-00)
                cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
                cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
                cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

                cpfInput.value = cpf;
            });
        }

        // Configurar a data máxima permitida no campo de data
        if (dataInput) {
            const hoje = new Date().toISOString().split("T")[0];
            dataInput.setAttribute("max", hoje);
        }



        // Função para carregar os produtos do backend
        function carregarProdutos() {
            fetch("http://localhost:8080/api/produto/get-all-produto", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            })
                .then((response) => response.json())
                .then((data) => {
                    if (produtoSelect) {
                        produtoSelect.innerHTML = "<option value=''>Selecione um Produto</option>";
                        data.forEach((produto) => {
                            const option = document.createElement("option");
                            option.value = produto.idProduto;
                            option.textContent = `${produto.nomeProduto} (${produto.quantidadeEstoque} disponíveis)`;
                            produtoSelect.appendChild(option);
                        });
                    }
                })
                .catch((error) => showMessage("Erro ao carregar produtos: " + error.message, "danger"));
        }

        // Função para exibir mensagens de feedback
        function showMessage(message, type = "success") {
            if (messageContainer) {
                messageContainer.textContent = message;
                messageContainer.className = `alert alert-${type}`;
                messageContainer.style.display = "block";

                // Esconde a mensagem após 5 segundos
                setTimeout(() => {
                    messageContainer.style.display = "none";
                }, 5000);
            } else {
                console.log(message);
            }
        }

        // Função para adicionar uma doação à tabela
        adicionarDoacaoButton.addEventListener("click", function () {
            const produtoId = parseInt(produtoSelect.value, 10);
            const produtoNome = produtoSelect.options[produtoSelect.selectedIndex]?.text.split(" (")[0];
            const quantidade = parseInt(quantidadeInput.value, 10);
            const data = dataInput.value;

            // Verifica se a data é maior que a atual
            if (new Date(data) > new Date()) {
                showMessage("A data não pode ser maior que hoje.", "danger");
                return;
            }

            if (!produtoId || !quantidade || quantidade <= 0 || !data) {
                showMessage("Preencha todos os campos corretamente.", "danger");
                return;
            }

            // Adicionar item à lista de doações
            const item = { produtoId, produtoNome, quantidade, data };
            doacoes.push(item);

            // Atualizar tabela
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${produtoNome}</td>
                <td>${quantidade}</td>
                <td>${data}</td>
                <td>
                    <button class="btn btn-danger btn-sm remover-item">Remover</button>
                </td>
            `;
            itensTabela.appendChild(row);

            // Evento de remoção
            row.querySelector(".remover-item").addEventListener("click", function () {
                doacoes = doacoes.filter((i) => i !== item);
                row.remove();
            });

            // Limpar campos
            quantidadeInput.value = "";
            dataInput.value = "";
            showMessage("Doação adicionada à lista.", "success");
        });

        // Função para registrar todas as doações
        registrarDoacoesButton.addEventListener("click", function () {
            if (doacoes.length === 0) {
                showMessage("Adicione pelo menos uma doação antes de registrar.", "danger");
                return;
            }

            const cpf = cpfInput.value.trim();
            if (!cpf) {
                showMessage("Informe o CPF do doador.", "danger");
                return;
            }

            // Criação do payload
            const payload = doacoes.map((item) => ({
                cpfDoador: cpf.replace(/\D/g, ""), // Remove a máscara do CPF
                produtoId: item.produtoId,
                quantidade: item.quantidade,
                dataRecebimento: item.data,
            }));

            // Envio para o backend
            fetch("http://localhost:8080/api/doacoes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Erro ao registrar doações.");
                    }
                    return response.json();
                })
                .then(() => {
                    showMessage("Doações registradas com sucesso!", "success");
                    itensTabela.innerHTML = "";
                    doacoes = [];
                    cpfInput.value = "";
                })
                .catch((error) => showMessage("Erro ao registrar doações: " + error.message, "danger"));
        });

        // Inicializar produtos
        carregarProdutos();
    }

    function exibirDoacoes(lista) {
        const historicoTableBody = historicoTabela.querySelector("tbody");
        historicoTableBody.innerHTML = "";

        if (lista.length === 0) {
            historicoTableBody.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center">Nenhuma doação encontrada.</td>
                </tr>`;
            return;
        }

        lista.forEach((doacao) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${new Date(doacao.data).toLocaleDateString()}</td>
                <td>${doacao.doador ? doacao.doador.nome : "Desconhecido"}</td>
                <td>${doacao.produto ? doacao.produto.nomeProduto : "Sem Produto"}</td>
                <td>${doacao.quantidadeItens}</td>`;
            historicoTableBody.appendChild(row);
        });
    }

    // Função para carregar histórico de doações
    function carregarHistoricoDoacoes() {
        fetch("http://localhost:8080/api/doacoes/historico", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        })
            .then((response) => response.json())
            .then((data) => {
                doacoes = data; // Salva as doações carregadas
                exibirDoacoes(doacoes); // Exibe as doações inicialmente
            })
            .catch((error) => {
                console.error("Erro ao carregar histórico:", error);
                const historicoTableBody = historicoTabela.querySelector("tbody");
                historicoTableBody.innerHTML = `
                    <tr>
                        <td colspan="4" class="text-center text-danger">Erro ao carregar histórico.</td>
                    </tr>`;
            });
    }
    filtroDoadorInput.addEventListener("input", function () {
        const filtro = filtroDoadorInput.value.toLowerCase();
        const doacoesFiltradas = doacoes.filter((doacao) =>
            doacao.doador?.nome.toLowerCase().includes(filtro)
        );
        exibirDoacoes(doacoesFiltradas);
    });

    // Ordenar por data crescente
    ordenarDataAscButton.addEventListener("click", function () {
        const doacoesOrdenadas = [...doacoes].sort((a, b) => new Date(a.data) - new Date(b.data));
        exibirDoacoes(doacoesOrdenadas);
    });

    // Ordenar por data decrescente
    ordenarDataDescButton.addEventListener("click", function () {
        const doacoesOrdenadas = [...doacoes].sort((a, b) => new Date(b.data) - new Date(a.data));
        exibirDoacoes(doacoesOrdenadas);
    });
    carregarHistoricoDoacoes();
});
