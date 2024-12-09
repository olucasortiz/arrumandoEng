function formatarCnpj(cnpj) {
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
}

function formatarData(data) {
    const dataObj = new Date(data);
    const dia = String(dataObj.getDate()).padStart(2, "0");
    const mes = String(dataObj.getMonth() + 1).padStart(2, "0");
    const ano = dataObj.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM carregado, iniciando fetch...");
    
    fetch("http://localhost:8080/api/empresa/detalhes", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then((response) => response.json())
    .then((result) => {
        console.log("Dados recebidos do backend:", result);

        if (result) {
            const empresaProfileSection = document.getElementById("parametrizacaoForm");
            if (empresaProfileSection) {
                empresaProfileSection.innerHTML = `
                    <form onsubmit="atualizarParametrizacao(event)">
                        <div class="form-group">
                            <label for="nomeFantasia">Nome Fantasia</label>
                            <input type="text" id="nomeFantasia" class="form-control" value="${result.nomeFantasia || ""}" required>
                        </div>
                        <div class="form-group">
                            <label for="razaoSocial">Razão Social</label>
                            <input type="text" id="razaoSocial" class="form-control" value="${result.razaoSocial || ""}" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="cnpj">CNPJ</label>
                            <input type="text" id="cnpj" class="form-control" value="${result.cnpj || ""}" required>
                        </div>
                        <div class="form-group">
                            <label for="endereco">Endereço</label>
                            <input type="text" id="endereco" class="form-control" value="${result.endereco || ""}">
                        </div>
                        <div class="form-group">
                            <label for="bairro">Bairro</label>
                            <input type="text" id="bairro" class="form-control" value="${result.bairro || ""}">
                        </div>
                        <div class="form-group">
                            <label for="cidade">Cidade</label>
                            <input type="text" id="cidade" class="form-control" value="${result.cidade || ""}">
                        </div>
                        <div class="form-group">
                            <label for="uf">Estado (UF)</label>
                            <input type="text" id="uf" class="form-control" value="${result.uf || ""}" maxlength="2">
                        </div>
                        <div class="form-group">
                            <label for="cep">CEP</label>
                            <input type="text" id="cep" class="form-control" value="${result.cep || ""}" required>
                        </div>
                        <div class="form-group">
                            <label for="telefone">Telefone</label>
                            <input type="text" id="telefone" class="form-control" value="${result.telefone || ""}">
                        </div>
                        <div class="form-group">
                            <label for="site">Site</label>
                            <input type="text" id="site" class="form-control" value="${result.site || ""}">
                        </div>
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="text" id="email" class="form-control" value="${result.email || ""}" required>
                        </div>
                        <div class="form-group">
                            <label for="dataCriacao">Data de Criação</label>
                            <input type="date" id="dataCriacao" class="form-control" value="${result.dataCriacao ? new Date(result.dataCriacao).toISOString().split("T")[0] : ""}">
                        </div>
                        <div class="form-group">
                            <label for="logoPequeno">Logo Pequeno</label>
                            <input type="text" id="logoPequeno" class="form-control" value="${result.logoPequeno || ""}">
                        </div>
                        <div class="form-group">
                            <label for="logoGrande">Logo Grande</label>
                            <input type="text" id="logoGrande" class="form-control" value="${result.logoGrande || ""}">
                        </div>
                        <button type="submit" class="btn-custom">Salvar</button>
                    </form>`;
            } else {
                console.error("Elemento 'empresaProfile' não encontrado.");
            }
        } else {
            console.error("Nenhum dado encontrado.");
        }
    })
    .catch((error) => console.error("Erro ao carregar os dados:", error));
});





function editarParametrizacao(id) {
    fetch(`http://localhost:8080/api/empresa/get-empresa/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.json())
        .then((result) => {
            const empresaProfileSection = document.getElementById("formParametrizacao");
            const dataCriacao = result.dataCriacao
                ? new Date(result.dataCriacao).toISOString().split("T")[0]
                : "";

            empresaProfileSection.innerHTML = `
                <form onsubmit="atualizarParametrizacao(event)">
                    <input type="text" id="nomeFantasia" value="${result.nomeFantasia}" required>
                    <input type="text" id="razaoSocial" value="${result.razaoSocial}" required>
                    <input type="text" id="cnpj" value="${result.cnpj}" required>
                    <input type="text" id="endereco" value="${result.endereco}">
                    <input type="text" id="bairro" value="${result.bairro}">
                    <input type="text" id="cidade" value="${result.cidade}">
                    <input type="text" id="uf" value="${result.uf}" maxlength="2">
                    <input type="text" id="telefone" value="${result.telefone}">
                    <input type="text" id="site" value="${result.site}">
                    <input type="date" id="dataCriacao" value="${dataCriacao}">
                    <input type="text" id="logoPequeno" value="${result.logoPequeno}">
                    <input type="text" id="logoGrande" value="${result.logoGrande}">
                    <button type="submit">Salvar</button>
                </form>
            `;
        })
        .catch((error) => console.error("Erro ao editar parametrização:", error));
}

function atualizarParametrizacao(event) {
    event.preventDefault();

    const empresa = JSON.stringify({
        nomeFantasia: document.getElementById("nomeFantasia").value,
        razaoSocial: document.getElementById("razaoSocial").value,
        cnpj: document.getElementById("cnpj").value,
        endereco: document.getElementById("endereco").value,
        bairro: document.getElementById("bairro").value,
        cidade: document.getElementById("cidade").value,
        uf: document.getElementById("uf").value,
        telefone: document.getElementById("telefone").value,
        site: document.getElementById("site").value,
        dataCriacao: document.getElementById("dataCriacao").value,
        logoPequeno: document.getElementById("logoPequeno").value,
        logoGrande: document.getElementById("logoGrande").value,
    });

    fetch("http://localhost:8080/api/empresa/update-empresa", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: empresa,
    })
        .then(() => {
            alert("Parametrização atualizada com sucesso!");
            window.location.href = "perfil.html";
        })
        .catch((error) => console.error("Erro ao atualizar parametrização:", error));
}