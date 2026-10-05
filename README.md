# SenhaLab

Ferramentas gratuitas para geração de senhas, PINs e credenciais para redes Wi-Fi.

O SenhaLab foi criado com o objetivo de oferecer ferramentas simples, rápidas e gratuitas para ajudar usuários a melhorar suas práticas de segurança digital.

## 🔐 Ferramentas

Atualmente o projeto possui:

- Gerador de senhas fortes
- Gerador de PIN
- Gerador de senha para Wi-Fi
- Artigos sobre segurança digital

## 🚀 Principais características

- Gratuito
- Sem cadastro
- Sem necessidade de login
- Geração realizada diretamente no navegador
- Senhas não são enviadas para um servidor
- Interface responsiva para computador e celular
- Geração de valores aleatórios utilizando `crypto.getRandomValues()`

## 🛠️ Tecnologias

O projeto foi desenvolvido utilizando:

- HTML5
- CSS3
- JavaScript
- Web Crypto API

Não são utilizadas bibliotecas ou frameworks externos para o funcionamento das ferramentas.

## ▶️ Executando localmente

Clone o repositório:


git clone https://github.com/SEU-USUARIO/senhalab.git

Entre na pasta:

cd senhalab

Inicie um servidor local:

python -m http.server 8000

Depois acesse:

http://localhost:8000

🔒 Segurança

As ferramentas de geração utilizam a Web Crypto API do navegador através de crypto.getRandomValues() para gerar valores aleatórios.

As credenciais geradas são processadas localmente no navegador e não precisam ser enviadas para um servidor.

O projeto tem finalidade educacional e informativa e não substitui políticas ou avaliações profissionais de segurança da informação.

📁 Estrutura do projeto
senhalab/
├── index.html
├── ferramentas.html
├── artigos.html
├── sobre.html
├── privacidade.html
├── termos.html
├── contato.html
├── 404.html
├── robots.txt
├── sitemap.xml
│
├── artigos/
│   ├── senha-forte.html
│   ├── mfa.html
│   └── gerenciador-de-senhas.html
│
├── ferramentas/
│   ├── gerador-de-pin.html
│   └── senha-wifi.html
│
└── assets/
    ├── css/
    │   └── style.css
    └── js/
        └── app.js
        
📌 Status do projeto

Em desenvolvimento.

Novas ferramentas e conteúdos de segurança digital poderão ser adicionados futuramente.

📄 Licença

Este projeto ainda não possui uma licença definida.
