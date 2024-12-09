const form = document.getElementById("form-agendamento");
const BASE_URL = "http://localhost:8080/api/agendamentos"; // Atualize conforme necessário

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const cpfDoador = document.getElementById("cpf-doador").value;
    const tipoAnimal = document.getElementById("tipo-animal").value;
    const dataHora = document.getElementById("data-hora").value;
    const informacoes = document.getElementById("informacoes").value;
    const carteiraVacina = document.getElementById("carteira-vacina").files[0]; 
    if (!carteiraVacina) {
        alert("Por favor, envie uma imagem da carteira de vacinação.");
        return;
    }

    const formData = new FormData();
    formData.append("cpfDoador", cpfDoador);
    formData.append("tipoAnimal", tipoAnimal);
    formData.append("dataHora", dataHora);
    formData.append("informacoes", informacoes);
    formData.append("carteiraVacina", carteiraVacina);

    try {
        const response = await fetch(BASE_URL, {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            alert("Entrega agendada com sucesso!");
            form.reset();
        } else {
            alert("Erro ao agendar entrega. Verifique os dados e tente novamente.");
        }
    } catch (error) {
        console.error("Erro ao conectar com o servidor:", error);
        alert("Erro ao agendar entrega. Tente novamente mais tarde.");
    }
});
