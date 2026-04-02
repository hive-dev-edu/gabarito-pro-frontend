# Módulo de Questões

## Visão Geral

Todas as rotas do módulo de questões exigem autenticação via JWT.  
O token deve ser enviado no header `Authorization: Bearer <token>`.

**Base URL:** `http://localhost:3000/questions`

---

## Regras de Negócio

- `questionType` define as regras de alternativas:
  - `multiple_choice`: **exatamente 5** alternativas
  - `true_false`: **exatamente 2** alternativas
  - `essay`: **não exige** alternativas
- Para tipos com alternativas (`multiple_choice`, `true_false`): exatamente **1 alternativa deve ser marcada como correta** (`isCorrect: true`)
- Questões **privadas** (`isPublic: false`) só podem ser acessadas pelo próprio autor
- Apenas o **autor** da questão pode editá-la ou excluí-la
- A listagem pública (`GET /questions`) retorna apenas questões com `isPublic: true`

---

## Rotas

### 1. Listar Questões

**`GET /questions`**

Retorna questões públicas com suporte a filtros e paginação.

#### Query Params (todos opcionais)

| Parâmetro        | Tipo          | Valores aceitos                                                                    | Padrão |
| ---------------- | ------------- | ---------------------------------------------------------------------------------- | ------ |
| `subject`        | string        | qualquer (ex: `"matematica"`)                                                      | —      |
| `educationLevel` | string        | `ensino_tecnico`, `ensino_medio`, `ensino_superior`, `ensino_fundamental`, `outro` | —      |
| `grade`          | number/string | inteiro positivo (ex: `9`)                                                         | —      |
| `questionType`   | string        | `multiple_choice`, `true_false`, `essay`                                           | —      |
| `schoolYear`     | string        | (legado) qualquer (ex: `"9"`)                                                      | —      |
| `difficulty`     | string        | `easy`, `medium`, `hard`                                                           | —      |
| `page`           | number        | inteiro positivo                                                                   | `1`    |
| `limit`          | number        | inteiro positivo, máx `100`                                                        | `10`   |

#### Exemplos de URL

```
GET /questions
GET /questions?subject=matematica
GET /questions?difficulty=easy&grade=9&page=1&limit=20
```

#### Response `200`

