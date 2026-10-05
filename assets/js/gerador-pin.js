"use strict";

/* =========================================================
   SENHALAB
   GERADOR DE PIN
   ========================================================= */

(() => {

    /* =====================================================
       CONFIGURAÇÕES
       ===================================================== */

    const MIN_LENGTH = 4;
    const MAX_LENGTH = 12;


    /* =====================================================
       ALEATORIEDADE CRIPTOGRÁFICA
       ===================================================== */

    function randomIndex(max) {

        if (
            !Number.isInteger(max) ||
            max <= 0
        ) {
            throw new Error(
                "Valor inválido para geração aleatória."
            );
        }


        const buffer =
            new Uint32Array(1);


        /*
           Rejection sampling.

           Evita viés estatístico ao transformar
           o número aleatório em um índice.
        */

        const limit =
            Math.floor(
                0x100000000 / max
            ) * max;


        let value;


        do {

            crypto.getRandomValues(
                buffer
            );

            value =
                buffer[0];

        } while (
            value >= limit
        );


        return value % max;
    }


    /* =====================================================
       GERAR PIN
       ===================================================== */

    function generatePin(
        length
    ) {

        const safeLength =
            Math.min(
                MAX_LENGTH,
                Math.max(
                    MIN_LENGTH,
                    Number(length)
                )
            );


        let pin = "";


        for (
            let i = 0;
            i < safeLength;
            i++
        ) {

            pin +=
                randomIndex(10);
        }


        return pin;
    }


    /* =====================================================
       COPIAR PARA ÁREA DE TRANSFERÊNCIA
       ===================================================== */

    async function copyToClipboard(
        text
    ) {

        /*
           Método moderno
        */

        try {

            if (
                navigator.clipboard &&
                window.isSecureContext
            ) {

                await navigator.clipboard
                    .writeText(
                        text
                    );

                return true;
            }

        } catch (
            error
        ) {

            console.warn(
                "Clipboard API indisponível:",
                error
            );
        }


        /*
           Fallback para navegadores
           que não permitem Clipboard API.
        */

        try {

            const textarea =
                document.createElement(
                    "textarea"
                );


            textarea.value =
                text;


            textarea.setAttribute(
                "readonly",
                ""
            );


            textarea.style.position =
                "fixed";


            textarea.style.opacity =
                "0";


            textarea.style.pointerEvents =
                "none";


            document.body.appendChild(
                textarea
            );


            textarea.select();


            const success =
                document.execCommand(
                    "copy"
                );


            textarea.remove();


            return success;

        } catch (
            error
        ) {

            console.error(
                "Não foi possível copiar o PIN:",
                error
            );


            return false;
        }
    }


    /* =====================================================
       INICIALIZAÇÃO
       ===================================================== */

    function initPinGenerator() {

        const output =
            document.getElementById(
                "pinOutput"
            );


        /*
           Se não estamos na página
           do gerador de PIN, não fazemos nada.
        */

        if (!output) {
            return;
        }


        const lengthInput =
            document.getElementById(
                "pinLength"
            );


        const lengthValue =
            document.getElementById(
                "pinLengthValue"
            );


        const copyButton =
            document.getElementById(
                "copyPin"
            );


        const generateButton =
            document.getElementById(
                "generatePin"
            );


        /*
           Verificação dos elementos necessários.
        */

        if (
            !lengthInput ||
            !lengthValue ||
            !copyButton ||
            !generateButton
        ) {

            console.error(
                "SenhaLab: elementos do gerador de PIN não encontrados."
            );

            return;
        }


        /* =================================================
           ATUALIZAR PIN
           ================================================= */

        function refresh() {

            try {

                let length =
                    Number(
                        lengthInput.value
                    );


                /*
                   Garante que o valor fique
                   dentro do intervalo permitido.
                */

                if (
                    !Number.isFinite(length)
                ) {

                    length =
                        MIN_LENGTH;
                }


                length =
                    Math.round(
                        length
                    );


                length =
                    Math.min(
                        MAX_LENGTH,
                        Math.max(
                            MIN_LENGTH,
                            length
                        )
                    );


                /*
                   Mantém o slider sincronizado.
                */

                lengthInput.value =
                    length;


                /*
                   Atualiza o número mostrado
                   ao usuário.
                */

                lengthValue.textContent =
                    length;


                /*
                   Gera o novo PIN.
                */

                const pin =
                    generatePin(
                        length
                    );


                /*
                   Mostra o PIN.
                */

                output.textContent =
                    pin;


            } catch (
                error
            ) {

                console.error(
                    "SenhaLab - erro no gerador de PIN:",
                    error
                );


                output.textContent =
                    "Erro ao gerar PIN";
            }
        }


        /* =================================================
           ALTERAÇÃO DO COMPRIMENTO
           ================================================= */

        lengthInput.addEventListener(
            "input",
            refresh
        );


        /* =================================================
           GERAR NOVO PIN
           ================================================= */

        generateButton.addEventListener(
            "click",
            refresh
        );


        /* =================================================
           COPIAR PIN
           ================================================= */

        copyButton.addEventListener(
            "click",
            async () => {

                const pin =
                    output.textContent.trim();


                /*
                   Não tenta copiar mensagens
                   de erro ou resultado vazio.
                */

                if (
                    !pin ||
                    !/^\d+$/.test(pin)
                ) {

                    return;
                }


                const originalText =
                    copyButton.textContent;


                const success =
                    await copyToClipboard(
                        pin
                    );


                if (
                    success
                ) {

                    copyButton.textContent =
                        "Copiado!";


                    setTimeout(
                        () => {

                            copyButton.textContent =
                                originalText;

                        },
                        1200
                    );


                } else {

                    copyButton.textContent =
                        "Não foi possível copiar";


                    setTimeout(
                        () => {

                            copyButton.textContent =
                                originalText;

                        },
                        1800
                    );
                }
            }
        );


        /* =================================================
           PRIMEIRA GERAÇÃO
           ================================================= */

        refresh();
    }


    /* =====================================================
       DOM READY
       ===================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initPinGenerator
        );

    } else {

        initPinGenerator();
    }

})();