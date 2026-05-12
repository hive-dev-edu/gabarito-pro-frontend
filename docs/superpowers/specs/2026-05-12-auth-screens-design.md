# Auth Screens Redesign — Gabarito.pro

**Data:** 2026-05-12  
**Escopo:** Todas as 5 telas de autenticação + 3 modais  
**Abordagem:** Rewrite JSX in-place em cada arquivo, lógica existente preservada

---

## Decisões de Design

| Decisão | Escolha |
|---------|---------|
| Tipografia | Fontes do sistema — `Georgia` (serif/display), `-apple-system` (sans), `monospace` (mono) |
| Mobile (Login) | Hero oculto — apenas formulário + topbar teal com logo |
| Citações hero | Animadas — 3 frases, rotação a cada 6s, dots de navegação clicáveis |
| Stats | Estáticos hardcoded: 12k+ professores, 180k+ questões, 2.3M+ correções |

---

## Paleta de Cores

```
--teal-700: #197F77   (primary dark / hero gradient start)
--indigo-700: #1E1B4B (hero gradient end)
--teal-500: #2EC5B6   (botões, focus ring, accent)
--amber-300: #FFD666  (highlight de texto, dots ativos)
--stone-50: #FAF8F5   (background de página)
--stone-800: #2A2621  (texto principal)
--stone-500: #827B6E  (texto muted)
--stone-200: #E0DBD1  (bordas de input)
--danger: #E5484D     (erros)
```

---

## Tela 1 — Login (`/login`)

**Arquivo:** `src/pages/Login/Login.tsx`

**Layout desktop:** Grid 50/50 — hero esquerda, formulário direita.

### Painel Esquerdo (Hero)
- Gradiente `linear-gradient(135deg, #197F77, #1E1B4B)`
- Grid de pontos decorativo: `radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)` em 24×24px
- Logo: mark quadrado arredondado + "Gabarito.pro"
- Eyebrow monospace: "· Aprender junto é aprender melhor" com linha âmbar de 24px
- Citação rotativa (Georgia italic, 42px, linha de destaque âmbar), autor
- Dots de navegação: dot ativo = largura 24px + cor âmbar; inativo = 6px + rgba branco
- `useEffect` com `setInterval(6000)` troca citação automaticamente
- Stats footer: "12k+ professores", "180k+ questões", "2.3M+ correções" com `border-top rgba(255,255,255,0.15)`
- SVG decorativo de lápis no canto inferior direito (opacidade 0.08)

### Painel Direito (Formulário)
- Fundo `#FAF8F5`, padding 48px, centralizado
- Eyebrow monospace uppercase: "· Bem-vinda de volta"
- Título Georgia italic: `Entre na sua <em>sala dos professores</em>.` (teal no itálico)
- Campo Email: label uppercase + ícone `<Mail>` lucide à esquerda
- Campo Senha: label uppercase + ícone `<Lock>` lucide à esquerda + botão olho à direita + "Esqueceu a senha?" alinhado ao label (Link para `/esqueceu-senha`)
- Botão "Fazer Login": fundo teal, largura total, border-radius 10px
- Divisor "ou" em monospace
- Botão Google: borda, ícone `<FcGoogle>`, "Continuar com Google"
- Link: "Novo por aqui? Criar uma conta →"

**Mobile (`< md`):** Coluna única — topbar teal com logo, abaixo o formulário completo. Hero oculto com `hidden md:grid`.

**Lógica preservada:**
- `validarFormulario()` — validação email regex + senha mínimo 8 chars
- `handleLogin()` — submit async com loading state
- `loginComGoogle()` — `useGoogleLogin` flow auth-code
- States: `email`, `senha`, `errorEmail`, `errorSenha`, `errorLogin`, `carregando`, `carregandoGoogle`

---

## Tela 2 — Cadastro (`/cadastrar`)

**Arquivo:** `src/pages/Cadastro/Cadastro.tsx`

**Layout:** Página centralizada, fundo `#FAF8F5` com notebook-bg grid, card branco máx 460px com `box-shadow`.

### Conteúdo do Card
- Logo no topo (centralizado)
- Eyebrow: "· Criar conta"
- Título: `Bem-vindo(a) ao <em>corpo docente</em>.`
- Campo Nome Completo: sem ícone, placeholder "Como gostaria de ser chamado(a)?"
- Campo Email: ícone `<Mail>`
- Campo Senha: ícone `<Lock>` + botão olho
  - **Strength meter** abaixo: 4 segmentos coloridos (`#E5484D` fraca → `#2EC5B6` excelente) + label "Fraca/Ok/Boa/Excelente" + contador `N/12+`
- Campo Confirmar Senha: ícone `<Lock>` + ícone `<Check>` teal quando senhas coincidem
  - Mensagem de erro "As senhas não conferem" quando divergem
- Botão "Criar Conta" (teal)
- Divisor "ou"
- Botão "Criar conta com Google" (`<FcGoogle>`)
- Link: "Já tem conta? Fazer login"

**Strength meter logic:**
```ts
const strength = (pw: string): 0|1|2|3|4 => {
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return Math.min(s, 4) as 0|1|2|3|4;
};
const strengthColors = ['#E5484D','#E5484D','#F5B800','#2EC5B6','#197F77'];
const strengthLabels = ['Muito fraca','Fraca','Ok','Boa','Excelente'];
```

**Lógica preservada:** `validarFormulario()`, `handleLogin()` (submit cadastro), `loginComGoogle()`, modal `ModalCadastro` no sucesso.

