"use strict";

/* =========================================================
   SENHALAB
   GERADOR DE SENHAS
   ========================================================= */

(() => {

    /* =====================================================
       CONFIGURAÇÕES
       ===================================================== */

    const LOWER =
        "abcdefghijklmnopqrstuvwxyz";

    const UPPER =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    const NUMBERS =
        "0123456789";

    const SYMBOLS =
        "!@#$%^&*()-_=+[]{};:,.?/|~";


    /*
       Caracteres considerados ambíguos.

       Exemplo:
       O / 0
       I / l / 1
       S / 5
       Z / 2
       B / 8
    */

    const AMBIGUOUS =
        new Set([
            "0",
            "O",
            "o",
            "1",
            "I",
            "l",
            "|",
            "5",
            "S",
            "s",
            "2",
            "Z",
            "z",
            "8",
            "B"
        ]);


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

           Evita o pequeno viés que aconteceria
           utilizando simplesmente:

           randomValue % max
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
       ESCOLHER UM CARACTERE
       ===================================================== */

    function randomCharacter(
        characters
    ) {

        return characters[
            randomIndex(
                characters.length
            )
        ];
    }


    /* =====================================================
       EMBARALHAR ARRAY
       ===================================================== */

    function shuffle(
        array
    ) {

        for (
            let i = array.length - 1;
            i > 0;
            i--
        ) {

            const j =
                randomIndex(
                    i + 1
                );


            [
                array[i],
                array[j]
            ] = [
                array[j],
                array[i]
            ];
        }


        return array;
    }


    /* =====================================================
       REMOVER CARACTERES AMBÍGUOS
       ===================================================== */

    function cleanCharacters(
        characters,
        avoidAmbiguous
    ) {

        if (
            !avoidAmbiguous
        ) {
            return characters;
        }


        return [
            ...characters
        ]
            .filter(
                character =>
                    !AMBIGUOUS.has(
                        character
                    )
            )
            .join("");
    }


    /* =====================================================
       GERAR SENHA
       ===================================================== */

    function generatePassword(
        length,
        options
    ) {

        const sets = [];


        /*
           Adiciona os conjuntos selecionados
        */

        if (options.lowercase) {

            const characters =
                cleanCharacters(
                    LOWER,
                    options.avoidAmbiguous
                );


            if (characters.length > 0) {

                sets.push(
                    characters
                );
            }
        }


        if (options.uppercase) {

            const characters =
                cleanCharacters(
                    UPPER,
                    options.avoidAmbiguous
                );


            if (characters.length > 0) {

                sets.push(
                    characters
                );
            }
        }


        if (options.numbers) {

            const characters =
                cleanCharacters(
                    NUMBERS,
                    options.avoidAmbiguous
                );


            if (characters.length > 0) {

                sets.push(
                    characters
                );
            }
        }


        if (options.symbols) {

            const characters =
                cleanCharacters(
                    SYMBOLS,
                    options.avoidAmbiguous
                );


            if (characters.length > 0) {

                sets.push(
                    characters
                );
            }
        }


        /*
           Nenhum tipo selecionado
        */

        if (
            sets.length === 0
        ) {

            throw new Error(
                "Selecione pelo menos um tipo de caractere."
            );
        }


        /*
           É necessário ter pelo menos
           um caractere para cada categoria
           selecionada.
        */

        if (
            length < sets.length
        ) {

            throw new Error(
                "Aumente o comprimento da senha."
            );
        }


        /*
           Junta todos os conjuntos
           para formar o pool geral.
        */

        const pool =
            sets.join("");


        /*
           Primeiro garantimos pelo menos
           um caractere de cada categoria.
        */

        const result =
            sets.map(
                set =>
                    randomCharacter(
                        set
                    )
            );


        /*
           Preenche o restante da senha
        */

        while (
            result.length < length
        ) {

            result.push(
                randomCharacter(
                    pool
                )
            );
        }


        /*
           Embaralha para que os caracteres
           obrigatórios não fiquem previsíveis
           nas primeiras posições.
        */

        shuffle(
            result
        );


        return result.join("");
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
                "Não foi possível copiar:",
                error
            );


            return false;
        }
    }


    /* =====================================================
       CALCULAR FORÇA ESTIMADA
       ===================================================== */

    function calculateStrength(
        password,
        poolSize
    ) {

        if (
            !password ||
            poolSize <= 0
        ) {

            return {
                entropy: 0,
                label: "Fraca",
                width: 20
            };
        }


        /*
           Entropia aproximada:

           comprimento × log2(pool)

           É uma estimativa da quantidade
           de possibilidades da senha.
        */

        const entropy =
            password.length *
            Math.log2(
                poolSize
            );


        if (
            entropy >= 90
        ) {

            return {
                entropy,
                label: "Muito forte",
                width: 100
            };
        }


        if (
            entropy >= 70
        ) {

            return {
                entropy,
                label: "Forte",
                width: 80
            };
        }


        if (
            entropy >= 50
        ) {

            return {
                entropy,
                label: "Boa",
                width: 60
            };
        }


        return {
            entropy,
            label: "Fraca",
            width: 20
        };
    }


    /* =====================================================
       INICIALIZAÇÃO
       ===================================================== */

    function initPasswordGenerator() {

        const output =
            document.getElementById(
                "passwordOutput"
            );


        /*
           Se não estamos na página
           do gerador, simplesmente saímos.
        */

        if (!output) {
            return;
        }


        const lengthInput =
            document.getElementById(
                "passwordLength"
            );


        const lengthValue =
            document.getElementById(
                "lengthValue"
            );


        const copyButton =
            document.getElementById(
                "copyPassword"
            );


        const generateButton =
            document.getElementById(
                "generatePassword"
            );


        const strengthLabel =
            document.getElementById(
                "strengthLabel"
            );


        const strengthFill =
            document.getElementById(
                "strengthFill"
            );


        /*
           Verificação dos elementos essenciais
        */

        if (
            !lengthInput ||
            !lengthValue ||
            !copyButton ||
            !generateButton
        ) {

            console.error(
                "SenhaLab: elementos do gerador de senha não encontrados."
            );

            return;
        }


        /* =================================================
           OBTER OPÇÕES
           ================================================= */

        function getOptions() {

            const lowercase =
                document.getElementById(
                    "lowercase"
                );


            const uppercase =
                document.getElementById(
                    "uppercase"
                );


            const numbers =
                document.getElementById(
                    "numbers"
                );


            const symbols =
                document.getElementById(
                    "symbols"
                );


            const avoidAmbiguous =
                document.getElementById(
                    "avoidAmbiguous"
                );


            return {

                lowercase:
                    lowercase
                        ? lowercase.checked
                        : false,

                uppercase:
                    uppercase
                        ? uppercase.checked
                        : false,

                numbers:
                    numbers
                        ? numbers.checked
                        : false,

                symbols:
                    symbols
                        ? symbols.checked
                        : false,

                avoidAmbiguous:
                    avoidAmbiguous
                        ? avoidAmbiguous.checked
                        : false
            };
        }


        /* =================================================
           ATUALIZAR FORÇA
           ================================================= */

        function updateStrength(
            password,
            poolSize
        ) {

            const strength =
                calculateStrength(
                    password,
                    poolSize
                );


            if (
                strengthLabel
            ) {

                strengthLabel.textContent =
                    strength.label;
            }


            if (
                strengthFill
            ) {

                strengthFill.style.width =
                    strength.width +
                    "%";
            }
        }


        /* =================================================
           GERAR / ATUALIZAR
           ================================================= */

        function refresh() {

            try {

                const options =
                    getOptions();


                const length =
                    Number(
                        lengthInput.value
                    );


                /*
                   Montamos os mesmos conjuntos
                   usados na geração.
                */

                const sets = [];


                if (
                    options.lowercase
                ) {

                    const set =
                        cleanCharacters(
                            LOWER,
                            options.avoidAmbiguous
                        );


                    if (set) {
                        sets.push(set);
                    }
                }


                if (
                    options.uppercase
                ) {

                    const set =
                        cleanCharacters(
                            UPPER,
                            options.avoidAmbiguous
                        );


                    if (set) {
                        sets.push(set);
                    }
                }


                if (
                    options.numbers
                ) {

                    const set =
                        cleanCharacters(
                            NUMBERS,
                            options.avoidAmbiguous
                        );


                    if (set) {
                        sets.push(set);
                    }
                }


                if (
                    options.symbols
                ) {

                    const set =
                        cleanCharacters(
                            SYMBOLS,
                            options.avoidAmbiguous
                        );


                    if (set) {
                        sets.push(set);
                    }
                }


                /*
                   Gera a senha.
                */

                const password =
                    generatePassword(
                        length,
                        options
                    );


                /*
                   Mostra a senha.
                */

                output.textContent =
                    password;


                /*
                   Atualiza contador.
                */

                lengthValue.textContent =
                    length;


                /*
                   Calcula força.
                */

                const poolSize =
                    sets.join("").length;


                updateStrength(
                    password,
                    poolSize
                );


            } catch (
                error
            ) {

                console.error(
                    "SenhaLab - erro no gerador:",
                    error
                );


                output.textContent =
                    error.message;


                if (
                    strengthLabel
                ) {

                    strengthLabel.textContent =
                        "Erro";
                }


                if (
                    strengthFill
                ) {

                    strengthFill.style.width =
                        "0%";
                }
            }
        }


        /* =================================================
           CHECKBOXES
           ================================================= */

        const optionIds = [

            "lowercase",

            "uppercase",

            "numbers",

            "symbols",

            "avoidAmbiguous"

        ];


        optionIds.forEach(
            id => {

                const element =
                    document.getElementById(
                        id
                    );


                if (!element) {
                    return;
                }


                element.addEventListener(
                    "change",
                    refresh
                );
            }
        );


        /* =================================================
           CONTROLE DE COMPRIMENTO
           ================================================= */

        lengthInput.addEventListener(
            "input",
            refresh
        );


        /* =================================================
           GERAR NOVA SENHA
           ================================================= */

        generateButton.addEventListener(
            "click",
            refresh
        );


        /* =================================================
           COPIAR SENHA
           ================================================= */

        copyButton.addEventListener(
            "click",
            async () => {

                const password =
                    output.textContent;


                if (
                    !password
                ) {
                    return;
                }


                const originalText =
                    copyButton.textContent;


                const success =
                    await copyToClipboard(
                        password
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
            initPasswordGenerator
        );

    } else {

        initPasswordGenerator();
    }

})();