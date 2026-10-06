"use strict";

/* =========================================================
   SENHALAB
   MENU MOBILE
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const menuButton =
        document.querySelector(".menu-toggle");

    const nav =
        document.querySelector(".nav");


    if (!menuButton || !nav) {
        return;
    }


    /* =====================================================
       ESTADO INICIAL
       ===================================================== */

    menuButton.setAttribute(
        "aria-expanded",
        "false"
    );


    /* =====================================================
       ABRIR / FECHAR MENU
       ===================================================== */

    menuButton.addEventListener(
        "click",
        () => {

            const isOpen =
                nav.classList.toggle("open");


            menuButton.setAttribute(
                "aria-expanded",
                String(isOpen)
            );


            menuButton.setAttribute(
                "aria-label",
                isOpen
                    ? "Fechar menu"
                    : "Abrir menu"
            );
        }
    );


    /* =====================================================
       FECHAR MENU AO CLICAR EM UM LINK
       ===================================================== */

    const navLinks =
        nav.querySelectorAll("a");


    navLinks.forEach(
        link => {

            link.addEventListener(
                "click",
                () => {

                    nav.classList.remove(
                        "open"
                    );


                    menuButton.setAttribute(
                        "aria-expanded",
                        "false"
                    );


                    menuButton.setAttribute(
                        "aria-label",
                        "Abrir menu"
                    );
                }
            );
        }
    );


    /* =====================================================
       FECHAR MENU AO AUMENTAR A TELA
       ===================================================== */

    window.addEventListener(
        "resize",
        () => {

            if (
                window.innerWidth > 760
            ) {

                nav.classList.remove(
                    "open"
                );


                menuButton.setAttribute(
                    "aria-expanded",
                    "false"
                );


                menuButton.setAttribute(
                    "aria-label",
                    "Abrir menu"
                );
            }
        }
    );

});