**Modal `ModalCadastro` redesenhado:** Fundo overlay, card centralizado, ícone `<Mail>` em círculo teal, título "Quase lá, professor(a)!", instrução de verificar email, botão "Ir para verificação" (`<Link to="/verify">`).

---

## Tela 3 — Esqueceu Senha (`/esqueceu-senha`)

**Arquivo:** `src/pages/EsqueceuSenha/EsqueceuSenha.tsx`

**Layout:** Página centralizada, card branco máx 420px.

### Estado inicial (formulário)
- Logo no topo
- Título: `Recuperar <em>acesso</em>`
- Subtexto: "Informe seu email e enviaremos um link para você criar uma nova senha."
- Campo Email com ícone `<Mail>`
- Botão "Enviar link de recuperação" (teal) — mostra "Reenviar Email" quando `jaClicado`
- Botão ghost "← Voltar ao login" (Link para `/login`)

**Lógica preservada:** `validarFormulario()`, `handleSubmit()`, loading state, `modalAberto`, `jaClicado`.

**Modal `ModalEsqueceuSenha` redesenhado:** Ícone `<Mail>` em círculo teal, título "Email enviado!", exibe `message` do serviço + instrução de verificar caixa de entrada, botão fechar.

---

## Tela 4 — Verificar Token (`/verify`)

**Arquivo:** `src/pages/VerificarToken/VerificarToken.tsx`

**Layout:** Página centralizada, card branco máx 440px, textAlign center.

### 3 estados (lógica existente, visual novo)
| Estado | Visual |
|--------|--------|
| `carregando = true` | Spinner animado (pulse) + título "Verificando token…" + subtexto |
| `tokenValido = true` | SealStamp SVG (círculo teal + ✓) + título "Conta *validada!*" + botão "Entrar no Dashboard" |
| `tokenValido = false` | Círculo vermelho + ✕ + título "Token inválido ou expirado" + subtexto de redirecionamento |

**SealStamp:** SVG inline — círculo tracejado + círculo teal + check animado (`strokeDashoffset` → 0). Mesma implementação do protótipo.

**Lógica preservada:** `useEffect` com verificação de token via `searchParams.get("token")`, `jaVerificou` ref, navegação automática após 3s.

---

## Tela 5 — Redefinir Senha (`/reset-password`)

**Arquivo:** `src/pages/RedefinirSenha/RedefinirSenha.tsx`

**Layout:** Página centralizada, card branco máx 420px.

### Estado inicial (formulário)
- Logo no topo
- Título: `Criar <em>nova senha</em>`
- Subtexto: "Escolha uma senha forte que você vai lembrar."
- Campo Nova Senha: ícone `<Lock>` + botão olho + strength meter (igual Cadastro)
- Campo Confirmar Nova Senha: ícone `<Lock>` + erro quando divergem
- Botão "Salvar nova senha" — desabilitado enquanto `strength < 2` ou senhas não coincidem

**Lógica preservada:** `validarFormulario()`, `handleRedefinirSenha()`, `searchParams.get("token")`, `errorRedefinirSenha`, modal `ModalRedefinirSenha` no sucesso.

**Modal `ModalRedefinirSenha` redesenhado:** SealStamp + título "Senha redefinida" + botão "Fazer login" que chama `navigateToLogin()`.

---

## Átomos de UI reutilizados entre telas

Estes padrões se repetem e devem ser implementados de forma consistente (sem extrair componente — reuso via copiar o mesmo padrão JSX):

**Field com ícone:**
```tsx
<div className="relative">
  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
  <input className="w-full pl-8 pr-3 py-2.5 border border-[#E0DBD1] rounded-[10px] text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2EC5B6]/20 focus:border-[#2EC5B6]" />
</div>
```

**Botão primário:** `bg-[#2EC5B6] text-white w-full py-2.5 rounded-[10px] font-semibold text-sm`

**Botão Google:** `w-full border border-stone-200 rounded-[10px] py-2.5 flex items-center justify-center gap-2 text-sm font-medium bg-white`

**Logo mark:** `w-8 h-8 rounded-[9px] bg-gradient-to-br from-[#2EC5B6] to-[#197F77] flex items-center justify-center text-white font-black text-sm`

---

## Arquivos a modificar

| Arquivo | Tipo de mudança |
|---------|----------------|
| `src/pages/Login/Login.tsx` | Rewrite JSX completo, lógica intacta |
| `src/pages/Cadastro/Cadastro.tsx` | Rewrite JSX + adicionar strength meter |
| `src/pages/Cadastro/components/ModalCadastro.tsx` | Redesign do modal |
| `src/pages/EsqueceuSenha/EsqueceuSenha.tsx` | Rewrite JSX, lógica intacta |
| `src/pages/EsqueceuSenha/components/ModalEsqueceuSenha.tsx` | Redesign do modal |
| `src/pages/VerificarToken/VerificarToken.tsx` | Rewrite JSX + SealStamp SVG |
| `src/pages/RedefinirSenha/RedefinirSenha.tsx` | Rewrite JSX + strength meter |
| `src/pages/RedefinirSenha/components/ModalRedefinirSenha.tsx` | Redesign do modal |

**Nenhum arquivo novo criado. Nenhuma dependência nova adicionada.**

---

## Restrições

- Nenhuma dependência nova (Google Fonts, bibliotecas de animação, etc.)
- `lucide-react` já instalado — usar `Mail`, `Lock`, `Eye`, `EyeOff`, `Check`, `X`, `ArrowLeft`
- `react-icons` já instalado — manter `FcGoogle` onde usado
- Tailwind CSS v4 já configurado — usar classes utilitárias; cores fora da paleta padrão via `[]`
- Lógica de negócio (serviços, validações, estados, navegação) não pode ser alterada