```json
{
  "data": [
    {
      "id": "019587a2-...",
      "statement": "Qual é a capital do Brasil?",
      "subject": "geografia",
      "educationLevel": "ensino_fundamental",
      "grade": 9,
      "questionType": "multiple_choice",
      "difficulty": "easy",
      "content": "Geografia do Brasil",
      "createdAt": "2026-02-18T12:00:00.000Z",
      "alternatives": [
        { "id": "alt-id-1", "text": "São Paulo" },
        { "id": "alt-id-2", "text": "Brasília" },
        { "id": "alt-id-3", "text": "Rio de Janeiro" },
        { "id": "alt-id-4", "text": "Salvador" },
        { "id": "alt-id-5", "text": "Belo Horizonte" }
      ]
    }
  ],
  "meta": {
    "total": 42,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

> **Nota:** O campo `isCorrect` das alternativas **não é retornado** na listagem pública, apenas no `GET /:id`.

---

### 2. Buscar Questão por ID

**`GET /questions/:id`**

Retorna os detalhes completos de uma questão, incluindo `isCorrect` nas alternativas.

- Questões **privadas** só retornam para o próprio autor. Para outros usuários, retorna `403 Forbidden`.

#### Response `200`

```json
{
  "id": "019587a2-...",
  "authorId": "user-id-...",
  "statement": "Qual é a capital do Brasil?",
  "subject": "geografia",
  "educationLevel": "ensino_fundamental",
  "grade": 9,
  "questionType": "multiple_choice",
  "difficulty": "easy",
  "content": "Geografia do Brasil",
  "isPublic": true,
  "createdAt": "2026-02-18T12:00:00.000Z",
  "alternatives": [
    { "id": "alt-id-1", "text": "São Paulo" },
    { "id": "alt-id-2", "text": "Brasília" },
    { "id": "alt-id-3", "text": "Rio de Janeiro" },
    { "id": "alt-id-4", "text": "Salvador" },
    { "id": "alt-id-5", "text": "Belo Horizonte" }
  ]
}
```

#### Respostas de erro

| Status | Situação                         |
| ------ | -------------------------------- |
| `404`  | Questão não encontrada           |
| `403`  | Questão privada de outro usuário |

---

### 3. Criar Questão

**`POST /questions`**

#### Request Body

```json
{
  "statement": "Qual é a capital do Brasil?",
  "content": "Geografia do Brasil",
  "subject": "geografia",
  "educationLevel": "ensino_fundamental",
  "grade": 9,
  "questionType": "multiple_choice",
  "difficulty": "easy",
  "isPublic": true,
  "alternatives": [
    { "text": "São Paulo", "isCorrect": false },
    { "text": "Brasília", "isCorrect": true },
    { "text": "Rio de Janeiro", "isCorrect": false },
    { "text": "Salvador", "isCorrect": false },
    { "text": "Belo Horizonte", "isCorrect": false }
  ]
}
```

#### Campos

| Campo            | Tipo    | Obrigatório | Descrição                                                                     |
| ---------------- | ------- | ----------- | ----------------------------------------------------------------------------- |
| `statement`      | string  | ✅          | Enunciado da questão                                                          |
| `content`        | string  | ✅          | Conteúdo/tema abordado                                                        |
| `subject`        | string  | ✅          | Matéria (ex: `"matematica"`, `"portugues"`)                                   |
| `educationLevel` | string  | ✅          | Nível de ensino                                                               |
| `grade`          | number  | ✅          | Série/ano (inteiro positivo)                                                  |
| `questionType`   | string  | ✅          | `multiple_choice`, `true_false` ou `essay`                                    |
| `difficulty`     | string  | ✅          | `easy`, `medium` ou `hard`                                                    |
| `isPublic`       | boolean | ❌          | Padrão `false`                                                                |
| `alternatives`   | array   | ✅/❌       | Obrigatório para `multiple_choice` (5) e `true_false` (2). Omitir em `essay`. |

#### Response `200`

```json
{
  "id": "019587a2-...",
  "authorId": "user-id-...",
  "statement": "Qual é a capital do Brasil?",
  "content": "Geografia do Brasil",
  "subject": "geografia",
  "educationLevel": "ensino_fundamental",
  "grade": 9,
  "questionType": "multiple_choice",
  "difficulty": "easy",
  "isPublic": true,
  "createdAt": "2026-02-18T12:00:00.000Z",
  "updatedAt": "2026-02-18T12:00:00.000Z",
  "alternatives": [
    { "id": "alt-id-1", "text": "São Paulo", "isCorrect": false },
    { "id": "alt-id-2", "text": "Brasília", "isCorrect": true },
    { "id": "alt-id-3", "text": "Rio de Janeiro", "isCorrect": false },
    { "id": "alt-id-4", "text": "Salvador", "isCorrect": false },
    { "id": "alt-id-5", "text": "Belo Horizonte", "isCorrect": false }
  ]
}
```

---

### 4. Atualizar Questão

**`PATCH /questions/:id`**

Todos os campos são **opcionais**. Envie apenas o que deseja atualizar.

Apenas o **autor** da questão pode editá-la.

#### Comportamento das alternativas

- Se `alternatives` for **omitido** no body → as alternativas existentes são mantidas sem alteração
- Se `alternatives` for **enviado** → todas as alternativas anteriores são substituídas pelas novas (delete + insert na mesma transação). Para `multiple_choice` envie **5**, para `true_false` envie **2**.

#### Request Body

```json
{
  "statement": "Qual é a capital do Brasil? (atualizado)",
  "content": "Geografia do Brasil",
  "subject": "geografia",
  "educationLevel": "ensino_fundamental",
  "grade": 9,
  "questionType": "multiple_choice",
  "difficulty": "medium",
  "isPublic": true,
  "alternatives": [
    { "text": "São Paulo", "isCorrect": false },
    { "text": "Brasília", "isCorrect": true },
    { "text": "Rio de Janeiro", "isCorrect": false },
    { "text": "Salvador", "isCorrect": false },
    { "text": "Belo Horizonte", "isCorrect": false }
  ]
}
```

#### Exemplo — atualizar apenas a dificuldade (sem mexer nas alternativas)

```json
{
  "difficulty": "hard"
}
```

#### Response `200`

Retorna a questão completa atualizada (mesmo formato do `POST`).

#### Respostas de erro

| Status | Situação               |
| ------ | ---------------------- |
| `404`  | Questão não encontrada |
| `403`  | Usuário não é o autor  |

---

### 5. Excluir Questão

**`DELETE /questions/:id`**

Apenas o **autor** da questão pode excluí-la.

#### Response `200`

```json
{
  "message": "Questão removida com sucesso."
}
```

#### Respostas de erro

| Status | Situação               |
| ------ | ---------------------- |
| `404`  | Questão não encontrada |
| `403`  | Usuário não é o autor  |

---

## Guia de Implementação no Frontend

### Pré-requisitos

O token JWT obtido no login deve ser armazenado (ex: `localStorage` ou estado global) e enviado em todas as requisições ao módulo de questões.

```ts
const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
};
```

---

### 1. Listagem com filtros e paginação

- Crie um estado para os filtros: `subject`, `educationLevel`, `grade`, `questionType`, `difficulty`, `page`, `limit`
- `schoolYear` é **legado** (evite usar em telas novas)
- Monte a URL dinamicamente usando `URLSearchParams`
- Re-faça a requisição sempre que um filtro ou a página mudar
- Use `meta.totalPages` para renderizar a paginação

```ts
const params = new URLSearchParams();

