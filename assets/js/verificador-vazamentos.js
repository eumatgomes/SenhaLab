"use strict";

/* =========================================================
   SENHALAB - VERIFICADOR DE VAZAMENTOS

   Pwned Passwords / Have I Been Pwned

   Fluxo:

   senha
      ↓
   SHA-1 local
      ↓
   primeiros 5 caracteres
      ↓
   Cloudflare Worker
      ↓
   HIBP /range/XXXXX
      ↓
   navegador compara o restante do hash
   ========================================================= */


/* =========================================================
   CONFIGURAÇÃO
   ========================================================= */

const SENHALAB_API =
    "https://senhalab-api.senhalab.workers.dev";


/* =========================================================
   FUNÇÃO AUXILIAR
   Converte ArrayBuffer para hexadecimal
   ========================================================= */

function bufferToHex(buffer) {

    return Array.from(
        new Uint8Array(buffer)
    )
        .map(
            byte =>
                byte
                    .toString(16)
                    .padStart(2, "0")
        )
        .join("")
        .toUpperCase();

}


/* =========================================================
   SHA-1
   Executado localmente no navegador
   ========================================================= */

async function sha1(text) {

    const data =
        new TextEncoder()
            .encode(text);


    const hash =
        await crypto.subtle.digest(
            "SHA-1",
            data
        );


    return bufferToHex(hash);

}


/* =========================================================
   CONSULTA AO HIBP
   ========================================================= */

async function checkPasswordAgainstHIBP(
    password
) {

    /*
       Calcula o SHA-1 completo
       localmente.
    */

    const hash =
        await sha1(password);


    /*
       Primeiros 5 caracteres
       enviados ao Worker.
    */

    const prefix =
        hash.substring(
            0,
            5
        );


    /*
       Parte restante permanece
       somente no navegador.
    */

    const suffix =
        hash.substring(
            5
        );


    const url =
        SENHALAB_API +
        "/api/pwned-password?prefix=" +
        encodeURIComponent(prefix);


    const response =
        await fetch(
            url,
            {
                method: "GET",

                headers: {
                    "Accept":
                        "application/json"
                },

                cache:
                    "no-store",

                credentials:
                    "omit"
            }
        );


    if (!response.ok) {

        throw new Error(
            "O servidor de verificação não respondeu corretamente."
        );

    }


    const payload =
        await response.json();


    if (
        !payload ||
        payload.success !== true
    ) {

        throw new Error(
            payload?.error ||
            "Não foi possível consultar a base de senhas comprometidas."
        );

    }


    const data =
        typeof payload.data === "string"
            ? payload.data
            : "";


    const lines =
        data.split(
            /\r?\n/
        );


    /*
       Procura pelo restante do hash
       retornado pelo HIBP.
    */

    for (
        const line
        of lines
    ) {

        if (!line) {
            continue;
        }


        const separator =
            line.indexOf(":");


        if (
            separator === -1
        ) {

            continue;

        }


        const returnedSuffix =
            line
                .substring(
                    0,
                    separator
                )
                .trim()
                .toUpperCase();


        if (
            returnedSuffix !==
            suffix
        ) {

            continue;

        }


        const count =
            parseInt(
                line.substring(
                    separator + 1
                ),
                10
            );


        if (
            Number.isFinite(count) &&
            count > 0
        ) {

            return {
                found: true,
                count: count
            };

        }

    }


    /*
       Hash não encontrado.
    */

    return {
        found: false,
        count: 0
    };

}


/* =========================================================
   CRIA PAINEL VISUAL DO RESULTADO
   ========================================================= */

