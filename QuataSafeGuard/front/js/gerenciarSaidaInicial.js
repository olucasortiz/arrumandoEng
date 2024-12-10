document.addEventListener("DOMContentLoaded", function () {
    // Evento para Registrar Saída de Estoque
    const registrarImg = document.getElementById("registrarImg");
    registrarImg.addEventListener("click", function () {
        window.location.href = "registrar_saida_estoque.html"; // Redireciona para a página de registro
    });

    // Evento para Alterar Saída de Estoque
    const alterarImg = document.getElementById("alterarImg");
    alterarImg.addEventListener("click", function () {
        window.location.href = "alterar_saida_estoque.html"; // Redireciona para a página de alteração
    });

    // Evento para Deletar Saída de Estoque
    const deletarImg = document.getElementById("deletarImg");
    deletarImg.addEventListener("click", function () {
        window.location.href = "deletar_saida_estoque.html"; // Redireciona para a página de deleção
    });

    // Evento para Histórico de Saída de Estoque
    const historicoImg = document.getElementById("historicoImg");
    historicoImg.addEventListener("click", function () {
        window.location.href = "historico_saida_estoque.html"; // Redireciona para a página do histórico
    });
});