if (subject) params.set("subject", subject);
if (educationLevel) params.set("educationLevel", educationLevel);
if (grade) params.set("grade", String(grade));
if (questionType) params.set("questionType", questionType);
if (difficulty) params.set("difficulty", difficulty);
params.set("page", String(page));
params.set("limit", String(limit));

const res = await fetch(`/questions?${params}`, { headers });
const { data, meta } = await res.json();
```

---

### 2. Página de detalhe da questão

- Faça `GET /questions/:id` ao montar a página
- Exiba as alternativas **sem** o `isCorrect` na tela do aluno — use esse campo apenas internamente para validar a resposta selecionada
- Guarde o `authorId` para controlar se o usuário logado pode ver os botões de editar/excluir

---

### 3. Formulário de criação

- Valide no frontend conforme `questionType`:
  - `multiple_choice`: 5 alternativas
  - `true_false`: 2 alternativas
  - `essay`: sem alternativas
- O campo `isPublic` pode ser um toggle/checkbox (padrão desmarcado)
- Envie `isPublic: false` por padrão caso o campo seja omitido pelo usuário

```ts
const body = {
  statement,
  content,
  subject,
  educationLevel,
  grade,
  questionType,
  difficulty, // 'easy' | 'medium' | 'hard'
  isPublic, // boolean
  alternatives, // array de alternativas (omitido em 'essay')
};

await fetch("/questions", {
  method: "POST",
  headers,
  body: JSON.stringify(body),
});
```

---

### 4. Formulário de edição

1. Monte a página fazendo `GET /questions/:id` para pré-popular o formulário
2. O usuário edita os campos desejados
3. No submit, envie **apenas os campos alterados** + o array completo de alternativas (se alguma foi alterada)

```ts
const body: Record<string, unknown> = {};

if (statement !== original.statement) body.statement = statement;
if (difficulty !== original.difficulty) body.difficulty = difficulty;
// ... outros campos

if (alternativesWereEdited) {
  body.alternatives = alternatives; // array completo conforme o tipo { text, isCorrect }
}

await fetch(`/questions/${id}`, {
  method: "PATCH",
  headers,
  body: JSON.stringify(body),
});
```

> **Importante:** Se o usuário editar apenas 1 alternativa, o frontend deve enviar o array completo — a API substitui todas. O fluxo correto é: carrega as alternativas do GET, usuário modifica a que quiser no formulário, envia o array completo atualizado.

---

### 5. Exclusão

- Exiba um modal de confirmação antes de chamar o `DELETE`
- Após exclusão bem-sucedida, redirecione para a listagem

```ts
await fetch(`/questions/${id}`, {
  method: "DELETE",
  headers,
});
```

---

### Controle de permissões na UI

| Ação                     | Condição para exibir                         |
| ------------------------ | -------------------------------------------- |
| Botão "Editar"           | `user.id === question.authorId`              |
| Botão "Excluir"          | `user.id === question.authorId`              |
| Questão privada na lista | Não aparece (a API já filtra)                |
| Acesso direto `GET /:id` | API retorna `403` se privada e não for autor |