function createResultPanel(
    state,
    title,
    description,
    count = null
) {

    const panel =
        document.createElement(
            "div"
        );


    panel.className =
        "leak-result-panel " +
        "leak-result-" +
        state;


    panel.setAttribute(
        "role",
        "status"
    );


    panel.setAttribute(
        "aria-live",
        "polite"
    );


    /*
       Ícone
    */

    const icon =
        document.createElement(
            "div"
        );


    icon.className =
        "leak-result-icon";


    icon.textContent =
        state === "found"
            ? "!"
            : state === "safe"
                ? "✓"
                : state === "error"
                    ? "!"
                    : "…";


    /*
       Conteúdo
    */

    const content =
        document.createElement(
            "div"
        );


    content.className =
        "leak-result-content";


    /*
       Título
    */

    const titleElement =
        document.createElement(
            "h3"
        );


    titleElement.className =
        "leak-result-title";


    titleElement.textContent =
        title;


    /*
       Descrição
    */

    const descriptionElement =
        document.createElement(
            "p"
        );


    descriptionElement.className =
        "leak-result-description";


    descriptionElement.textContent =
        description;


    content.appendChild(
        titleElement
    );


    content.appendChild(
        descriptionElement
    );


    /* =====================================================
       QUANTIDADE DE OCORRÊNCIAS
       ===================================================== */

    if (
        state === "found" &&
        Number.isFinite(count) &&
        count > 0
    ) {

        const countBox =
            document.createElement(
                "div"
            );


        countBox.className =
            "leak-result-count";


        const countNumber =
            document.createElement(
                "strong"
            );


        countNumber.textContent =
            count.toLocaleString(
                "pt-BR"
            );


        const countText =
            document.createElement(
                "span"
            );


        countText.textContent =
            count === 1
                ? " ocorrência encontrada na base consultada"
                : " ocorrências encontradas na base consultada";


        countBox.appendChild(
            countNumber
        );


        countBox.appendChild(
            countText
        );


        content.appendChild(
            countBox
        );

    }


    /* =====================================================
       ORIENTAÇÕES PARA SENHA COMPROMETIDA
       ===================================================== */

    if (
        state === "found"
    ) {

        const actionBox =
            document.createElement(
                "div"
            );


        actionBox.className =
            "leak-result-actions";


        const actionTitle =
            document.createElement(
                "strong"
            );


        actionTitle.textContent =
            "O que você deve fazer agora";


        const list =
            document.createElement(
                "ol"
            );


        const actions = [

            "Pare de usar essa senha.",

            "Se ela estiver sendo usada em alguma conta, troque-a imediatamente.",

            "Se você reutilizou a mesma senha em outros serviços, troque-a nesses serviços também.",

            "Ative a autenticação em dois fatores (2FA) quando estiver disponível.",

            "Use uma senha exclusiva e longa para cada conta."

        ];


        actions.forEach(
            text => {

                const item =
                    document.createElement(
                        "li"
                    );


                item.textContent =
                    text;


                list.appendChild(
                    item
                );

            }
        );


        actionBox.appendChild(
            actionTitle
        );


        actionBox.appendChild(
            list
        );


        content.appendChild(
            actionBox
        );

    }


    /* =====================================================
       ORIENTAÇÕES PARA SENHA NÃO ENCONTRADA
       ===================================================== */

    if (
        state === "safe"
    ) {

        const actionBox =
            document.createElement(
                "div"
            );


        actionBox.className =
            "leak-result-actions";


        const actionTitle =
            document.createElement(
                "strong"
            );


        actionTitle.textContent =
            "O que esse resultado significa";


        const list =
            document.createElement(
                "ul"
            );


        const actions = [

            "A senha não foi encontrada na base consultada.",

            "Isso não garante que ela seja completamente segura.",

            "Evite reutilizar a mesma senha em vários serviços.",

            "Para contas importantes, prefira senhas longas e exclusivas."

        ];


        actions.forEach(
            text => {

                const item =
                    document.createElement(
                        "li"
                    );


                item.textContent =
                    text;


                list.appendChild(
                    item
                );

            }
        );


        actionBox.appendChild(
            actionTitle
        );


        actionBox.appendChild(
            list
        );


        content.appendChild(
            actionBox
        );

    }


    /*
       Monta o painel
    */

    panel.appendChild(
        icon
    );


    panel.appendChild(
        content
    );


    return panel;

}


/* =========================================================
   VERIFICADOR DE VAZAMENTOS
   ========================================================= */

