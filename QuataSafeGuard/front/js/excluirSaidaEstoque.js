document.addEventListener("DOMContentLoaded", function () {
    const tabela = document.querySelector("#saidaTable tbody");
    const messageContainer = document.getElementById("messageContainer");

    // Função para exibir mensagens de feedback
    function showMessage(message, type) {
        messageContainer.textContent = message;
        messageContainer.style.display = "block";
        messageContainer.className = `alert ${type === "success" ? "alert-success" : "alert-danger"}`;
        setTimeout(() => {
            messageContainer.style.display = "none";
        }, 5000);
    }

    // Exibir confirmação personalizada antes de excluir
    function showConfirmation(id) {
        // Remove qualquer confirmação anterior
        const existingConfirmation = document.querySelector("#confirmationDiv");
        if (existingConfirmation) {
            existingConfirmation.remove();
        }

        // Cria a mensagem de confirmação
        const confirmationDiv = document.createElement("div");
        confirmationDiv.id = "confirmationDiv"; // Adiciona um ID para controle
        confirmationDiv.className = "alert alert-warning text-center";
        confirmationDiv.style.marginTop = "20px";
        confirmationDiv.innerHTML = `
            <p>Tem certeza de que deseja excluir esta saída?</p>
            <button class="btn btn-danger btn-sm" id="confirmDelete">Sim</button>
            <button class="btn btn-secondary btn-sm" id="cancelDelete">Não</button>
        `;

        // Insere a mensagem de confirmação abaixo da tabela
        messageContainer.appendChild(confirmationDiv);

        // Botão "Sim" para confirmar exclusão
        document.getElementById("confirmDelete").addEventListener("click", function () {
            excluirSaida(id);
            confirmationDiv.remove();
        });

        // Botão "Não" para cancelar exclusão
        document.getElementById("cancelDelete").addEventListener("click", function () {
            confirmationDiv.remove();
        });
    }

    // Carregar as saídas na tabela
    function carregarSaidas() {
        fetch("http://localhost:8080/api/saida-estoque")
            .then((response) => response.json())
            .then((saidas) => {
                console.log("Saídas carregadas:", saidas);
                tabela.innerHTML = ""; // Limpa a tabela
                saidas.forEach((saida) => {
                    const row = document.createElement("tr");
                    row.classList.add("table-row-clickable");
                    row.setAttribute("data-id", saida.idRegistroSaidaItens); // Atribui corretamente o ID da saída
                    row.innerHTML = `
                        <td>${saida.idRegistroSaidaItens}</td>
                        <td>${saida.produto?.nomeProduto || "Sem Produto"}</td>
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
                        console.log("ID da linha clicada:", id); // Log para depuração
                        showConfirmation(id); // Exibe a confirmação personalizada
                    });
                });
            })
            .catch((error) => {
                console.error("Erro ao carregar saídas:", error);
                showMessage("Erro ao carregar saídas.", "error");
            });
    }

    // Excluir uma saída específica
    function excluirSaida(id) {
        console.log(`Excluindo saída com ID: ${id}`); // Log para depuração
        fetch(`http://localhost:8080/api/saida-estoque/${id}`, {
            method: "DELETE",
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Erro ao excluir saída.");
                }
                showMessage("Saída excluída com sucesso!", "success");
                carregarSaidas(); // Atualiza a tabela após a exclusão
            })
            .catch((error) => {
                console.error("Erro ao excluir saída:", error);
                showMessage("Erro ao excluir saída.", "error");
            });
    }

    // Inicializar
    carregarSaidas();
});
