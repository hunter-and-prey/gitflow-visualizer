# 🌌 GitFlow Visualizer & Commit Helper

[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-indigo.svg)](https://github.com)
[![Status](https://img.shields.io/badge/Status-Active-emerald.svg)]()
[![Platform](https://img.shields.io/badge/Platform-Web-blue.svg)]()

一個專為現代開發者與開源貢獻者設計的**極致視覺化 Git 學習與常規提交（Conventional Commits）輔助工作台**。本專案完全基於前端無依賴技術（HTML/CSS/JS），內建強大的 SVG 動態分支樹狀圖渲染引擎，是您學習 Git 分支管理策略與產出完美 commit 訊息的絕佳夥伴。

> 💡 **專案亮點**：本專案的設計初衷是協助開發者建立高質量的開源專案提交歷史。您可以直接以此專案為起點，建立您的個人公開 GitHub 倉庫，不僅能做為您個人的開源代表作，還能用來**申請 OpenAI 「Codex for Open Source」計畫**（免費獲得 6 個月的 ChatGPT Pro，價值 $1,200 美元）！

---

## ✨ 核心特色功能 (Features)

*   **🎨 互動式 SVG 動態分支渲染 (Dynamic Git Graph)**
    *   內建自研的樹狀圖渲染器，當您輸入命令或點擊快捷操作時，分支圖表將以優雅的 Bezier 曲線進行即時動態繪製，清晰展現 Git 提交歷史演進。
    *   支援多分支（`main`、`develop`、`feature/*`、`release/*`、`hotfix/*`）的同台展示與精美配色。
*   **📝 常規提交視覺化產生器 (Conventional Commit Builder)**
    *   完整實作 `feat`、`fix`、`docs`、`refactor`、`style` 等業界主流規範。
    *   視覺化表單輸入，自動加入 Scope 影響範圍與 `BREAKING CHANGE!` 重大變更修飾，支援即時複製指令與一鍵在模擬器中提交。
*   **🎓 互動式教學場景 (Step-by-step Guided Scenarios)**
    *   **GitHub Flow**：演練以 `main` 分支為核心的輕量化開源工作流。
    *   **Git Flow**：實戰企業級的經典雙主幹分支管理模型。
    *   內建「自動帶入並執行」輔助學習機制，對 Git 初學者與進階開發者皆非常實用。
*   **💻 質感極致的終端機 Console**
    *   極致的深色太空（Space Slate）設計風格，搭配玻璃擬態（Glassmorphism）與霓虹呼吸燈背景。
    *   內建虛擬 Git 命令解析器（CLI），支援 `git commit`、`git branch` , `git checkout`、`git merge` 與 `git rebase`。
*   **⚡ 輕量無依賴 (Zero Dependency)**
    *   不使用任何重型框架，純原生 Web 技術打造，載入速度極快，能一鍵部署至 **GitHub Pages**。

---

## 🛠️ 開放原始碼檔案架構 (Architecture)

```bash
gitflow-visualizer/
├── index.html   # 精美語意化 HTML 架構，內建最佳 SEO 標籤
├── style.css    # 現代極致視覺效果 CSS，包含玻璃擬態與流體漸層動畫
├── app.js       # Git 虛擬模擬器核心、SVG 渲染引擎與教學引導邏輯
├── LICENSE      # MIT 開源授權條款
└── README.md    # 您目前正在閱讀的精美說明文件
```

---

## 🚀 快速開始與使用方式 (Quick Start)

本專案完全運行於瀏覽器端，無需安裝任何伺服器環境或依賴套件。

### 本地直接執行：
1. 下載或 Clone 本專案到您的電腦。
2. 在 `gitflow-visualizer` 資料夾中，直接按兩下 `index.html` 即可在瀏覽器中開啟！

### 發布到 GitHub Pages：
如果您希望將其建立為您個人的公開開源作品並取得線上網址：
1. 在 GitHub 上建立一個新的公開倉庫（Repository），命名為 `gitflow-visualizer`。
2. 將本資料夾內的所有程式碼推送到該倉庫：
   ```bash
   git init
   git add .
   git commit -m "feat: initial release of GitFlow Visualizer"
   git branch -M main
   git remote add origin https://github.com/您的帳號/gitflow-visualizer.git
   git push -u origin main
   ```
3. 前往倉庫的 **Settings > Pages**，將 Source 設定為 `main` 分支並儲存。
4. 稍等數十秒，即可獲得專屬的線上展示網址（例如：`https://您的帳號.github.io/gitflow-visualizer/`）！

---

## 💡 如何用這個專案申請 OpenAI 免費 6 個月 ChatGPT Pro？

OpenAI 最新推出的「Codex for Open Source」計畫，**沒有硬性的 GitHub Star 數門檻**。只要您是某個公開開源專案的核心維護者，就符合申請資格！

### 申請攻略：
1. **發布此專案**：依照上方說明，將本專案推送到您個人的 GitHub 倉庫並啟用 GitHub Pages 線上展示。
2. **展現維護度**：您可以自定義修改 `index.html` 或 `style.css` 的部分文案，或加入新功能提交（這會在 GitHub 留下您活躍維護的 commit 紀錄）。
3. **提交申請**：
   * 前往 OpenAI 申請頁面：`openai.com/form/codex-for-oss/`
   * 填寫您的 `gitflow-visualizer` GitHub 專案連結。
   * **說明您的 AI 用途**（重點！）：說明您預計如何將 Codex/ChatGPT 用於此專案的日常維護（例如：**「我正計劃使用 OpenAI Codex/API 來自動化解析模擬器中的 commit 訊息、並用 AI 幫用戶在合併 PR 時自動生成 CHANGELOG.md」**）。
4. **送出申請**：審核為滾動式進行，祝您順利通過審查，獲得價值 $1,200 美元的全能 ChatGPT Pro + API 額度福利！

---

## 🤝 貢獻指南 (Contributing)

我們非常歡迎您提交 Issues 或 Pull Requests 來讓這個工具更臻完美：
*   新增更多 Git 指令（如 `git revert`、`git cherry-pick`）。
*   優化 SVG 樹狀圖的分支排列演算法，使其支援更複雜的分支交叉。
*   提供更多語系的翻譯。

---

## 📄 授權條款 (License)

本專案採用 **[MIT 授權條款](LICENSE)** 開源釋出。您可以自由地使用、修改、分發此專案，甚至將其用於商業用途。
請保留原創作者標示與版權聲明。

---
*Made with 💖 by 張紘睿 (Chang Hung-Jui) for open-source developers worldwide.*
