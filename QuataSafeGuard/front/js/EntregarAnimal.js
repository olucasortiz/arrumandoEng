const BASE_URL = "http://localhost:8080/api/entregas"; // URL do backend
const tabela = document.getElementById("tabela-entregas").querySelector("tbody");
const form = document.getElementById("form-entrega");

// Registrar uma nova entrega
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const animalId = document.getElementById("animal-id").value;
    const funcionarioId = document.getElementById("funcionario-id").value;
    const agendaId = document.getElementById("agenda-id").value;

    const novaEntrega = {
        animal: { id: parseInt(animalId) },
        funcionario: { id: parseInt(funcionarioId) },
        agenda: { idAgenda: parseInt(agendaId) },
        statusEntrega: "Pendente",
    };

    try {
        const response = await fetch(BASE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(novaEntrega),
        });

        if (!response.ok) throw new Error("Erro ao registrar entrega.");

        alert("Entrega registrada com sucesso!");
        carregarEntregasPendentes();
        form.reset();
    } catch (error) {
        alert(error.message);
    }
});

// Carregar entregas pendentes
async function carregarEntregasPendentes() {
    try {
        const response = await fetch(`${BASE_URL}/pendentes?status=Pendente`);
        if (!response.ok) throw new Error("Erro ao carregar entregas pendentes.");

        const entregas = await response.json();
        tabela.innerHTML = "";
        entregas.forEach((entrega) => {
            tabela.innerHTML += `
                <tr>
                    <td>${entrega.idEntregaAnimal}</td>
                    <td>${entrega.animal.id}</td>
                    <td>${new Date(entrega.dataEntrega).toLocaleDateString()}</td>
                    <td class="${entrega.statusEntrega === "Pendente" ? "status-pendente" : "status-concluido"}">${entrega.statusEntrega}</td>
                    <td>
                        <button onclick="atualizarStatus(${entrega.idEntregaAnimal}, 'Concluído')">Concluir</button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        alert(error.message);
    }
}

// Atualizar status da entrega
async function atualizarStatus(id, novoStatus) {
    try {
        const response = await fetch(`${BASE_URL}/${id}/status?status=${novoStatus}`, {
            method: "PATCH",
        });

        if (!response.ok) throw new Error("Erro ao atualizar status.");

        alert("Status atualizado com sucesso!");
        carregarEntregasPendentes();
    } catch (error) {
        alert(error.message);
    }
}

carregarEntregasPendentes();
