# 🔐 SenhaLab

**Ferramentas gratuitas para segurança digital, simples, rápidas e feitas para funcionar diretamente no navegador.**

O **SenhaLab** é um projeto focado em ajudar usuários a proteger melhor suas contas através de ferramentas práticas relacionadas a senhas e segurança digital.

🌐 **Site:** https://senhalab.com.br/

---

## 🛡️ Ferramentas

O SenhaLab oferece ferramentas gratuitas para diferentes necessidades de segurança digital:

### 🔑 Gerador de senhas

Crie senhas aleatórias e fortes diretamente no navegador.

É possível personalizar:

* Comprimento da senha
* Letras maiúsculas
* Letras minúsculas
* Números
* Símbolos
* Caracteres ambíguos

A geração utiliza aleatoriedade criptograficamente segura disponível no navegador.

---

### 📊 Verificador de força de senha

Analise características de uma senha e veja uma estimativa de sua força.

A ferramenta considera fatores como:

* Comprimento
* Letras maiúsculas
* Letras minúsculas
* Números
* Símbolos
* Sequências simples
* Repetições
* Padrões previsíveis
* Variedade de caracteres

A análise inicial é realizada localmente no navegador.

---

### 🕵️ Verificador de vazamentos

Consulte se uma senha aparece em bases de senhas comprometidas utilizando a API do **Have I Been Pwned**.

O SenhaLab utiliza o modelo de **k-anonymity**, evitando enviar a senha completa durante a consulta.

O processamento é realizado de forma que a senha original não seja enviada ao SenhaLab.

---

### 📌 Gerador de PIN

Gere códigos PIN aleatórios para diferentes necessidades.

A geração acontece diretamente no navegador, sem necessidade de cadastro ou envio dos dados para um servidor.

---

### 📶 Gerador de senha Wi-Fi

Crie senhas aleatórias para redes Wi-Fi com comprimento personalizado.

A ferramenta foi desenvolvida para gerar credenciais mais difíceis de adivinhar e evitar senhas simples ou previsíveis.

---

## 📚 Conteúdo sobre segurança digital

Além das ferramentas, o SenhaLab possui artigos educativos sobre segurança digital.

Entre os assuntos abordados estão:

* O que é uma senha forte?
* Autenticação multifator (MFA)
* Gerenciadores de senhas
* Senhas comprometidas e vazamentos
* Boas práticas para proteção de contas

O objetivo é transformar conceitos de segurança digital em informações simples e práticas para usuários comuns.

---

## 🔒 Privacidade

A privacidade é uma das principais preocupações do projeto.

Sempre que possível, as ferramentas são executadas diretamente no navegador do usuário, reduzindo a necessidade de enviar informações para servidores.

O SenhaLab não exige cadastro para utilizar suas ferramentas.

No caso do verificador de vazamentos, a consulta utiliza o mecanismo de **k-anonymity** do Have I Been Pwned para evitar o envio da senha completa.

---

## 🧰 Tecnologias

O projeto é desenvolvido utilizando tecnologias web simples e leves:

* HTML5
* CSS3
* JavaScript
* APIs nativas do navegador
* Web Crypto API
* Have I Been Pwned API

O projeto não depende de frameworks pesados para o funcionamento das ferramentas principais.

---

## 📁 Estrutura do projeto

```text
/
├── artigos/
│   ├── gerenciador-de-senhas.html
│   ├── mfa.html
│   ├── senha-forte.html
│   └── ...
│
├── assets/
│   ├── css/
│   │   └── style.css
│   │
│   ├── images/
│   │   └── S.png
│   │
│   └── js/
│       ├── gerador-senha.js
│       ├── gerador-pin.js
│       ├── senha-wifi.js
│       ├── verificador-forca.js
│       └── verificador-vazamentos.js
│
├── ferramentas/
│   ├── gerador-de-pin.html
│   ├── senha-wifi.html
│   ├── verificador-de-forca.html
│   └── verificador-de-vazamentos.html
│
├── 404.html
├── artigos.html
├── contato.html
├── ferramentas.html
├── index.html
├── privacidade.html
├── sobre.html
├── termos.html
├── robots.txt
└── sitemap.xml
```

---

## 🎯 Objetivo do projeto

O objetivo do SenhaLab é tornar boas práticas de segurança digital mais acessíveis.

Em vez de exigir conhecimento técnico, o projeto busca oferecer ferramentas que qualquer pessoa consiga utilizar de forma rápida e intuitiva.

---

## 🌐 Acesse o SenhaLab

**https://senhalab.com.br/**

Explore as ferramentas e aprenda mais sobre segurança digital através dos artigos disponíveis no site.

---

## 📄 Licença

Este projeto é disponibilizado para fins educacionais e de segurança digital.

Consulte os termos e informações de uso disponíveis no próprio site antes de reutilizar qualquer parte do projeto.
