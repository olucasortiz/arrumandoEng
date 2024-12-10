document.addEventListener("DOMContentLoaded", function () {
    carregarHistorico();

    function carregarHistorico() {
        fetch("http://localhost:8080/api/saida-estoque", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        })
            .then(response => response.json())
            .then(saidas => {
                console.log("Dados recebidos:", saidas);
                const tabela = document.getElementById("historicoTabela");
                tabela.innerHTML = "";

                saidas.forEach(saida => {
                    console.log("Processando saída:", saida);
                    const row = tabela.insertRow();
                    row.innerHTML = `
                        <td>${saida.idRegistroSaidaItens || "N/A"}</td>
                        <td>${saida.produto?.nomeProduto || "Recurso não especificado"}</td>
                        <td>${saida.qtde || "N/A"}</td>
                        <td>${saida.motivo || "N/A"}</td>
                        <td>${saida.dataSaida ? new Date(saida.dataSaida).toLocaleDateString("pt-BR") : "Data não disponível"}</td>
                    `;
                });
            })
            .catch(error => {
                console.error("Erro ao carregar histórico:", error);
                alert("Erro ao carregar o histórico de saídas.");
            });
    }
});

function removerSaida(id) {
    const url = `http://localhost:8080/api/saida-estoque/${id}`;

    fetch(url, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
    })
        .then(() => {
            alert("Saída removida com sucesso!");
            location.reload();
        })
        .catch(error => {
            console.error("Erro ao remover saída:", error);
            alert("Erro ao remover a saída.");
        });
}
