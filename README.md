# SenhaLab

Versão corrigida do site.

## Testar

Na pasta do projeto, execute:

```bash
python -m http.server 8000
```

Depois abra http://localhost:8000

## Correções desta versão

- SenhaLab padronizado em todas as páginas.
- Navegação padronizada e links para Home em todas as páginas.
- CSS e JavaScript com caminhos absolutos para evitar perda de formatação em subpastas.
- Cache busting do CSS/JS para evitar que o navegador carregue a versão antiga.
- Senhas longas agora quebram dentro do campo e não aumentam a largura da página.
- Gerador responsivo em desktop e celular.
- Geração de credenciais continua usando crypto.getRandomValues().
