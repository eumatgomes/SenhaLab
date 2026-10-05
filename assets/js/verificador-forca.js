document.addEventListener("DOMContentLoaded", () => {

    /*
     * ============================================================
     * SENHALAB
     * verificador-forca.js
     *
     * Responsável exclusivamente pelo:
     * - Verificador de força
     * - Mostrar/ocultar senha
     * - Consulta HIBP
     * - Limpar
     * ============================================================
     */


    /* ============================================================
       ELEMENTOS
       ============================================================ */

    const input =
        document.getElementById("passwordCheckerInput");

    const toggleButton =
        document.getElementById("togglePasswordVisibility");

    const checkButton =
        document.getElementById("checkPassword");

    const clearButton =
        document.getElementById("clearPasswordChecker");

    const strengthLabel =
        document.getElementById("passwordStrengthLabel");

    const strengthFill =
        document.getElementById("passwordStrengthFill");

    const analysisContainer =
        document.getElementById("passwordAnalysis");


    if (!input) {
        console.error(
            "SenhaLab: passwordCheckerInput não encontrado."
        );

        return;
    }


    /* ============================================================
       ESTADO
       ============================================================ */

    let lastCheckedPassword = "";

    let hibpStatus = null;
    /*
        null      = ainda não consultado
        "found"   = encontrada
        "safe"    = não encontrada
        "error"   = erro na consulta
    */


    /* ============================================================
       MOSTRAR / OCULTAR SENHA
       ============================================================ */

    if (toggleButton) {

        toggleButton.addEventListener("click", () => {

            if (input.type === "password") {

                input.type = "text";

                toggleButton.textContent = "🙈";

                toggleButton.setAttribute(
                    "aria-label",
                    "Ocultar senha"
                );

            } else {

                input.type = "password";

                toggleButton.textContent = "👁";

                toggleButton.setAttribute(
                    "aria-label",
                    "Mostrar senha"
                );

            }

        });

    }


    /* ============================================================
       FUNÇÕES AUXILIARES
       ============================================================ */

    function escapeHtml(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    function setStrength(score) {

        if (!strengthLabel || !strengthFill) {
            return;
        }


        let label = "Muito fraca";

        if (score >= 80) {
            label = "Muito forte";
        } else if (score >= 65) {
            label = "Forte";
        } else if (score >= 45) {
            label = "Razoável";
        } else if (score >= 25) {
            label = "Fraca";
        }


        strengthLabel.textContent = label;

        strengthFill.style.width =
            Math.max(
                0,
                Math.min(100, score)
            ) + "%";


        /*
         * Cor da barra
         */

        if (score >= 65) {

            strengthFill.style.background =
                "#16a34a";

        } else if (score >= 45) {

            strengthFill.style.background =
                "#eab308";

        } else {

            strengthFill.style.background =
                "#dc2626";

        }

    }


    function createAnalysisItem(
        type,
        title,
        description
    ) {

        const item =
            document.createElement("div");


        item.className =
            "analysis-item " + type;


        let icon = "✓";


        if (type === "danger") {
            icon = "×";
        }


        if (type === "warning") {
            icon = "!";
        }


        item.innerHTML = `
            <span class="analysis-icon">
                ${icon}
            </span>

            <div>
                <strong>
                    ${escapeHtml(title)}
                </strong>

                <p>
                    ${escapeHtml(description)}
                </p>
            </div>
        `;


        /*
         * Força visualmente as cores mesmo se o CSS
         * ainda não possuir as classes.
         */

        item.style.border =
            "1px solid " +
            (
                type === "success"
                    ? "#86efac"
                    : type === "danger"
                        ? "#fca5a5"
                        : "#fcd34d"
            );


        item.style.background =
            type === "success"
                ? "#f0fdf4"
                : type === "danger"
                    ? "#fef2f2"
                    : "#fffbeb";


        item.style.borderRadius =
            "12px";


        item.style.padding =
            "16px";


        item.style.display =
            "flex";


        item.style.gap =
            "12px";


        item.style.alignItems =
            "flex-start";


        item.style.boxSizing =
            "border-box";


        const iconElement =
            item.querySelector(".analysis-icon");


        if (iconElement) {

            iconElement.style.width =
                "30px";

            iconElement.style.height =
                "30px";

            iconElement.style.minWidth =
                "30px";

            iconElement.style.borderRadius =
                "50%";

            iconElement.style.display =
                "flex";

            iconElement.style.alignItems =
                "center";

            iconElement.style.justifyContent =
                "center";

            iconElement.style.fontWeight =
                "700";

            iconElement.style.color =
                "#ffffff";


            iconElement.style.background =
                type === "success"
                    ? "#16a34a"
                    : type === "danger"
                        ? "#dc2626"
                        : "#d97706";

        }


        return item;

    }


    /* ============================================================
       ANÁLISE DA SENHA
       ============================================================ */

    function analyzePassword(password) {

        const length =
            password.length;


        const hasLower =
            /[a-z]/.test(password);


        const hasUpper =
            /[A-Z]/.test(password);


        const hasNumber =
            /[0-9]/.test(password);


        const hasSymbol =
            /[^A-Za-z0-9]/.test(password);


        /*
         * Sequências simples
         */

        const sequentialPatterns = [
            "0123456789",
            "9876543210",
            "abcdefghijklmnopqrstuvwxyz",
            "zyxwvutsrqponmlkjihgfedcba"
        ];


        let hasSequence = false;


        const lowerPassword =
            password.toLowerCase();


        for (const sequence of sequentialPatterns) {

            for (
                let i = 0;
                i <= sequence.length - 4;
                i++
            ) {

                const part =
                    sequence.substring(i, i + 4);

                if (
                    lowerPassword.includes(part)
                ) {

                    hasSequence = true;

                    break;

                }

            }


            if (hasSequence) {
                break;
            }

        }


        /*
         * Repetições excessivas
         */

        const hasRepeated =
            /(.)\1\1/.test(password);


        /*
         * Padrões previsíveis
         */

        const commonPatterns = [
            "1234",
            "12345",
            "123456",
            "password",
            "senha",
            "qwerty",
            "admin",
            "abc123",
            "letmein",
            "welcome"
        ];


        let predictable = false;


        for (const pattern of commonPatterns) {

            if (
                lowerPassword.includes(pattern)
            ) {

                predictable = true;

                break;

            }

        }


        /*
         * Pontuação
         */

        let score = 0;


        /*
         * Comprimento
         */

        if (length >= 16) {

            score += 35;

        } else if (length >= 12) {

            score += 25;

        } else if (length >= 8) {

            score += 12;

        } else {

            score += 3;

        }


        /*
         * Tipos de caracteres
         */

        if (hasLower) {
            score += 10;
        }

        if (hasUpper) {
            score += 10;
        }

        if (hasNumber) {
            score += 10;
        }

        if (hasSymbol) {
            score += 15;
        }


        /*
         * Penalizações
         */

        if (hasSequence) {
            score -= 15;
        }

        if (hasRepeated) {
            score -= 15;
        }

        if (predictable) {
            score -= 25;
        }


        score =
            Math.max(
                0,
                Math.min(100, score)
            );


        return {
            length,
            hasLower,
            hasUpper,
            hasNumber,
            hasSymbol,
            hasSequence,
            hasRepeated,
            predictable,
            score
        };

    }


    /* ============================================================
       RENDERIZA ANÁLISE
       ============================================================ */

    function renderAnalysis(password) {

        if (!analysisContainer) {
            return null;
        }


        if (!password) {

            analysisContainer.innerHTML = `
                <div class="analysis-item warning">

                    <span class="analysis-icon">
                        •
                    </span>

                    <div>

                        <strong>
                            Aguardando análise
                        </strong>

                        <p>
                            Digite uma senha para iniciar a análise.
                        </p>

                    </div>

                </div>
            `;


            setStrength(0);

            if (strengthLabel) {
                strengthLabel.textContent =
                    "Digite uma senha";
            }


            return null;

        }


        const analysis =
            analyzePassword(password);


        analysisContainer.innerHTML = "";


        /*
         * Comprimento
         */

        if (analysis.length >= 12) {

            analysisContainer.appendChild(
                createAnalysisItem(
                    "success",
                    `Comprimento: ${analysis.length} caracteres`,
                    "O comprimento da senha é adequado."
                )
            );

        } else {

            analysisContainer.appendChild(
                createAnalysisItem(
                    "danger",
                    `Comprimento: ${analysis.length} caracteres`,
                    "Prefira pelo menos 12 caracteres, idealmente 16 ou mais."
                )
            );

        }


        /*
         * Minúsculas
         */

        analysisContainer.appendChild(
            createAnalysisItem(
                analysis.hasLower
                    ? "success"
                    : "danger",

                "Letras minúsculas",

                analysis.hasLower
                    ? "Possui letras minúsculas."
                    : "Não possui letras minúsculas."
            )
        );


        /*
         * Maiúsculas
         */

        analysisContainer.appendChild(
            createAnalysisItem(
                analysis.hasUpper
                    ? "success"
                    : "danger",

                "Letras maiúsculas",

                analysis.hasUpper
                    ? "Possui letras maiúsculas."
                    : "Não possui letras maiúsculas."
            )
        );


        /*
         * Números
         */

        analysisContainer.appendChild(
            createAnalysisItem(
                analysis.hasNumber
                    ? "success"
                    : "danger",

                "Números",

                analysis.hasNumber
                    ? "Possui números."
                    : "Não possui números."
            )
        );


        /*
         * Símbolos
         */

        analysisContainer.appendChild(
            createAnalysisItem(
                analysis.hasSymbol
                    ? "success"
                    : "warning",

                "Símbolos",

                analysis.hasSymbol
                    ? "Possui símbolos."
                    : "Adicionar símbolos pode aumentar a variedade."
            )
        );


        /*
         * Sequências
         */

        analysisContainer.appendChild(
            createAnalysisItem(
                analysis.hasSequence
                    ? "danger"
                    : "success",

                "Sequências simples",

                analysis.hasSequence
                    ? "Foi detectada uma sequência simples de caracteres."
                    : "Nenhuma sequência longa e óbvia foi detectada."
            )
        );


        /*
         * Repetições
         */

        analysisContainer.appendChild(
            createAnalysisItem(
                analysis.hasRepeated
                    ? "warning"
                    : "success",

                "Repetições",

                analysis.hasRepeated
                    ? "Há caracteres repetidos em sequência."
                    : "Nenhuma repetição excessiva foi detectada."
            )
        );


        /*
         * Padrões previsíveis
         */

        analysisContainer.appendChild(
            createAnalysisItem(
                analysis.predictable
                    ? "danger"
                    : "success",

                "Padrões previsíveis",

                analysis.predictable
                    ? "A senha possui uma estrutura que pode ser mais fácil de adivinhar."
                    : "Nenhum padrão muito previsível foi detectado."
            )
        );


        /*
         * Variedade
         */

        const varietyCount =
            [
                analysis.hasLower,
                analysis.hasUpper,
                analysis.hasNumber,
                analysis.hasSymbol
            ].filter(Boolean).length;


        analysisContainer.appendChild(
            createAnalysisItem(
                varietyCount >= 3
                    ? "success"
                    : "warning",

                "Variedade de caracteres",

                varietyCount >= 3
                    ? "A senha utiliza uma boa variedade de caracteres."
                    : "Misturar diferentes tipos de caracteres pode aumentar a variedade."
            )
        );


        setStrength(
            analysis.score
        );


        return analysis;

    }


    /* ============================================================
       HIBP - SHA-1
       ============================================================ */

    async function sha1(text) {

        const encoder =
            new TextEncoder();


        const data =
            encoder.encode(text);


        const hashBuffer =
            await crypto.subtle.digest(
                "SHA-1",
                data
            );


        const hashArray =
            Array.from(
                new Uint8Array(hashBuffer)
            );


        return hashArray
            .map(
                byte =>
                    byte
                        .toString(16)
                        .padStart(2, "0")
                        .toUpperCase()
            )
            .join("");

    }


    /* ============================================================
       CONSULTA HIBP
       ============================================================ */

    async function checkHIBP(password) {

        const hash =
            await sha1(password);


        const prefix =
            hash.substring(0, 5);


        const suffix =
            hash.substring(5);


        const response =
            await fetch(
                `https://api.pwnedpasswords.com/range/${prefix}`,
                {
                    method: "GET",

                    headers: {
                        "Add-Padding": "true"
                    }
                }
            );


        if (!response.ok) {

            throw new Error(
                `HIBP HTTP ${response.status}`
            );

        }


        const text =
            await response.text();


        const lines =
            text.split(/\r?\n/);


        for (const line of lines) {

            const separator =
                line.indexOf(":");


            if (separator === -1) {
                continue;
            }


            const returnedSuffix =
                line
                    .substring(0, separator)
                    .trim()
                    .toUpperCase();


            const count =
                Number(
                    line.substring(
                        separator + 1
                    ).trim()
                );


            if (
                returnedSuffix === suffix
            ) {

                return {
                    found: true,
                    count:
                        Number.isFinite(count)
                            ? count
                            : 0
                };

            }

        }


        return {
            found: false,
            count: 0
        };

    }


    /* ============================================================
       RESULTADO HIBP
       ============================================================ */

    function showHIBPResult(
        type,
        title,
        message
    ) {

        /*
         * Remove resultado anterior
         */

        const oldResult =
            document.getElementById(
                "hibpResult"
            );


        if (oldResult) {
            oldResult.remove();
        }


        const result =
            document.createElement("div");


        result.id =
            "hibpResult";


        result.style.marginTop =
            "18px";


        result.style.padding =
            "18px";


        result.style.borderRadius =
            "12px";


        result.style.border =
            "1px solid";


        result.style.fontWeight =
            "500";


        if (type === "danger") {

            result.style.background =
                "#fef2f2";

            result.style.borderColor =
                "#fca5a5";

            result.style.color =
                "#991b1b";


            result.innerHTML = `
                <strong style="display:block;margin-bottom:6px;">
                    🚨 ${escapeHtml(title)}
                </strong>

                <span>
                    ${escapeHtml(message)}
                </span>
            `;

        } else if (type === "success") {

            result.style.background =
                "#f0fdf4";

            result.style.borderColor =
                "#86efac";

            result.style.color =
                "#166534";


            result.innerHTML = `
                <strong style="display:block;margin-bottom:6px;">
                    ✓ ${escapeHtml(title)}
                </strong>

                <span>
                    ${escapeHtml(message)}
                </span>
            `;

        } else {

            result.style.background =
                "#fffbeb";

            result.style.borderColor =
                "#fcd34d";

            result.style.color =
                "#92400e";


            result.innerHTML = `
                <strong style="display:block;margin-bottom:6px;">
                    ⚠️ ${escapeHtml(title)}
                </strong>

                <span>
                    ${escapeHtml(message)}
                </span>
            `;

        }


        /*
         * Coloca o resultado antes dos botões
         */

        const actions =
            document.querySelector(
                ".checker-actions"
            );


        if (actions) {

            actions.parentNode.insertBefore(
                result,
                actions
            );

        } else {

            input.parentNode.appendChild(
                result
            );

        }

    }


    /* ============================================================
       VERIFICAR SENHA COMPROMETIDA
       ============================================================ */

    async function performHIBPCheck() {

        const password =
            input.value;


        if (!password) {

            showHIBPResult(
                "warning",
                "Digite uma senha",
                "Digite uma senha antes de iniciar a consulta."
            );

            return;

        }


        if (
            password === lastCheckedPassword
            &&
            hibpStatus
        ) {

            return;

        }


        if (checkButton) {

            checkButton.disabled =
                true;

            checkButton.textContent =
                "Consultando HIBP...";

        }


        try {

            const result =
                await checkHIBP(
                    password
                );


            lastCheckedPassword =
                password;


            if (result.found) {

                hibpStatus =
                    "found";


                /*
                 * RESULTADO VERMELHO
                 */

                showHIBPResult(
                    "danger",
                    "Senha comprometida",
                    `Essa senha foi encontrada ${result.count.toLocaleString("pt-BR")} vez(es) na base de senhas comprometidas do Have I Been Pwned. Não recomendamos utilizá-la em nenhuma conta.`
                );


            } else {

                hibpStatus =
                    "safe";


                /*
                 * RESULTADO VERDE
                 */

                showHIBPResult(
                    "success",
                    "Senha não encontrada",
                    "Essa senha não foi encontrada na base consultada do Have I Been Pwned. Isso não garante que ela seja completamente segura."
                );

            }


        } catch (error) {

            console.error(
                "SenhaLab - erro HIBP:",
                error
            );


            hibpStatus =
                "error";


            showHIBPResult(
                "warning",
                "Não foi possível consultar o HIBP",
                "A consulta não pôde ser concluída. A análise local da senha continua disponível."
            );

        }


        if (checkButton) {

            checkButton.disabled =
                false;

            checkButton.textContent =
                "Verificar senha comprometida";

        }

    }


    /* ============================================================
       EVENTO DO BOTÃO VERIFICAR
       ============================================================ */

    if (checkButton) {

        checkButton.addEventListener(
            "click",
            performHIBPCheck
        );

    }


    /* ============================================================
       DIGITAÇÃO
       ============================================================ */

    input.addEventListener(
        "input",
        () => {

            /*
             * Uma nova senha precisa de uma nova consulta.
             */

            lastCheckedPassword =
                "";

            hibpStatus =
                null;


            const oldResult =
                document.getElementById(
                    "hibpResult"
                );


            if (oldResult) {
                oldResult.remove();
            }


            renderAnalysis(
                input.value
            );

        }
    );


    /* ============================================================
       LIMPAR
       ============================================================ */

    if (clearButton) {

        clearButton.addEventListener(
            "click",
            () => {

                input.value =
                    "";

                input.type =
                    "password";


                lastCheckedPassword =
                    "";

                hibpStatus =
                    null;


                if (toggleButton) {

                    toggleButton.textContent =
                        "👁";

                    toggleButton.setAttribute(
                        "aria-label",
                        "Mostrar senha"
                    );

                }


                const oldResult =
                    document.getElementById(
                        "hibpResult"
                    );


                if (oldResult) {
                    oldResult.remove();
                }


                renderAnalysis(
                    ""
                );


                input.focus();

            }
        );

    }


    /* ============================================================
       ANÁLISE INICIAL
       ============================================================ */

    renderAnalysis(
        input.value
    );


});