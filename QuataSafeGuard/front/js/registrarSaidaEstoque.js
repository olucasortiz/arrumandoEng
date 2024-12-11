document.addEventListener("DOMContentLoaded", function () {
    const produtoSelect = document.getElementById("produto");
    const quantidadeInput = document.getElementById("quantidade");
    const motivoInput = document.getElementById("motivo");
    const dataSaidaInput = document.getElementById("dataSaida");
    const itensTabela = document.getElementById("itensTabela").querySelector("tbody");
    const registrarSaidaButton = document.getElementById("registrarSaida");

    let itensSaida = []; // Lista para armazenar os itens adicionados



    // Função para exibir mensagens de sucesso ou erro
    function showMessage(message, type) {
        const messageContainer = document.createElement("div");
        messageContainer.textContent = message;
        messageContainer.style.padding = "10px";
        messageContainer.style.marginTop = "10px";
        messageContainer.style.borderRadius = "5px";
        messageContainer.style.textAlign = "center";
        messageContainer.style.color = type === "success" ? "#155724" : "#721c24";
        messageContainer.style.backgroundColor = type === "success" ? "#d4edda" : "#f8d7da";
        messageContainer.style.border = type === "success" ? "1px solid #c3e6cb" : "1px solid #f5c6cb";

        document.body.insertBefore(messageContainer, document.body.firstChild);

        setTimeout(() => {
            messageContainer.remove();
        }, 5000);
    }


    function showFloatingMessage(message, type) {
        const container = document.getElementById("floatingMessageContainer");
    
        // Criação do elemento da mensagem
        const messageElement = document.createElement("div");
        messageElement.className = `floating-message ${type}`;
        messageElement.innerHTML = `
            <span>${message}</span>
            <button>&times;</button>
        `;
    
        // Adiciona evento para fechar a mensagem
        messageElement.querySelector("button").addEventListener("click", () => {
            messageElement.remove();
        });
    
        // Adiciona a mensagem ao contêiner
        container.appendChild(messageElement);
    
        // Remove a mensagem automaticamente após 5 segundos
        setTimeout(() => {
            messageElement.remove();
        }, 5000);
    }
    
    // Carregar produtos no select
    function carregarProdutos() {
        fetch("http://localhost:8080/api/produto/get-all-produto")
            .then((response) => response.json())
            .then((produtos) => {
                produtoSelect.innerHTML = ""; // Limpa o select
                produtos.forEach((produto) => {
                    const option = document.createElement("option");
                    option.value = produto.idProduto;
                    option.textContent = `${produto.nomeProduto} (${produto.quantidadeEstoque} disponíveis)`;
                    produtoSelect.appendChild(option);
                });
            })
            .catch((error) => console.error("Erro ao carregar produtos:", error));
    }

    // Adicionar produto à lista
    document.getElementById("adicionarProduto").addEventListener("click", function () {
        const produtoId = parseInt(produtoSelect.value, 10);
        const produtoTexto = produtoSelect.options[produtoSelect.selectedIndex].text;
        const produtoNome = produtoTexto.split(" (")[0];
        const estoqueDisponivel = parseInt(produtoTexto.match(/\((\d+) disponíveis\)/)[1], 10);
        const quantidade = parseInt(quantidadeInput.value, 10);
        const motivo = motivoInput.value;
        const dataSaida = dataSaidaInput.value;
    
        // Validação de campos
        if (!produtoId || !quantidade || quantidade <= 0 || !motivo || !dataSaida) {
            showMessage("Preencha todos os campos corretamente.", "error");
            return;
        }
    
        // Validação de quantidade em estoque
        if (quantidade > estoqueDisponivel) {
            showMessage(`A quantidade excede o estoque disponível (${estoqueDisponivel}).`, "error");
            return;
        }
    
        // Adicionar item à lista
        const item = { produtoId, produtoNome, quantidade, motivo, dataSaida };
        itensSaida.push(item);
    
        // Atualizar tabela
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${produtoNome}</td>
            <td>${quantidade}</td>
            <td>${motivo}</td>
            <td>${dataSaida}</td>
            <td>
                <button class="btn btn-danger btn-sm remover-item">Remover</button>
            </td>
        `;
        itensTabela.appendChild(row);
    
        // Evento de remoção
        row.querySelector(".remover-item").addEventListener("click", function () {
            itensSaida = itensSaida.filter((i) => i.produtoId !== produtoId);
            row.remove();
        });
    
        // Limpar campos
        quantidadeInput.value = "";
        motivoInput.value = "";
        dataSaidaInput.value = "";
    });
    

    // Registrar saída
    registrarSaidaButton.addEventListener("click", function () {
        if (itensSaida.length === 0) {      
            showMessage("Adicione pelo menos um produto antes de registrar.", "error");
            return;
        }

        console.log("Dados enviados ao backend:", JSON.stringify(itensSaida, null, 2));
        fetch("http://localhost:8080/api/saida-estoque", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(itensSaida),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Erro ao registrar saída.");
                }
                return response.json();
            })
            .then(() => {
                showMessage("Saída registrada com sucesso!", "success");
                itensSaida = [];
                itensTabela.innerHTML = ""; // Limpar a tabela
            })
            .catch((error) => {
                console.error("Erro ao registrar saída:", error);
                showMessage("Erro ao registrar saída.", "error");
            });
    });

    // Inicializar
    carregarProdutos();
});


