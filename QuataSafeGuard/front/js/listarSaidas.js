document.addEventListener("DOMContentLoaded", () => {
    carregarSaidas();
});

function carregarSaidas() {
    fetch("http://localhost:8080/api/saida-estoque", {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    })
        .then(response => response.json())
        .then(data => {
            const saidaTableBody = document.getElementById("saidaTableBody");
            saidaTableBody.innerHTML = ""; // Limpa a tabela antes de preencher

            data.forEach(saida => {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${saida.produto?.nome || "Produto desconhecido"}</td>
                    <td>${saida.qtde}</td>
                    <td>${saida.motivo || "N/A"}</td>
                    <td>${new Date(saida.dataSaida).toLocaleString() || "N/A"}</td>
                `;

                saidaTableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error("Erro ao carregar saídas:", error);
            alert("Erro ao carregar registros de saídas.");
        });
}
