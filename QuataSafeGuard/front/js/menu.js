document.addEventListener("DOMContentLoaded", function () {
    const menuButton = document.querySelector('.menu-button');
    const menuContainer = document.querySelector('.menu-container');

    // Alterna a classe active para mostrar/ocultar o menu
    menuButton.addEventListener('click', function () {
        menuContainer.classList.toggle('active');
    });

    // Fecha o menu se o usuário clicar fora dele
    document.addEventListener('click', function (event) {
        if (!menuContainer.contains(event.target)) {
            menuContainer.classList.remove('active');
        }
    });
});