function setupLeakChecker() {

    /*
       Campo da senha
    */

    const input =
        document.getElementById(
            "leakPasswordInput"
        );


    /*
       Botão verificar
    */

    const checkButton =
        document.getElementById(
            "checkLeakPassword"
        );


    /*
       Botão limpar
    */

    const clearButton =
        document.getElementById(
            "clearLeakPassword"
        );


    /*
       Botão mostrar senha
    */

    const toggleButton =
        document.getElementById(
            "toggleLeakPasswordVisibility"
        );


    /*
       Área onde o resultado será exibido
    */

    const resultContainer =
        document.getElementById(
            "leakResult"
        );


    /*
       Status textual
    */

    const statusLabel =
        document.getElementById(
            "leakStatusLabel"
        );


    /*
       Barra de progresso
    */

    const statusFill =
        document.getElementById(
            "leakStatusFill"
        );


    /*
       Validação básica
    */

    if (!input) {

        console.error(
            "SenhaLab: #leakPasswordInput não encontrado."
        );

        return;

    }


    if (!checkButton) {

        console.error(
            "SenhaLab: #checkLeakPassword não encontrado."
        );

    }


    if (!resultContainer) {

        console.error(
            "SenhaLab: #leakResult não encontrado."
        );

        return;

    }


    let checking =
        false;


    let lastCheckedPassword =
        "";


    /* =====================================================
       ATUALIZA STATUS
       ===================================================== */

    function updateStatus(
        label,
        progress
    ) {

        if (statusLabel) {

            statusLabel.textContent =
                label;

        }


        if (statusFill) {

            statusFill.style.width =
                progress + "%";

        }

    }


    /* =====================================================
       ATUALIZA RESULTADO
       ===================================================== */

    function setResult(
        state,
        title,
        description,
        count = null
    ) {

        /*
           Remove qualquer resultado anterior.
        */

        resultContainer.innerHTML =
            "";


        /*
           Classes do estado atual.
        */

        resultContainer.className =
            "leak-result " +
            "leak-result-state-" +
            state;


        /*
           Cria apenas UM painel.
        */

        resultContainer.appendChild(

            createResultPanel(
                state,
                title,
                description,
                count
            )

        );

    }


    /* =====================================================
       RESET
       ===================================================== */

    function reset() {

        checking =
            false;


        lastCheckedPassword =
            "";


        updateStatus(
            "Aguardando senha",
            0
        );


        setResult(
            "pending",
            "Aguardando análise",
            "Digite uma senha e clique em \"Verificar senha\" para consultar a base de senhas comprometidas."
        );


        if (checkButton) {

            checkButton.disabled =
                false;


            checkButton.textContent =
                "Verificar senha";

        }

    }


    /* =====================================================
       VERIFICAR SENHA
       ===================================================== */

    async function check() {

        const password =
            input.value;


        /*
           Campo vazio
        */

        if (!password) {

            reset();

            input.focus();

            return;

        }


        /*
           Evita duas consultas simultâneas
        */

        if (checking) {

            return;

        }


        /*
           Não consulta novamente a mesma senha
        */

        if (
            password ===
            lastCheckedPassword
        ) {

            return;

        }


        checking =
            true;


        /*
           Status
        */

        updateStatus(
            "Consultando...",
            55
        );


        /*
           Resultado temporário
        */

        setResult(
            "pending",
            "Verificando sua senha...",
            "Calculando o hash localmente e consultando a base de forma segura."
        );


        /*
           Desabilita botão durante consulta
        */

        if (checkButton) {

            checkButton.disabled =
                true;


            checkButton.textContent =
                "Verificando...";

        }


        try {

            const result =
                await checkPasswordAgainstHIBP(
                    password
                );


            /*
               Guarda senha consultada
            */

            lastCheckedPassword =
                password;


            /* =================================================
               SENHA ENCONTRADA
               ================================================= */

            if (
                result.found
            ) {

                updateStatus(
                    "Senha comprometida",
                    100
                );


                setResult(
                    "found",
                    "⚠️ Senha comprometida",
                    "Esta senha foi encontrada na base de senhas comprometidas do Have I Been Pwned. Não utilize essa senha em contas.",
                    result.count
                );


            }

            /* =================================================
               SENHA NÃO ENCONTRADA
               ================================================= */

            else {

                updateStatus(
                    "Senha não encontrada",
                    100
                );


                setResult(
                    "safe",
                    "✓ Senha não encontrada",
                    "Não encontramos essa senha na base consultada do Have I Been Pwned. Isso é uma boa notícia, mas não garante que ela seja completamente segura."
                );

            }


        } catch (error) {

            console.error(
                "Erro no verificador de vazamentos:",
                error
            );


            updateStatus(
                "Erro na consulta",
                0
            );


            setResult(
                "error",
                "Não foi possível concluir a consulta",
                "O serviço de verificação não respondeu corretamente. Verifique sua conexão e tente novamente."
            );


        } finally {

            checking =
                false;


            if (checkButton) {

                checkButton.disabled =
                    false;


                checkButton.textContent =
                    "Verificar senha";

            }

        }

    }


    /* =====================================================
       MOSTRAR / OCULTAR SENHA
       ===================================================== */

    if (toggleButton) {

        toggleButton.addEventListener(
            "click",
            () => {

                const showing =
                    input.type ===
                    "text";


                input.type =
                    showing
                        ? "password"
                        : "text";


                toggleButton.textContent =
                    showing
                        ? "👁"
                        : "🙈";


                toggleButton.setAttribute(
                    "aria-label",
                    showing
                        ? "Mostrar senha"
                        : "Ocultar senha"
                );


                toggleButton.setAttribute(
                    "title",
                    showing
                        ? "Mostrar senha"
                        : "Ocultar senha"
                );

            }
        );

    }


    /* =====================================================
       BOTÃO VERIFICAR
       ===================================================== */

    if (checkButton) {

        checkButton.addEventListener(
            "click",
            check
        );

    }


    /* =====================================================
       BOTÃO LIMPAR
       ===================================================== */

    if (clearButton) {

        clearButton.addEventListener(
            "click",
            () => {

                input.value =
                    "";


                input.type =
                    "password";


                if (toggleButton) {

                    toggleButton.textContent =
                        "👁";


                    toggleButton.setAttribute(
                        "aria-label",
                        "Mostrar senha"
                    );


                    toggleButton.setAttribute(
                        "title",
                        "Mostrar senha"
                    );

                }


                reset();


                input.focus();

            }
        );

    }


    /* =====================================================
       ENTER TAMBÉM VERIFICA
       ===================================================== */

    input.addEventListener(
        "keydown",
        event => {

            if (
                event.key ===
                "Enter"
            ) {

                event.preventDefault();

                check();

            }

        }
    );


    /*
       Estado inicial
    */

    reset();

}


/* =========================================================
   INICIALIZAÇÃO
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    setupLeakChecker
);