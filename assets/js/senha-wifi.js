"use strict";

/* =========================================================
   SENHALAB
   GERADOR DE SENHA WI-FI
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const output =
        document.getElementById("wifiOutput");

    if (!output) {
        return;
    }

    const lengthInput =
        document.getElementById("wifiLength");

    const lengthValue =
        document.getElementById("wifiLengthValue");

    const copyButton =
        document.getElementById("copyWifi");

    const generateButton =
        document.getElementById("generateWifi");


    if (
        !lengthInput ||
        !lengthValue ||
        !copyButton ||
        !generateButton
    ) {
        console.error(
            "SenhaLab: elementos do gerador Wi-Fi não foram encontrados."
        );

        return;
    }


    /* =====================================================
       CARACTERES
       ===================================================== */

    const characters =
        "ABCDEFGHJKLMNPQRSTUVWXYZ" +
        "abcdefghijkmnopqrstuvwxyz" +
        "23456789!@#$%*-_+=";


    /* =====================================================
       ALEATORIEDADE CRIPTOGRÁFICA
       ===================================================== */

    function randomIndex(max) {

        if (max <= 0) {

            throw new Error(
                "Valor inválido para geração aleatória."
            );
        }


        const array =
            new Uint32Array(1);


        const limit =
            Math.floor(
                0x100000000 / max
            ) * max;


        let value;


        do {

            crypto.getRandomValues(
                array
            );

            value =
                array[0];

        } while (
            value >= limit
        );


        return value % max;
    }


    /* =====================================================
       GERAÇÃO DA SENHA
       ===================================================== */

    function generatePassword() {

        const length =
            Number(
                lengthInput.value
            );


        if (
            !Number.isInteger(length) ||
            length < 8 ||
            length > 63
        ) {

            throw new Error(
                "O tamanho da senha deve estar entre 8 e 63 caracteres."
            );
        }


        let password = "";


        for (
            let i = 0;
            i < length;
            i++
        ) {

            password +=
                characters[
                    randomIndex(
                        characters.length
                    )
                ];
        }


        return password;
    }


    /* =====================================================
       ATUALIZA INTERFACE
       ===================================================== */

    function refresh() {

        try {

            const password =
                generatePassword();


            output.textContent =
                password;


            lengthValue.textContent =
                lengthInput.value;


        } catch (error) {

            console.error(
                "Erro no gerador Wi-Fi:",
                error
            );


            output.textContent =
                error.message;
        }
    }


    /* =====================================================
       SLIDER
       ===================================================== */

    lengthInput.addEventListener(
        "input",
        () => {

            lengthValue.textContent =
                lengthInput.value;

        }
    );


    /* =====================================================
       BOTÃO GERAR
       ===================================================== */

    generateButton.addEventListener(
        "click",
        refresh
    );


    /* =====================================================
       COPIAR
       ===================================================== */

    copyButton.addEventListener(
        "click",
        async () => {

            const password =
                output.textContent;


            if (
                !password ||
                password ===
                "Erro na geração."
            ) {
                return;
            }


            try {

                await navigator
                    .clipboard
                    .writeText(
                        password
                    );

            } catch {

                const textarea =
                    document.createElement(
                        "textarea"
                    );


                textarea.value =
                    password;


                textarea.style.position =
                    "fixed";


                textarea.style.opacity =
                    "0";


                document.body.appendChild(
                    textarea
                );


                textarea.focus();

                textarea.select();


                document.execCommand(
                    "copy"
                );


                textarea.remove();
            }


            const originalText =
                copyButton.textContent;


            copyButton.textContent =
                "Copiado!";


            copyButton.disabled =
                true;


            setTimeout(() => {

                copyButton.textContent =
                    originalText ||
                    "Copiar senha";


                copyButton.disabled =
                    false;

            }, 1200);
        }
    );


    /* =====================================================
       INICIALIZAÇÃO
       ===================================================== */

    refresh();

});