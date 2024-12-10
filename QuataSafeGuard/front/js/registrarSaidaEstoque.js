document.addEventListener("DOMContentLoaded", function () {
    carregarProdutos();

    const form = document.getElementById("saidaForm");

    // Criação de um contêiner para exibir mensagens de sucesso ou erro
    const messageContainer = document.createElement("div");
    messageContainer.style.display = "none";
    form.parentNode.insertBefore(messageContainer, form);

    function showMessage(message, type) {
        messageContainer.textContent = message;
        messageContainer.style.display = "block";
        messageContainer.style.padding = "10px";
        messageContainer.style.marginBottom = "10px";
        messageContainer.style.borderRadius = "5px";
        messageContainer.style.fontWeight = "bold";
        messageContainer.style.textAlign = "center";
        messageContainer.style.color = type === "success" ? "#155724" : "#721c24";
        messageContainer.style.backgroundColor = type === "success" ? "#d4edda" : "#f8d7da";
        messageContainer.style.border = type === "success" ? "1px solid #c3e6cb" : "1px solid #f5c6cb";

        // Esconde a mensagem após 5 segundos
        setTimeout(() => {
            messageContainer.style.display = "none";
        }, 5000);
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const produtoId = document.getElementById("produto").value;
        const quantidade = parseInt(document.getElementById("quantidade").value, 10);
        const motivo = document.getElementById("motivo").value;
        const dataSaida = document.getElementById("dataSaida").value;

        // Verifica se todos os campos estão preenchidos
        if (!produtoId || !quantidade || !motivo || !dataSaida) {
            showMessage("Todos os campos são obrigatórios.", "error");
            return;
        }

        // Validação do formato da data (YYYY-MM-DD)
        if (!/^\d{4}-\d{2}-\d{2}$/.test(dataSaida)) {
            showMessage("A data deve estar no formato YYYY-MM-DD.", "error");
            return;
        }

        // Criação da URL com os parâmetros de consulta
        const url = new URL("http://localhost:8080/api/saida-estoque");
        url.searchParams.append("idProduto", produtoId);
        url.searchParams.append("quantidade", quantidade);
        url.searchParams.append("motivo", motivo);
        url.searchParams.append("dataSaida", dataSaida);

        // Requisição Fetch
        fetch(url, {
            method: "POST"
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Erro ${response.status}: ${response.statusText}`);
                }
                return response.json();
            })
            .then(() => {
                showMessage("Saída registrada com sucesso!", "success");
                form.reset(); // Limpa o formulário após o sucesso
            })
            .catch((error) => {
                showMessage("Erro ao registrar saída: " + error.message, "error");
                console.error(error);
            });
    });carregarProdutos();
});
