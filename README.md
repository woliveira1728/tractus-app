<!-- README: Português primeiro, English second. -->
# Tractus App

**Idioma / Language:** [Português](#português) · [English](#english)

---

## Português

Descrição
---------

Aplicação frontend em React + TypeScript para gerenciar inspeções e manutenção de pneus de veículos. Permite registrar medições (pressão, profundidade do sulco), gerir movimentações (rodízio, recapagem, substituição) e navegar pelo histórico de manutenção. Atualmente usa dados mockados para prototipagem.

Principais funcionalidades
-------------------------

- Navegação de veículo e pneus: visualizar e selecionar pneus por posição (Lx / Rx).
- Medições de pneu: registrar nova pressão e profundidade do sulco; registrar histórico (mock).
- Fluxo de substituição: marcar substituição, abrir modal para cadastrar dados do pneu substituto e registrar histórico.
- Histórico por pneu: modal/carrossel para navegar entre pneus e ver entradas de manutenção.
- Envio de relatórios (mock): botão que dispara um toast e redireciona para a tela de identificação.

Stack técnica
-------------

- React 19 + TypeScript
- Vite (dev server / bundler)
- SASS / CSS Modules (.module.scss)
- react-router-dom
- react-toastify
- react-icons

Como rodar
----------

1. Instalar dependências:

```bash
npm install
```

2. Iniciar em modo de desenvolvimento:

```bash
npm run dev
```

3. Abrir no navegador (Vite geralmente informa a URL, ex.: `http://localhost:5173`).

Nota: o `vite.config.ts` foi ajustado para `server.watch.usePolling: true` em ambientes onde HMR pode ser instável.

Arquivos importantes
--------------------

- `src/providers/userContext.tsx`: centraliza estado e lógica de domínio (medições, histórico, seleção e substituição de pneus).
  - `updateTyreMeasurements(pneuId, newPressao?, newSulco?, movimentacao?, suppressToast?)` — registra medições e grava histórico.
  - `replaceTyre(originalPneuId, newTyreData?, movimentacao?)` — operação centralizada para substituir um pneu e registrar histórico.
- `src/data/mockData.ts`: dados mock (veículos, pneus, histórico).
- `src/components/tyre-dashboard/index.tsx`: UI do modal de inspeção, botão `Salvar e avançar` e integração com fluxo de substituição.
- `src/components/replacement-tyre/index.tsx`: modal para inserir dados do pneu substituto.
- `src/components/historical/index.tsx`: modal/carrossel do histórico por pneu.
- `src/pages/vehicle-dashboard/index.tsx`: painel principal; botão `Enviar relatório` dispara toast e redireciona para `/identification`.
- `src/utils/sulco.ts` (ou `src/lib/sulco.ts`): regras de negócio para avaliação do sulco e notificações.

Fluxos de uso (cenários rápidos)
-------------------------------

- Abrir veículo → clicar em `Lx`/`Rx` → modal do pneu.
- Preencher `Nova Pressão` e `Profundidade do Sulco` → `Salvar e avançar`:
  - Se `Sem movimentação`: salva medidas e fecha modal (volta à seleção de pneus).
  - Se `Substituição` marcada: salva medições, abre modal de substituição; após salvar o novo pneu, grava histórico, mostra toast e fecha modais.
- `Histórico`: abrir modal e navegar entre pneus com setas.
- `Enviar relatório`: toast de confirmação e redireciona para `/identification`.

Observações arquiteturais
------------------------

- A lógica de domínio foi concentrada em `UserProvider` para manter componentes UI simples e reutilizáveis.
- Atualmente os dados são mocks em memória — recomenda-se persistência via `localStorage` ou backend.

Contribuição
------------

- Faça fork e abra um pull request; siga commits semânticos (`feat`, `fix`, `chore`).

Projeto acadêmico / Atribuição
-----------------------------

Este projeto é resultado de pesquisa e desenvolvimento para a disciplina **Laboratório de Criatividade e Projetos** do Curso Superior de Tecnologia em Análise e Desenvolvimento de Sistemas(ADS) e Gestão da Tecnologia da Informação(GTI) da **ULBRA - Universidade Luterana do Brasil**.

Autores do projeto:

- Wilson Dias de Oliveira(ADS)
- Diosefy Gonçalves Pereira(ADS)
- Samanta Teixeira Portilho(GTI)
- Gustavo Henrique Baumann(ADS)
- João Vitor Spelier Nunes(ADS)

---

## English

Description
-----------

Frontend application (React + TypeScript) to manage tyre inspections and maintenance for vehicles. It supports recording measurements (pressure, tread depth), managing movements (rotation, retread, replacement) and browsing maintenance history. Currently uses in-memory mocks for prototyping.

Key features
------------

- Vehicle & tyre navigation: view and select tyres by position (Lx / Rx).
- Tyre measurements: record new pressure and tread depth; record maintenance history (mocked).
- Replacement flow: mark replacement, open a modal to register the new tyre data and record history.
- Tyre history: modal/carousel to browse tyres and view maintenance entries.
- Report sending (mock): a button triggers a toast and redirects to the identification screen.

Tech stack
----------

- React 19 + TypeScript
- Vite
- SASS / CSS Modules
- react-router-dom
- react-toastify
- react-icons

Run the project
---------------

```bash
npm install
npm run dev
```

Open the URL shown by Vite (commonly `http://localhost:5173`).

Important files
---------------

- `src/providers/userContext.tsx`: centralizes state and domain logic (measurements, history, selection and replacement).
  - `updateTyreMeasurements(pneuId, newPressao?, newSulco?, movimentacao?, suppressToast?)` — records measurements and history.
  - `replaceTyre(originalPneuId, newTyreData?, movimentacao?)` — centralized replacement operation.
- `src/data/mockData.ts`: mock data (vehicles, tyres, history).
- `src/components/tyre-dashboard/index.tsx`: tyre inspection modal and replacement flow.
- `src/components/replacement-tyre/index.tsx`: modal for replacement tyre data.
- `src/components/historical/index.tsx`: tyre history carousel modal.
- `src/pages/vehicle-dashboard/index.tsx`: main panel; `Send report` button triggers toast and redirects to `/identification`.
- `src/utils/sulco.ts` (or `src/lib/sulco.ts`): business rules for tread depth and notifications.

Usage flows
-----------

- Open a vehicle → click a position (`L1`/`R1`) → tyre modal opens.
- Fill `New Pressure` and `Tread Depth` → click `Save & Advance`:
  - If `No movement`: saves and closes modal.
  - If `Replacement` selected: saves (toast suppressed), opens replacement modal; after saving new tyre, history recorded and toast shown, then modals close.
- Open `History` → navigate between tyres with arrows.
- `Send report` → shows toast and navigates to `/identification`.

Notes
-----

- Domain logic was centralized in `UserProvider`. Data is mocked in-memory; consider adding persistence.

Academic project / Attribution
-----------------------------

This project is the result of research and development for the course **Laboratory of Creativity and Projects** in the Higher Education Technology degree in Analysis and Systems Development(ASD) and Information Technology Management(ITM) at **ULBRA - Universidade Luterana do Brasil**.

Project authors:

- Wilson Dias de Oliveira(ASD)
- Diosefy Gonçalves Pereira(ASD)
- Samanta Teixeira Portilho(ITM)
- Gustavo Henrique Baumann(ASD)
- João Vitor Spelier Nunes()ASD