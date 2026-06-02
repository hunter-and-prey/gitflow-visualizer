/* ==========================================================================
   GitFlow Visualizer - Interactive Simulation & Rendering Engine (with i18n)
   Author: 張紘睿
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initial Lucide Icons
    lucide.createIcons();

    // Language State
    let currentLang = 'zh'; // 'zh' or 'en'

    // UI Elements
    const terminalCli = document.getElementById('terminal-cli');
    const cliExecuteBtn = document.getElementById('cli-execute-btn');
    const terminalLog = document.getElementById('terminal-log');
    const activeBranchIndicator = document.getElementById('active-branch-indicator');
    const commitCountIndicator = document.getElementById('commit-count-indicator');
    const clearLogBtn = document.getElementById('clear-log-btn');
    const langSwitchBtn = document.getElementById('lang-switch-btn');
    
    // Tab Elements
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    // Commit Builder Form
    const commitForm = document.getElementById('commit-form');
    const commitType = document.getElementById('commit-type');
    const commitScope = document.getElementById('commit-scope');
    const commitSubject = document.getElementById('commit-subject');
    const commitBody = document.getElementById('commit-body');
    const commitBreaking = document.getElementById('commit-breaking');
    const breakingDescContainer = document.getElementById('breaking-desc-container');
    const commitBreakingDesc = document.getElementById('commit-breaking-desc');
    const commitPreviewText = document.getElementById('commit-preview-text');
    const copyCommitBtn = document.getElementById('copy-commit-btn');

    // Inspector Panel
    const inspectorCard = document.getElementById('inspector-card');
    const inspectorHash = document.getElementById('inspector-hash');
    const inspectorSubject = document.getElementById('inspector-subject');
    const inspectorBranchTag = document.getElementById('inspector-branch-tag');
    const inspectorAuthor = document.getElementById('inspector-author');
    const inspectorDate = document.getElementById('inspector-date');
    const inspectorBodyDesc = document.getElementById('inspector-body-desc');

    // Guide Panel
    const tutorialGuideBox = document.getElementById('tutorial-guide-box');
    const guideTitle = document.getElementById('guide-title');
    const guideProgress = document.getElementById('guide-progress');
    const guideInstructions = document.getElementById('guide-instructions');
    const guideNextHint = document.getElementById('guide-next-hint');
    const guidePrevBtn = document.getElementById('guide-prev-btn');
    const guideNextBtn = document.getElementById('guide-next-btn');

    // Modals
    const interactiveModal = document.getElementById('interactive-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBodyContent = document.getElementById('modal-body-content');
    const modalConfirmBtn = document.getElementById('modal-confirm-btn');

    // Quick Action Buttons
    const quickCommitBtn = document.getElementById('quick-commit-btn');
    const quickBranchBtn = document.getElementById('quick-branch-btn');
    const quickCheckoutBtn = document.getElementById('quick-checkout-btn');
    const quickMergeBtn = document.getElementById('quick-merge-btn');
    const quickRebaseBtn = document.getElementById('quick-rebase-btn');
    const quickResetBtn = document.getElementById('quick-reset-btn');

    /* ==========================================================================
       1. i18n Translation Dictionary
       ========================================================================== */
    const i18nDict = {
        'zh': {
            'page-title': 'GitFlow Visualizer & Commit Helper | 互動式 Git 流程與提交輔助工具',
            'nav-simulator': '互動模擬器',
            'nav-helper': 'Commit 產生器',
            'nav-scenarios': '教學場景',
            'hero-title': '掌控您的 Git 工作流。',
            'hero-desc': '互動式動態 SVG 渲染，完美整合 Conventional Commits 規範。為您的開源專案打下最優質的提交基礎。',
            'hero-btn-start': '開始互動模擬',
            'hero-btn-learn': '學習經典流程',
            'tab-quick': '快捷操作',
            'tab-builder': 'Commit 產生器',
            'tab-challenges': '教學挑戰',
            'ctrl-cli-title': '虛擬命令行操作',
            'ctrl-cli-hint': '提示：輸入 help 查看可用虛擬命令',
            'ctrl-btn-title': '快捷按鈕操作',
            'status-branch': '目前分支:',
            'status-commits': '提交總數:',
            'form-type': '提交類型 (Type)',
            'form-scope': '影響範圍 (Scope)',
            'form-optional': '（選填）',
            'form-subject': '簡短描述 (Subject)',
            'form-body': '詳細說明 (Body)',
            'form-breaking': '重大變更 (Breaking Change)',
            'form-breaking-desc': '重大變更描述',
            'form-preview': '即時 Commit 預覽',
            'form-btn-copy': '複製命令',
            'form-btn-submit': '送出並提交',
            'scenarios-intro': '點擊下方經典開源工作流，啟動 step-by-step 互動教學引導：',
            'badge-recommended': '推薦',
            'badge-standard': '標準',
            'github-flow-card-desc': '適合大多數開源專案。以 main 分支為核心，每次新功能或修復皆建立 Feature 分支，透過 Pull Request 合併。',
            'git-flow-card-desc': '適合大型企業級/複雜產品釋出。區分 main、develop、feature、release 與 hotfix 分支的完整模型。',
            'btn-launch-challenge': '啟動此挑戰',
            'guide-btn-prev': '上一步',
            'vis-title': '動態分支渲染樹狀圖 (Interactive SVG Graph)',
            'inspector-author': '作者：',
            'inspector-date': '時間：',
            'showcase-title': '為什麼選擇常規提交 (Conventional Commits)？',
            'showcase-f1-title': '自動生成變更日誌 (Changelogs)',
            'showcase-f1-desc': '標準的 Conventional Commit 讓工具可以自動掃描所有 Commit，並在發布新版本時一鍵產生精美的 CHANGELOG.md。',
            'showcase-f2-title': '提高 Code Review 效率',
            'showcase-f2-desc': '協作者或開源維護者能夠在第一時間透過 feat:、fix:、refactor: 等前綴掌握變更性質，大幅加速 PR 審核速度。',
            'showcase-f3-title': '完美銜接 CI/CD 自動化',
            'showcase-f3-desc': '語意化的提交訊息可觸發自動化腳本，例如：自動進行語意化版本號升級 (Semantic Versioning 升級 patch, minor 或 major)。',
            'scenes-section-title': '探索開源工作流精髓',
            'scenes-section-subtitle': '選擇適合您專案的分支管理策略，提升團隊協作效率',
            'scenes-github-title': 'GitHub Flow — 輕量、敏捷的開源標準',
            'scenes-github-desc': '適合持續發布的網頁應用程式與大多數熱門開源專案：',
            'scenes-github-l1': '<strong>單一主要分支：</strong> main 是唯一的主幹，永遠保持可發布狀態。',
            'scenes-github-l2': '<strong>功能分支開發：</strong> 開發任何功能或修復都從 main 分支拉出命名清晰的分支。',
            'scenes-github-l3': '<strong>Pull Request 審查：</strong> 程式碼完成後提交 PR，由核心開發者審查、討論與測試。',
            'scenes-github-l4': '<strong>即刻合併：</strong> 通過 CI 測試與審查後，直接 Merge 回 main 分支並自動部署。',
            'scenes-git-title': 'Git Flow — 嚴謹、多版本的發布模型',
            'scenes-git-desc': '適合有固定發布週期、需支援舊版本維護的大型軟體專案：',
            'scenes-git-l1': '<strong>雙主幹分支：</strong> main (生產環境) 與 develop (測試整合環境)。',
            'scenes-git-l2': '<strong>Feature 分支：</strong> 專注於開發特定新功能，完成後合併回 develop。',
            'scenes-git-l3': '<strong>Release 分支：</strong> 準備發布新版本時從 develop 拉出，專職 Bug 修復與測試。',
            'scenes-git-l4': '<strong>Hotfix 分支：</strong> 生產環境發現緊急漏洞，直接從 main 拉出修復，後合併回 main 與 develop。',
            'footer-license': '本專案採用 MIT 授權條款開源釋出。',
            'footer-made-by': 'Made with 💖 by',
            'footer-for-devs': 'for Open Source Developers.',
            'footer-docs': '說明文件',
            'footer-print': '列印教學',
            'modal-cancel': '取消',
            'modal-confirm': '確定',
        },
        'en': {
            'page-title': 'GitFlow Visualizer & Commit Helper | Interactive Git Workflows Simulator',
            'nav-simulator': 'Simulator',
            'nav-helper': 'Commit Helper',
            'nav-scenarios': 'Scenarios',
            'hero-title': 'Master Your Git Workflows.',
            'hero-desc': 'Interactive dynamic SVG rendering with Conventional Commits integrated. Build a perfect repository history for your open source projects.',
            'hero-btn-start': 'Start Simulation',
            'hero-btn-learn': 'Learn Scenarios',
            'tab-quick': 'Quick Actions',
            'tab-builder': 'Commit Helper',
            'tab-challenges': 'Guided Scenarios',
            'ctrl-cli-title': 'Virtual CLI Console',
            'ctrl-cli-hint': 'Hint: Type help to view available virtual commands',
            'ctrl-btn-title': 'Quick Shortcut Buttons',
            'status-branch': 'Active Branch:',
            'status-commits': 'Total Commits:',
            'form-type': 'Commit Type',
            'form-scope': 'Scope',
            'form-optional': '(Optional)',
            'form-subject': 'Subject Description',
            'form-body': 'Body Explanation',
            'form-breaking': 'Breaking Change',
            'form-breaking-desc': 'Breaking Change Description',
            'form-preview': 'Live Commit Preview',
            'form-btn-copy': 'Copy Command',
            'form-btn-submit': 'Commit to Sim',
            'scenarios-intro': 'Select a classic workflow below to launch step-by-step interactive tutorial:',
            'badge-recommended': 'Recommend',
            'badge-standard': 'Standard',
            'github-flow-card-desc': 'Ideal for most open source projects. Uses main as the single master branch, with all changes developed in feature branches and merged via PR.',
            'git-flow-card-desc': 'Perfect for enterprise-grade, scheduled release models. Employs main, develop, feature, release, and hotfix branches.',
            'btn-launch-challenge': 'Launch Scenario',
            'guide-btn-prev': 'Prev',
            'vis-title': 'Interactive SVG Branch Graph',
            'inspector-author': 'Author: ',
            'inspector-date': 'Date: ',
            'showcase-title': 'Why Choose Conventional Commits?',
            'showcase-f1-title': 'Automate Changelogs',
            'showcase-f1-desc': 'Conventional Commit guidelines allow automatic tools to scan commits and generate beautiful CHANGELOG.md files in one click.',
            'showcase-f2-title': 'Speed Up Code Reviews',
            'showcase-f2-desc': 'Maintainers and collaborators can easily grasp change contexts via type prefixes like feat:, fix:, or refactor: immediately.',
            'showcase-f3-title': 'Seamless CI/CD Automation',
            'showcase-f3-desc': 'Standardized messages trigger automation pipelines, such as automatic semantic version bumps (major, minor, or patch release tags).',
            'scenes-section-title': 'Explore Open Source Git Models',
            'scenes-section-subtitle': 'Choose the best branching model for your project to elevate collaborative efficiency',
            'scenes-github-title': 'GitHub Flow — Lightweight & Agile Standard',
            'scenes-github-desc': 'Perfect for web apps and the vast majority of active open-source repositories:',
            'scenes-github-l1': '<strong>Single Master Branch:</strong> main is the only core branch, always keeping a deployable state.',
            'scenes-github-l2': '<strong>Feature Branching:</strong> Every fix or new feature is developed in a separate, descriptively named branch.',
            'scenes-github-l3': '<strong>Pull Request Review:</strong> Submit a PR when code is complete to invite peer review, discussions, and testing.',
            'scenes-github-l4': '<strong>Immediate Merge:</strong> Merge into main and auto-deploy once CI checks and reviews are cleared.',
            'scenes-git-title': 'Git Flow — Rigorous & Version-safe Model',
            'scenes-git-desc': 'Ideal for software with scheduled releases and multi-version legacy support:',
            'scenes-git-l1': '<strong>Dual Master Branches:</strong> main (production-ready) and develop (integration environment).',
            'scenes-git-l2': '<strong>Feature Branches:</strong> Branch off develop for unique features, merge back once fully verified.',
            'scenes-git-l3': '<strong>Release Branches:</strong> Branch off develop for final QA and bug-fixing before rolling out a new release.',
            'scenes-git-l4': '<strong>Hotfix Branches:</strong> Branch directly off main to resolve live production bugs, merging back to both main and develop.',
            'footer-license': 'This project is open-sourced under the MIT License.',
            'footer-made-by': 'Made with 💖 by',
            'footer-for-devs': 'for Open Source Developers.',
            'footer-docs': 'Documentation',
            'footer-print': 'Print Tutorial',
            'modal-cancel': 'Cancel',
            'modal-confirm': 'Confirm',
        }
    };

    const commitTypeOptions = {
        'zh': [
            { value: 'feat', text: 'feat ✨ 新功能 (Feature)' },
            { value: 'fix', text: 'fix 🐛 錯誤修復 (Bug Fix)' },
            { value: 'docs', text: 'docs 📝 文件修改 (Documentation)' },
            { value: 'style', text: 'style 🎨 格式/風格調整 (Code Formatting)' },
            { value: 'refactor', text: 'refactor ♻️ 程式碼重構 (Code Refactoring)' },
            { value: 'perf', text: 'perf ⚡ 效能優化 (Performance)' },
            { value: 'test', text: 'test ✅ 新增/修改測試 (Tests)' },
            { value: 'chore', text: 'chore 🔧 建置程序/輔助工具變更 (Chore)' },
            { value: 'ci', text: 'ci 👷 CI/CD 自動化配置 (CI)' }
        ],
        'en': [
            { value: 'feat', text: 'feat ✨ New Feature' },
            { value: 'fix', text: 'fix 🐛 Bug Fix' },
            { value: 'docs', text: 'docs 📝 Documentation' },
            { value: 'style', text: 'style 🎨 Code Style/Formatting' },
            { value: 'refactor', text: 'refactor ♻️ Code Refactoring' },
            { value: 'perf', text: 'perf ⚡ Performance Boost' },
            { value: 'test', text: 'test ✅ Adding/Fixing Tests' },
            { value: 'chore', text: 'chore 🔧 Chore/Build adjustments' },
            { value: 'ci', text: 'ci 👷 CI/CD pipelines configuration' }
        ]
    };

    const logMessages = {
        'zh': {
            init: '&gt;&gt; GitFlow 模擬器初始化成功。',
            initCommit: '&gt;&gt; 已在 main 分支建立初始提交 (C0)。',
            errorEmptyCmd: '錯誤：輸入為空或不可解析的 Git 命令。',
            helpHeader: '可用虛擬命令:',
            helpCommit: '  commit -m "msg"  | 在目前分支建立新提交',
            helpBranch: '  branch <name>     | 建立新分支',
            helpCheckout: '  checkout <name>   | 切換至目標分支 (支援 -b 建立並切換)',
            helpMerge: '  merge <name>      | 合併目標分支至目前分支',
            helpRebase: '  rebase <name>     | 將目前分支 Rebase 至目標分支',
            helpReset: '  reset             | 重設所有分支至初始狀態',
            helpHelp: '  help              | 顯示此命令說明清單',
            errNoMsg: '錯誤：請提供提交訊息，語法：git commit -m "訊息描述"',
            branchListHeader: '可用本地分支:',
            errNoBranch: '錯誤：請指定分支名稱。',
            errBranchExist: "錯誤：分支名稱 '{name}' 已存在。",
            successBranch: "[branch] 成功建立新分支 '{name}' 自 {parent}",
            errNoCheckout: '錯誤：請指定 checkout 的分支名稱。語法：git checkout <branch_name>',
            errCheckoutNotExist: "錯誤：找不到分支 '{name}'。",
            successCheckout: "[checkout] 切換至分支 '{name}'",
            errNoMerge: '錯誤：請指定要合併的來源分支。語法：git merge <branch_name>',
            errMergeSelf: '錯誤：無法將分支合併到自身。',
            errMergeNotExist: "錯誤：找不到分支 '{name}'。",
            mergeUpToDate: '訊息：兩個分支已是最新狀態，無需合併。',
            successMerge: "[merge] 成功合併 '{source}' 至 '{target}' 建立合併提交 {hash}",
            errNoRebase: '錯誤：請指定 Rebase 的目標基底分支。語法：git rebase <branch_name>',
            errRebaseSelf: '錯誤：無法 Rebase 分支到自身。',
            errRebaseNotExist: "錯誤：找不到分支 '{name}'。",
            rebaseFastForward: "[rebase] 分支 '{current}' 無獨特提交，直接 Fast-forward 至 '{base}' ({hash})",
            successRebase: "[rebase] 成功將分支 '{current}' Rebase 至 '{base}' ({count} 個提交重寫)",
            successReset: 'Git 模擬器重設成功！所有虛擬分支回歸初始狀態。',
            errUnsupported: "錯誤：不支援的虛擬指令 '{cmd}'。輸入 'help' 取得協助。",
            copySuccess: '[Copy] 已成功複製命令至剪貼簿：{cmd}',
            copyFail: '複製失敗：請手動複製預覽文字。',
            defaultDesc: '這個提交採用 Conventional Commits 語意化命名，資訊明確，無需額外備註說明。'
        },
        'en': {
            init: '&gt;&gt; GitFlow Simulator initialized successfully.',
            initCommit: '&gt;&gt; Created initial commit (C0) on main branch.',
            errorEmptyCmd: 'Error: Empty or unresolvable Git command input.',
            helpHeader: 'Available virtual commands:',
            helpCommit: '  commit -m "msg"  | Create a new commit on active branch',
            helpBranch: '  branch <name>     | Create a new branch',
            helpCheckout: '  checkout <name>   | Switch to a target branch (supports -b to create & switch)',
            helpMerge: '  merge <name>      | Merge target branch into active branch',
            helpRebase: '  rebase <name>     | Rebase active branch onto target branch',
            helpReset: '  reset             | Reset all branches to initial state',
            helpHelp: '  help              | View this command list summary',
            errNoMsg: 'Error: Please provide commit message. Syntax: git commit -m "message"',
            branchListHeader: 'Available Local Branches:',
            errNoBranch: 'Error: Please specify branch name.',
            errBranchExist: "Error: Branch name '{name}' already exists.",
            successBranch: "[branch] Created new branch '{name}' off {parent}",
            errNoCheckout: 'Error: Please specify target branch. Syntax: git checkout <branch_name>',
            errCheckoutNotExist: "Error: Branch '{name}' not found.",
            successCheckout: "[checkout] Switched to branch '{name}'",
            errNoMerge: 'Error: Please specify source branch. Syntax: git merge <branch_name>',
            errMergeSelf: 'Error: Cannot merge a branch into itself.',
            errMergeNotExist: "Error: Branch '{name}' not found.",
            mergeUpToDate: 'Info: Branches are already up to date, no merge needed.',
            successMerge: "[merge] Merged '{source}' into '{target}', created merge commit {hash}",
            errNoRebase: 'Error: Please specify target base branch. Syntax: git rebase <branch_name>',
            errRebaseSelf: 'Error: Cannot rebase a branch onto itself.',
            errRebaseNotExist: "Error: Branch '{name}' not found.",
            rebaseFastForward: "[rebase] Branch '{current}' has no unique commits, fast-forwarded to '{base}' ({hash})",
            successRebase: "[rebase] Rebased branch '{current}' onto '{base}' ({count} commits rewritten)",
            successReset: 'Git Simulator reset successful! All branches returned to initial state.',
            errUnsupported: "Error: Unsupported virtual command '{cmd}'. Type 'help' for instructions.",
            copySuccess: '[Copy] Command copied to clipboard: {cmd}',
            copyFail: 'Copy failed: Please copy preview box text manually.',
            defaultDesc: 'This commit employs semantic Conventional Commit structure. Context is clear without extra details needed.'
        }
    };

    /* ==========================================================================
       2. Translation Logic
       ========================================================================== */
    function setLanguage(lang) {
        currentLang = lang;
        
        // Loop and update elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translation = i18nDict[lang][key];
            if (translation) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = translation;
                } else if (key === 'page-title') {
                    document.title = translation;
                } else {
                    el.innerHTML = translation;
                }
            }
        });

        // Update Commit Type select options
        commitType.innerHTML = '';
        commitTypeOptions[lang].forEach(opt => {
            const el = document.createElement('option');
            el.value = opt.value;
            el.textContent = opt.text;
            commitType.appendChild(el);
        });

        // Update active language switcher button visual
        if (lang === 'en') {
            langSwitchBtn.innerHTML = '<i data-lucide="languages"></i> <span>繁體中文</span>';
        } else {
            langSwitchBtn.innerHTML = '<i data-lucide="languages"></i> <span>English</span>';
        }
        lucide.createIcons();

        // Refresh dynamic components
        updateCommitPreview();
        updateLegendUI();
        if (activeScenario) {
            updateGuideUI();
        }
    }

    // Dynamic Legends Renderer
    function updateLegendUI() {
        const legendBox = document.getElementById('vis-legend-box');
        legendBox.innerHTML = `
            <div class="legend-item"><span class="legend-dot main"></span> main</div>
            ${gitState.branches['develop'] ? `<div class="legend-item"><span class="legend-dot develop"></span> develop</div>` : ''}
            <div class="legend-item"><span class="legend-dot feature"></span> feature/*</div>
            ${Object.keys(gitState.branches).some(b => b.startsWith('release/')) ? `<div class="legend-item"><span class="legend-dot release"></span> release/*</div>` : ''}
            ${Object.keys(gitState.branches).some(b => b.startsWith('hotfix/')) ? `<div class="legend-item"><span class="legend-dot hotfix"></span> hotfix/*</div>` : ''}
        `;
    }

    // Toggle Button listener
    langSwitchBtn.addEventListener('click', () => {
        const nextLang = currentLang === 'zh' ? 'en' : 'zh';
        setLanguage(nextLang);
        logToTerminal(nextLang === 'zh' ? '>> 介面語言已切換為：繁體中文' : '>> UI Language switched to English.', 'system');
    });

    /* ==========================================================================
       3. Git Simulator State & Data Models
       ========================================================================== */
    let gitState = {
        commits: {},       // Keyed by hash (C0, C1, ...)
        branches: {},      // Name -> Hash
        activeBranch: '',  // Current branch name
        commitCounter: 0,  // Generator index
        branchColors: {},  // Branch name -> color
        branchRows: {},    // Branch name -> Y axis level index
    };

    // Constant configurations
    const Y_MAIN = 160;
    const Y_DEVELOP = 240;
    const Y_FEATURE = 320;
    const Y_RELEASE = 80;
    const Y_HOTFIX = 80;
    const X_STEP = 80;
    const X_START = 50;

    // Initialize standard simulation state
    function initGitSimulator() {
        gitState.commits = {};
        gitState.branches = { 'main': 'C0' };
        gitState.activeBranch = 'main';
        gitState.commitCounter = 0;
        
        gitState.branchColors = {
            'main': 'var(--branch-main)',
        };
        
        gitState.branchRows = {
            'main': 0, // Level Y_MAIN
        };

        // Create C0 initial commit
        gitState.commits['C0'] = {
            id: 'C0',
            parents: [],
            message: 'chore: initial commit',
            author: currentLang === 'zh' ? '張紘睿' : 'Chang Hung-Jui',
            date: getTodayString(),
            branch: 'main',
            x: X_START,
            y: Y_MAIN,
            stepIndex: 0
        };

        // Initialize Console text
        terminalLog.innerHTML = `
            <div class="log-line system">${logMessages[currentLang].init}</div>
            <div class="log-line system">${logMessages[currentLang].initCommit}</div>
        `;

        updateActiveIndicators();
        renderGitTree();
    }

    // Generate date string
    function getTodayString() {
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // Create a new virtual commit
    function virtualCommit(message, details = {}) {
        const hash = `C${++gitState.commitCounter}`;
        const parentHash = gitState.branches[gitState.activeBranch];
        const parentCommit = gitState.commits[parentHash];

        const newStepIndex = parentCommit ? parentCommit.stepIndex + 1 : 0;
        const xCoord = X_START + (newStepIndex * X_STEP);
        const yCoord = getBranchYCoordinate(gitState.activeBranch);

        gitState.commits[hash] = {
            id: hash,
            parents: parentHash ? [parentHash] : [],
            message: message,
            author: currentLang === 'zh' ? '張紘睿' : 'Chang Hung-Jui',
            date: getTodayString(),
            branch: gitState.activeBranch,
            x: xCoord,
            y: yCoord,
            body: details.body || '',
            breaking: details.breaking || false,
            stepIndex: newStepIndex
        };

        gitState.branches[gitState.activeBranch] = hash;

        // Log message
        logToTerminal(logMessages[currentLang].successBranch.replace('{name}', hash).replace('{parent}', `(${message})`), 'success');
        
        updateActiveIndicators();
        renderGitTree();
        
        checkTutorialStep('commit', message);
        return hash;
    }

    // Create a new virtual branch
    function virtualBranch(branchName) {
        if (!branchName) {
            logToTerminal(logMessages[currentLang].errNoBranch, 'error');
            return false;
        }
        if (gitState.branches[branchName]) {
            logToTerminal(logMessages[currentLang].errBranchExist.replace('{name}', branchName), 'error');
            return false;
        }

        const parentHash = gitState.branches[gitState.activeBranch];
        gitState.branches[branchName] = parentHash;

        if (branchName.startsWith('feature/')) {
            gitState.branchColors[branchName] = 'var(--branch-feature)';
            const featureCount = Object.keys(gitState.branches).filter(b => b.startsWith('feature/')).length;
            gitState.branchRows[branchName] = 1 + (featureCount % 2); 
        } else if (branchName.startsWith('release/')) {
            gitState.branchColors[branchName] = 'var(--branch-release)';
            gitState.branchRows[branchName] = -1;
        } else if (branchName.startsWith('hotfix/')) {
            gitState.branchColors[branchName] = 'var(--branch-hotfix)';
            gitState.branchRows[branchName] = -2;
        } else if (branchName === 'develop') {
            gitState.branchColors[branchName] = 'var(--branch-develop)';
            gitState.branchRows[branchName] = 0.5;
        } else {
            gitState.branchColors[branchName] = 'var(--accent)';
            gitState.branchRows[branchName] = 3;
        }

        logToTerminal(logMessages[currentLang].successBranch.replace('{name}', branchName).replace('{parent}', parentHash), 'success');
        
        renderGitTree();
        checkTutorialStep('branch', branchName);
        return true;
    }

    // Checkout branch
    function virtualCheckout(branchName) {
        if (!branchName) {
            logToTerminal(logMessages[currentLang].errNoCheckout, 'error');
            return false;
        }

        if (!gitState.branches[branchName]) {
            logToTerminal(logMessages[currentLang].errCheckoutNotExist.replace('{name}', branchName), 'error');
            return false;
        }

        gitState.activeBranch = branchName;
        logToTerminal(logMessages[currentLang].successCheckout.replace('{name}', branchName), 'output');
        
        updateActiveIndicators();
        renderGitTree();
        
        checkTutorialStep('checkout', branchName);
        return true;
    }

    // Merge Branch
    function virtualMerge(sourceBranch) {
        const currentBranch = gitState.activeBranch;
        
        if (!sourceBranch) {
            logToTerminal(logMessages[currentLang].errNoMerge, 'error');
            return false;
        }
        if (currentBranch === sourceBranch) {
            logToTerminal(logMessages[currentLang].errMergeSelf, 'error');
            return false;
        }
        if (!gitState.branches[sourceBranch]) {
            logToTerminal(logMessages[currentLang].errMergeNotExist.replace('{name}', sourceBranch), 'error');
            return false;
        }

        const targetHash = gitState.branches[currentBranch];
        const sourceHash = gitState.branches[sourceBranch];

        if (targetHash === sourceHash) {
            logToTerminal(logMessages[currentLang].mergeUpToDate, 'warning');
            return true;
        }

        const hash = `C${++gitState.commitCounter}`;
        const targetCommit = gitState.commits[targetHash];
        const sourceCommit = gitState.commits[sourceHash];

        const newStepIndex = Math.max(targetCommit.stepIndex, sourceCommit.stepIndex) + 1;
        const xCoord = X_START + (newStepIndex * X_STEP);
        const yCoord = getBranchYCoordinate(currentBranch);

        // Merge commit
        gitState.commits[hash] = {
            id: hash,
            parents: [targetHash, sourceHash],
            message: `merge: Merge branch '${sourceBranch}' into ${currentBranch}`,
            author: currentLang === 'zh' ? '張紘睿' : 'Chang Hung-Jui',
            date: getTodayString(),
            branch: currentBranch,
            x: xCoord,
            y: yCoord,
            stepIndex: newStepIndex,
            isMerge: true
        };

        gitState.branches[currentBranch] = hash;

        logToTerminal(logMessages[currentLang].successMerge.replace('{source}', sourceBranch).replace('{target}', currentBranch).replace('{hash}', hash), 'success');
        
        updateActiveIndicators();
        renderGitTree();
        
        checkTutorialStep('merge', sourceBranch);
        return hash;
    }

    // Rebase
    function virtualRebase(baseBranch) {
        const currentBranch = gitState.activeBranch;
        if (!baseBranch) {
            logToTerminal(logMessages[currentLang].errNoRebase, 'error');
            return false;
        }
        if (currentBranch === baseBranch) {
            logToTerminal(logMessages[currentLang].errRebaseSelf, 'error');
            return false;
        }
        if (!gitState.branches[baseBranch]) {
            logToTerminal(logMessages[currentLang].errRebaseNotExist.replace('{name}', baseBranch), 'error');
            return false;
        }

        const currentHash = gitState.branches[currentBranch];
        const baseHash = gitState.branches[baseBranch];

        const commitsToRebase = [];
        let curr = currentHash;
        const baseAncestors = getAncestors(baseHash);
        
        while (curr && !baseAncestors.includes(curr)) {
            const commit = gitState.commits[curr];
            if (!commit) break;
            if (commit.branch === currentBranch) {
                commitsToRebase.unshift(commit);
            }
            curr = commit.parents[0];
        }

        if (commitsToRebase.length === 0) {
            gitState.branches[currentBranch] = baseHash;
            logToTerminal(logMessages[currentLang].rebaseFastForward.replace('{current}', currentBranch).replace('{base}', baseBranch).replace('{hash}', baseHash), 'warning');
        } else {
            let parentHash = baseHash;
            commitsToRebase.forEach((oldCommit) => {
                const newHash = `C${++gitState.commitCounter}`;
                const parentCommit = gitState.commits[parentHash];
                const newStepIndex = parentCommit.stepIndex + 1;
                
                gitState.commits[newHash] = {
                    id: newHash,
                    parents: [parentHash],
                    message: `${oldCommit.message} (rebased)`,
                    author: oldCommit.author,
                    date: getTodayString(),
                    branch: currentBranch,
                    x: X_START + (newStepIndex * X_STEP),
                    y: getBranchYCoordinate(currentBranch),
                    stepIndex: newStepIndex,
                    wasRebased: true
                };
                
                parentHash = newHash;
            });
            
            gitState.branches[currentBranch] = parentHash;
            logToTerminal(logMessages[currentLang].successRebase.replace('{current}', currentBranch).replace('{base}', baseBranch).replace('{count}', commitsToRebase.length), 'success');
        }

        updateActiveIndicators();
        renderGitTree();
        
        checkTutorialStep('rebase', baseBranch);
        return true;
    }

    function getAncestors(commitHash) {
        const ancestors = [];
        const queue = [commitHash];
        while (queue.length > 0) {
            const curr = queue.shift();
            if (curr && !ancestors.includes(curr)) {
                ancestors.push(curr);
                const commit = gitState.commits[curr];
                if (commit && commit.parents) {
                    queue.push(...commit.parents);
                }
            }
        }
        return ancestors;
    }

    function getBranchYCoordinate(branchName) {
        const level = gitState.branchRows[branchName] || 0;
        if (branchName === 'main') return Y_MAIN;
        if (branchName === 'develop') return Y_DEVELOP;
        if (branchName.startsWith('feature/')) return Y_FEATURE + ((level - 1) * 60);
        if (branchName.startsWith('release/')) return Y_RELEASE;
        if (branchName.startsWith('hotfix/')) return Y_HOTFIX - 40;
        return Y_FEATURE + (level * 60);
    }

    function updateActiveIndicators() {
        activeBranchIndicator.textContent = gitState.activeBranch;
        const commitCount = Object.keys(gitState.commits).length;
        commitCountIndicator.textContent = commitCount;
        updateLegendUI();
    }

    /* ==========================================================================
       4. Dynamic SVG Rendering Engine
       ========================================================================== */
    function renderGitTree() {
        const svg = document.getElementById('git-svg');
        svg.innerHTML = ''; 

        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        defs.innerHTML = `
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
        `;
        svg.appendChild(defs);

        const activeTipHashes = Object.values(gitState.branches);

        let maxStepIndex = 0;
        Object.values(gitState.commits).forEach(c => {
            if (c.stepIndex > maxStepIndex) maxStepIndex = c.stepIndex;
        });
        const svgWidth = Math.max(800, X_START + (maxStepIndex * X_STEP) + 120);
        svg.setAttribute('width', svgWidth);
        svg.setAttribute('viewBox', `0 0 ${svgWidth} 500`);

        // BRANCH CONNECTIONS
        Object.values(gitState.commits).forEach((commit) => {
            const branchColor = gitState.branchColors[commit.branch] || 'var(--accent)';
            
            commit.parents.forEach((parentId) => {
                const parent = gitState.commits[parentId];
                if (!parent) return;

                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                const cx1 = parent.x + 40;
                const cy1 = parent.y;
                const cx2 = commit.x - 40;
                const cy2 = commit.y;
                
                path.setAttribute('d', `M ${parent.x} ${parent.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${commit.x} ${commit.y}`);
                path.setAttribute('fill', 'none');
                
                const strokeColor = commit.isMerge ? (gitState.branchColors[parent.branch] || 'var(--text-muted)') : branchColor;
                path.setAttribute('stroke', strokeColor);
                path.setAttribute('stroke-width', '3');
                path.setAttribute('class', 'branch-path');
                path.setAttribute('opacity', commit.isMerge ? '0.5' : '0.8');
                
                if (commit.isMerge && commit.parents[1] === parentId) {
                    path.setAttribute('stroke-dasharray', '5,5');
                }

                svg.appendChild(path);
            });
        });

        // COMMIT NODES
        Object.values(gitState.commits).forEach((commit) => {
            const branchColor = gitState.branchColors[commit.branch] || 'var(--accent)';
            const isTip = activeTipHashes.includes(commit.id);
            const isCurrentTip = gitState.branches[gitState.activeBranch] === commit.id;

            const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            g.setAttribute('class', `commit-node ${isCurrentTip ? 'active-branch-tip' : ''}`);
            g.addEventListener('click', () => inspectCommit(commit.id));

            if (isCurrentTip) {
                const glowCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                glowCircle.setAttribute('cx', commit.x);
                glowCircle.setAttribute('cy', commit.y);
                glowCircle.setAttribute('r', '15');
                glowCircle.setAttribute('fill', 'none');
                glowCircle.setAttribute('stroke', branchColor);
                glowCircle.setAttribute('stroke-width', '1.5');
                glowCircle.setAttribute('opacity', '0.6');
                g.appendChild(glowCircle);
            }

            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', commit.x);
            circle.setAttribute('cy', commit.y);
            circle.setAttribute('r', isTip ? '10' : '8');
            circle.setAttribute('fill', '#0f172a');
            circle.setAttribute('stroke', branchColor);
            circle.setAttribute('stroke-width', isTip ? '4' : '3');
            circle.setAttribute('filter', isCurrentTip ? 'url(#glow)' : '');
            g.appendChild(circle);

            const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            label.setAttribute('x', commit.x);
            label.setAttribute('y', commit.y + 3);
            label.setAttribute('text-anchor', 'middle');
            label.setAttribute('class', 'commit-node-label');
            label.textContent = commit.id;
            g.appendChild(label);

            const subject = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            subject.setAttribute('x', commit.x);
            subject.setAttribute('y', commit.y - 18);
            subject.setAttribute('text-anchor', 'middle');
            subject.setAttribute('class', `commit-subject-text ${isCurrentTip ? 'active' : ''}`);
            
            let subjectText = commit.message;
            if (subjectText.length > 18) subjectText = subjectText.substring(0, 15) + '...';
            subject.textContent = subjectText;
            g.appendChild(subject);

            svg.appendChild(g);
        });

        // BRANCH TAG LABELS
        Object.entries(gitState.branches).forEach(([branchName, commitHash]) => {
            const commit = gitState.commits[commitHash];
            if (!commit) return;

            const branchColor = gitState.branchColors[branchName] || 'var(--accent)';
            const isActive = gitState.activeBranch === branchName;

            const tagG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            tagG.setAttribute('transform', `translate(${commit.x + 15}, ${commit.y - 4})`);

            const siblingTagsCount = Object.entries(gitState.branches).filter(
                ([bName, cHash]) => cHash === commitHash && bName < branchName
            ).length;
            
            if (siblingTagsCount > 0) {
                tagG.setAttribute('transform', `translate(${commit.x + 15}, ${commit.y + (siblingTagsCount * 22) - 4})`);
            }

            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('x', '0');
            rect.setAttribute('y', '-6');
            
            const labelWidth = branchName.length * 6 + 18;
            rect.setAttribute('width', labelWidth);
            rect.setAttribute('height', '18');
            rect.setAttribute('rx', '4');
            rect.setAttribute('fill', isActive ? branchColor : 'rgba(15, 23, 42, 0.9)');
            rect.setAttribute('stroke', branchColor);
            rect.setAttribute('stroke-width', '1.5');
            tagG.appendChild(rect);

            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', '9');
            text.setAttribute('y', '6');
            text.setAttribute('class', 'branch-label-tag');
            text.setAttribute('fill', isActive ? '#ffffff' : branchColor);
            text.textContent = branchName;
            tagG.appendChild(text);

            svg.appendChild(tagG);
        });
    }

    /* ==========================================================================
       5. UI Event Handlers
       ========================================================================== */
    function logToTerminal(message, type = 'system') {
        const line = document.createElement('div');
        line.classList.add('log-line', type);
        line.innerHTML = message;
        terminalLog.appendChild(line);
        terminalLog.scrollTop = terminalLog.scrollHeight;
    }

    function inspectCommit(hash) {
        const commit = gitState.commits[hash];
        if (!commit) return;

        inspectorHash.textContent = commit.id;
        inspectorSubject.textContent = commit.message;
        inspectorBranchTag.textContent = commit.branch;
        inspectorBranchTag.style.backgroundColor = gitState.branchColors[commit.branch] || 'var(--accent)';
        inspectorBranchTag.style.color = '#ffffff';

        inspectorAuthor.textContent = commit.author;
        inspectorDate.textContent = commit.date;
        inspectorBodyDesc.textContent = commit.body || logMessages[currentLang].defaultDesc;

        inspectorCard.style.opacity = '1';
    }

    /* ==========================================================================
       6. CLI Parser
       ========================================================================== */
    function executeCliCommand(rawInput) {
        const trimmed = rawInput.trim();
        if (!trimmed) return;

        logToTerminal(trimmed, 'input');
        terminalCli.value = '';

        let tokens = trimmed.split(/\s+/);
        if (tokens[0].toLowerCase() === 'git') {
            tokens.shift();
        }

        const cmd = tokens[0]?.toLowerCase();
        if (!cmd) {
            logToTerminal(logMessages[currentLang].errorEmptyCmd, 'error');
            return;
        }

        switch (cmd) {
            case 'help':
                logToTerminal(logMessages[currentLang].helpHeader, 'system');
                logToTerminal(logMessages[currentLang].helpCommit, 'output');
                logToTerminal(logMessages[currentLang].helpBranch, 'output');
                logToTerminal(logMessages[currentLang].helpCheckout, 'output');
                logToTerminal(logMessages[currentLang].helpMerge, 'output');
                logToTerminal(logMessages[currentLang].helpRebase, 'output');
                logToTerminal(logMessages[currentLang].helpReset, 'output');
                logToTerminal(logMessages[currentLang].helpHelp, 'output');
                break;
            
            case 'commit':
                let mIndex = tokens.indexOf('-m');
                if (mIndex === -1) mIndex = tokens.indexOf('--message');
                
                if (mIndex === -1 || !tokens[mIndex + 1]) {
                    logToTerminal(logMessages[currentLang].errNoMsg, 'error');
                } else {
                    let message = tokens.slice(mIndex + 1).join(' ');
                    if (message.startsWith('"') && message.endsWith('"')) message = message.slice(1, -1);
                    if (message.startsWith("'") && message.endsWith("'")) message = message.slice(1, -1);
                    virtualCommit(message);
                }
                break;

            case 'branch':
                if (!tokens[1]) {
                    logToTerminal(logMessages[currentLang].branchListHeader, 'system');
                    Object.keys(gitState.branches).forEach(b => {
                        const isCurrent = b === gitState.activeBranch;
                        logToTerminal(`  ${isCurrent ? '*' : ' '} ${b}`, isCurrent ? 'success' : 'output');
                    });
                } else {
                    virtualBranch(tokens[1]);
                }
                break;

            case 'checkout':
                if (tokens[1] === '-b' && tokens[2]) {
                    const success = virtualBranch(tokens[2]);
                    if (success) virtualCheckout(tokens[2]);
                } else if (tokens[1]) {
                    virtualCheckout(tokens[1]);
                } else {
                    logToTerminal(logMessages[currentLang].errNoCheckout, 'error');
                }
                break;

            case 'merge':
                if (tokens[1]) {
                    virtualMerge(tokens[1]);
                } else {
                    logToTerminal(logMessages[currentLang].errNoMerge, 'error');
                }
                break;

            case 'rebase':
                if (tokens[1]) {
                    virtualRebase(tokens[1]);
                } else {
                    logToTerminal(logMessages[currentLang].errNoRebase, 'error');
                }
                break;

            case 'reset':
                initGitSimulator();
                logToTerminal(logMessages[currentLang].successReset, 'success');
                break;

            default:
                logToTerminal(logMessages[currentLang].errUnsupported.replace('{cmd}', cmd), 'error');
                break;
        }
    }

    terminalCli.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            executeCliCommand(terminalCli.value);
        }
    });

    cliExecuteBtn.addEventListener('click', () => {
        executeCliCommand(terminalCli.value);
    });

    /* ==========================================================================
       7. Conventional Commit Builder
       ========================================================================== */
    function updateCommitPreview() {
        const type = commitType.value;
        const scope = commitScope.value.trim();
        const subject = commitSubject.value.trim();
        const isBreaking = commitBreaking.checked;
        const breakingDesc = commitBreakingDesc.value.trim();

        let preview = type;
        if (scope) {
            preview += `(${scope})`;
        }
        if (isBreaking) {
            preview += '!';
        }
        preview += `: ${subject || (currentLang === 'zh' ? '初始設定描述' : 'initial configuration setup')}`;

        if (isBreaking && breakingDesc) {
            preview += `\n\nBREAKING CHANGE: ${breakingDesc}`;
        }

        commitPreviewText.textContent = preview;
    }

    [commitType, commitScope, commitSubject, commitBody, commitBreaking, commitBreakingDesc].forEach(el => {
        el.addEventListener('input', updateCommitPreview);
    });

    commitBreaking.addEventListener('change', () => {
        if (commitBreaking.checked) {
            breakingDescContainer.style.display = 'flex';
        } else {
            breakingDescContainer.style.display = 'none';
        }
        updateCommitPreview();
    });

    copyCommitBtn.addEventListener('click', () => {
        const commitMsg = commitPreviewText.textContent;
        const escapedMsg = commitMsg.replace(/"/g, '\\"').replace(/\n/g, ' ');
        const fullCmd = `git commit -m "${escapedMsg}"`;

        navigator.clipboard.writeText(fullCmd).then(() => {
            const originalText = copyCommitBtn.innerHTML;
            copyCommitBtn.innerHTML = `<i data-lucide="check"></i> <span>${currentLang === 'zh' ? '複製成功！' : 'Copied!'}</span>`;
            lucide.createIcons();
            
            logToTerminal(logMessages[currentLang].copySuccess.replace('{cmd}', `<code>${fullCmd}</code>`), 'system');
            
            setTimeout(() => {
                copyCommitBtn.innerHTML = originalText;
                lucide.createIcons();
            }, 2000);
        }).catch(err => {
            logToTerminal(logMessages[currentLang].copyFail, 'error');
        });
    });

    commitForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const commitMsg = commitPreviewText.textContent;
        const isBreaking = commitBreaking.checked;
        const bodyText = commitBody.value.trim();

        virtualCommit(commitMsg, {
            body: bodyText,
            breaking: isBreaking
        });

        commitSubject.value = '';
        commitBody.value = '';
        commitBreaking.checked = false;
        commitBreakingDesc.value = '';
        breakingDescContainer.style.display = 'none';
        updateCommitPreview();

        document.querySelector('.tab-btn[data-tab="interactive-ctrl"]').click();
    });

    /* ==========================================================================
       8. Guided Scenarios Tutorials System (with i18n support)
       ========================================================================== */
    const scenarios = {
        'github-flow': {
            title: {
                'zh': 'GitHub Flow 實戰引導',
                'en': 'GitHub Flow Guided Challenge'
            },
            steps: [
                {
                    text: {
                        'zh': '<strong>步驟 1 / 4：建立功能分支。</strong><br>開源專案的主分支 main 應隨時保持乾淨。請建立一條名為 <code>feature/login</code> 的分支來進行功能開發。<br><em>請輸入：<code>git branch feature/login</code></em>',
                        'en': '<strong>Step 1 / 4: Create a feature branch.</strong><br>The main branch of open source projects should always be deployable and clean. Let\'s create a new branch named <code>feature/login</code> for feature development.<br><em>Type: <code>git branch feature/login</code></em>'
                    },
                    hint: {
                        'zh': '建立 feature/login 分支',
                        'en': 'Create feature/login branch'
                    },
                    trigger: 'branch',
                    arg: 'feature/login',
                    autoCmd: 'branch feature/login'
                },
                {
                    text: {
                        'zh': '<strong>步驟 2 / 4：切換到功能分支。</strong><br>接下來，請切換至該分支，確保接下來的提交訊息不會弄亂 main。<br><em>請輸入：<code>git checkout feature/login</code></em>',
                        'en': '<strong>Step 2 / 4: Switch to the feature branch.</strong><br>Next, switch to this branch to ensure subsequent commit histories are isolated from main.<br><em>Type: <code>git checkout feature/login</code></em>'
                    },
                    hint: {
                        'zh': '切換至 feature/login 分支',
                        'en': 'Checkout feature/login branch'
                    },
                    trigger: 'checkout',
                    arg: 'feature/login',
                    autoCmd: 'checkout feature/login'
                },
                {
                    text: {
                        'zh': '<strong>步驟 3 / 4：進行開發提交。</strong><br>在此分支進行代碼修改並完成 Conventional Commit。建議使用 feat 類型。<br><em>請輸入：<code>git commit -m "feat(auth): add google authentication"</code></em>',
                        'en': '<strong>Step 3 / 4: Make development commits.</strong><br>Make code modifications on this branch and write a Conventional Commit message. "feat" type is recommended.<br><em>Type: <code>git commit -m "feat(auth): add google authentication"</code></em>'
                    },
                    hint: {
                        'zh': '提交 feat(auth): add google authentication',
                        'en': 'Commit feat(auth): add google authentication'
                    },
                    trigger: 'commit',
                    arg: 'feat(auth): add google authentication',
                    autoCmd: 'commit -m "feat(auth): add google authentication"'
                },
                {
                    text: {
                        'zh': '<strong>步驟 4 / 4：合併回主要分支。</strong><br>功能在 PR 通過後，必須安全併回 main。請先切回 <code>main</code>，然後將 <code>feature/login</code> 分支進行 Merge 合併。<br><em>請輸入：<code>git checkout main</code>，接著 <code>git merge feature/login</code></em>',
                        'en': '<strong>Step 4 / 4: Merge back to main.</strong><br>Once the PR is approved, it must be merged back to main. Switch back to <code>main</code>, then merge the <code>feature/login</code> branch.<br><em>Type: <code>git checkout main</code>, then <code>git merge feature/login</code></em>'
                    },
                    hint: {
                        'zh': '合併 feature/login 至 main 分支',
                        'en': 'Merge feature/login into main'
                    },
                    trigger: 'merge',
                    arg: 'feature/login',
                    autoCmd: 'merge feature/login'
                }
            ]
        },
        'git-flow': {
            title: {
                'zh': 'Git Flow 經典流程引導',
                'en': 'Git Flow Classic Challenge'
            },
            steps: [
                {
                    text: {
                        'zh': '<strong>步驟 1 / 5：建立 develop 分支。</strong><br>Git Flow 的核心在於擁有主要分支 main (生產環境) 與 develop (日常整合環境)。請先建立 develop 分支。<br><em>請輸入：<code>git branch develop</code></em>',
                        'en': '<strong>Step 1 / 5: Create develop branch.</strong><br>The heart of Git Flow is having main (production) and develop (integration) branches. Create the develop branch first.<br><em>Type: <code>git branch develop</code></em>'
                    },
                    hint: {
                        'zh': '建立 develop 分支',
                        'en': 'Create develop branch'
                    },
                    trigger: 'branch',
                    arg: 'develop',
                    autoCmd: 'branch develop'
                },
                {
                    text: {
                        'zh': '<strong>步驟 2 / 5：切換至 develop 分支。</strong><br>平常開發都是基於 develop。請切換過去。<br><em>請輸入：<code>git checkout develop</code></em>',
                        'en': '<strong>Step 2 / 5: Switch to develop branch.</strong><br>Most daily integration occurs on develop. Switch checkout to develop.<br><em>Type: <code>git checkout develop</code></em>'
                    },
                    hint: {
                        'zh': '切換至 develop',
                        'en': 'Checkout develop branch'
                    },
                    trigger: 'checkout',
                    arg: 'develop',
                    autoCmd: 'checkout develop'
                },
                {
                    text: {
                        'zh': '<strong>步驟 3 / 5：拉出 feature 功能分支。</strong><br>當要開發某個新功能時，必須從 develop 拉出功能分支。我們拉一個 <code>feature/payment</code> 分支。<br><em>請輸入：<code>git checkout -b feature/payment</code></em>',
                        'en': '<strong>Step 3 / 5: Branch out a feature.</strong><br>When starting new features, branch off develop. Let\'s create a <code>feature/payment</code> branch.<br><em>Type: <code>git checkout -b feature/payment</code></em>'
                    },
                    hint: {
                        'zh': '建立並切換至 feature/payment',
                        'en': 'Create and checkout feature/payment'
                    },
                    trigger: 'checkout',
                    arg: 'feature/payment',
                    autoCmd: 'checkout -b feature/payment'
                },
                {
                    text: {
                        'zh': '<strong>步驟 4 / 5：在新分支進行提交。</strong><br>在新功能分支上新增一些變更提交。<br><em>請輸入：<code>git commit -m "feat(payment): integrate Stripe API gateway"</code></em>',
                        'en': '<strong>Step 4 / 5: Make commits.</strong><br>Add code changes in this feature branch.<br><em>Type: <code>git commit -m "feat(payment): integrate Stripe API gateway"</code></em>'
                    },
                    hint: {
                        'zh': '提交付款功能代碼',
                        'en': 'Commit payment gateway feature'
                    },
                    trigger: 'commit',
                    arg: 'feat(payment): integrate Stripe API gateway',
                    autoCmd: 'commit -m "feat(payment): integrate Stripe API gateway"'
                },
                {
                    text: {
                        'zh': '<strong>步驟 5 / 5：合併功能回 develop。</strong><br>開發完成後，請切換回 <code>develop</code>，並將 <code>feature/payment</code> 合併回來。<br><em>請輸入：<code>git checkout develop</code>，隨後 <code>git merge feature/payment</code></em>',
                        'en': '<strong>Step 5 / 5: Merge back to develop.</strong><br>Feature complete! Switch back to <code>develop</code> and merge <code>feature/payment</code>.<br><em>Type: <code>git checkout develop</code>, then <code>git merge feature/payment</code></em>'
                    },
                    hint: {
                        'zh': '合併 feature/payment 到 develop',
                        'en': 'Merge feature/payment into develop'
                    },
                    trigger: 'merge',
                    arg: 'feature/payment',
                    autoCmd: 'merge feature/payment'
                }
            ]
        }
    };

    let activeScenario = null;
    let currentStepIndex = 0;

    window.loadScenario = function(scenarioKey) {
        initGitSimulator(); 
        
        activeScenario = scenarios[scenarioKey];
        currentStepIndex = 0;

        document.querySelectorAll('.scenario-card').forEach(card => {
            card.classList.remove('active');
            if (card.getAttribute('data-scenario') === scenarioKey) {
                card.classList.add('active');
            }
        });

        tutorialGuideBox.style.display = 'flex';
        updateGuideUI();
        
        logToTerminal(currentLang === 'zh' ? `🚀 已載入教學引導：「${activeScenario.title[currentLang]}」，請跟著步驟嘗試！` : `🚀 Loaded scenario: "${activeScenario.title[currentLang]}". Let's get started!`, 'warning');
    };

    function updateGuideUI() {
        if (!activeScenario) return;
        const currentStep = activeScenario.steps[currentStepIndex];

        guideTitle.textContent = activeScenario.title[currentLang];
        guideProgress.textContent = `${currentLang === 'zh' ? '步驟' : 'Step'} ${currentStepIndex + 1} / ${activeScenario.steps.length}`;
        guideInstructions.innerHTML = currentStep.text[currentLang];
        guideNextHint.textContent = `${currentLang === 'zh' ? '待完成目標' : 'Objective'}：${currentStep.hint[currentLang]}`;
        
        guidePrevBtn.disabled = currentStepIndex === 0;
        guideNextBtn.innerHTML = `<i data-lucide="zap"></i> <span>${currentLang === 'zh' ? '自動執行指令' : 'Auto Execute Command'}</span>`;
        lucide.createIcons();
    }

    guideNextBtn.addEventListener('click', () => {
        if (!activeScenario) return;
        const currentStep = activeScenario.steps[currentStepIndex];
        executeCliCommand(currentStep.autoCmd);
    });

    guidePrevBtn.addEventListener('click', () => {
        if (currentStepIndex > 0) {
            currentStepIndex--;
            updateGuideUI();
        }
    });

    function checkTutorialStep(action, argument) {
        if (!activeScenario) return;
        const currentStep = activeScenario.steps[currentStepIndex];

        if (currentStep.trigger === action) {
            let isValid = false;
            
            if (action === 'commit') {
                isValid = true;
            } else if (action === 'branch' || action === 'checkout') {
                isValid = argument === currentStep.arg;
            } else if (action === 'merge' || action === 'rebase') {
                isValid = argument === currentStep.arg;
            }

            if (isValid) {
                logToTerminal(currentLang === 'zh' ? `🎉 步驟 ${currentStepIndex + 1} 完成成功！` : `🎉 Step ${currentStepIndex + 1} completed successfully!`, 'success');
                
                if (currentStepIndex < activeScenario.steps.length - 1) {
                    currentStepIndex++;
                    updateGuideUI();
                } else {
                    logToTerminal(currentLang === 'zh' ? `🏆 恭喜！您已成功完成「${activeScenario.title[currentLang]}」所有步驟！大功告成！` : `🏆 Congratulations! You successfully completed all steps of "${activeScenario.title[currentLang]}"!`, 'success');
                    guideInstructions.innerHTML = currentLang === 'zh' ? 
                        '<strong>🏆 恭喜完成！</strong><br>您已成功演練了這個標準工作流。您可以繼續使用上方的快捷操作自由發揮，或者開啟其他的教學挑戰。' :
                        '<strong>🏆 Challenge Completed!</strong><br>You have successfully mastered this workflow. Feel free to use the shortcut buttons above to play around, or launch another scenario challenge!';
                    guideNextHint.textContent = currentLang === 'zh' ? '挑戰已解鎖！🎉' : 'Challenge Unlocked! 🎉';
                    guideNextBtn.disabled = true;
                    guideNextBtn.style.opacity = 0.5;
                }
            }
        }
    }

    /* ==========================================================================
       9. Quick Modal Controls
       ========================================================================== */
    window.closeModal = function() {
        interactiveModal.style.display = 'none';
    };

    quickCommitBtn.addEventListener('click', () => {
        document.querySelector('.tab-btn[data-tab="commit-builder"]').click();
        commitSubject.focus();
    });

    quickBranchBtn.addEventListener('click', () => {
        modalTitle.textContent = currentLang === 'zh' ? '建立新分支 (git branch)' : 'Create New Branch (git branch)';
        modalBodyContent.innerHTML = `
            <div class="form-row">
                <label for="modal-input-branch-name"><i data-lucide="git-fork"></i> ${currentLang === 'zh' ? '新分支名稱' : 'Branch Name'}</label>
                <input type="text" id="modal-input-branch-name" placeholder="e.g. feature/payment, release/v1.0..." required>
                <span class="cli-hint">${currentLang === 'zh' ? '為符合開源規範，建議使用 <code>feature/</code> 或 <code>bugfix/</code> 等斜線命名。' : 'It is standard to prefix open source branches with <code>feature/</code> or <code>bugfix/</code>.'}</span>
            </div>
        `;
        lucide.createIcons();
        interactiveModal.style.display = 'flex';
        
        const confirmBtnClone = modalConfirmBtn.cloneNode(true);
        modalConfirmBtn.parentNode.replaceChild(confirmBtnClone, modalConfirmBtn);

        document.getElementById('modal-confirm-btn').addEventListener('click', () => {
            const val = document.getElementById('modal-input-branch-name').value.trim();
            if (val) {
                virtualBranch(val);
                closeModal();
            }
        });
    });

    quickCheckoutBtn.addEventListener('click', () => {
        modalTitle.textContent = currentLang === 'zh' ? '切換分支 (git checkout)' : 'Checkout Branch (git checkout)';
        
        let options = '';
        Object.keys(gitState.branches).forEach(b => {
            options += `<option value="${b}" ${b === gitState.activeBranch ? 'disabled' : ''}>${b} ${b === gitState.activeBranch ? (currentLang === 'zh' ? '(目前)' : '(active)') : ''}</option>`;
        });

        modalBodyContent.innerHTML = `
            <div class="form-row">
                <label for="modal-select-branch"><i data-lucide="git-pull-request"></i> ${currentLang === 'zh' ? '選擇目標分支' : 'Select Target Branch'}</label>
                <select id="modal-select-branch">
                    ${options}
                </select>
            </div>
        `;
        lucide.createIcons();
        interactiveModal.style.display = 'flex';

        const confirmBtnClone = modalConfirmBtn.cloneNode(true);
        modalConfirmBtn.parentNode.replaceChild(confirmBtnClone, modalConfirmBtn);

        document.getElementById('modal-confirm-btn').addEventListener('click', () => {
            const val = document.getElementById('modal-select-branch').value;
            if (val) {
                virtualCheckout(val);
                closeModal();
            }
        });
    });

    quickMergeBtn.addEventListener('click', () => {
        modalTitle.textContent = currentLang === 'zh' ? `合併分支至 ${gitState.activeBranch} (git merge)` : `Merge Branch into ${gitState.activeBranch} (git merge)`;
        
        let options = '';
        Object.keys(gitState.branches).forEach(b => {
            options += `<option value="${b}" ${b === gitState.activeBranch ? 'disabled' : ''}>${b}</option>`;
        });

        modalBodyContent.innerHTML = `
            <div class="form-row">
                <label for="modal-select-branch"><i data-lucide="git-merge"></i> ${currentLang === 'zh' ? '選擇來源分支合併進來' : 'Select Source Branch to Merge'}</label>
                <select id="modal-select-branch">
                    ${options}
                </select>
                <span class="cli-hint">${currentLang === 'zh' ? `這會將所選分支的所有變更合併至目前分支 <code>${gitState.activeBranch}</code> 中。` : `This merges all commits from target branch into active branch <code>${gitState.activeBranch}</code>.`}</span>
            </div>
        `;
        lucide.createIcons();
        interactiveModal.style.display = 'flex';

        const confirmBtnClone = modalConfirmBtn.cloneNode(true);
        modalConfirmBtn.parentNode.replaceChild(confirmBtnClone, modalConfirmBtn);

        document.getElementById('modal-confirm-btn').addEventListener('click', () => {
            const val = document.getElementById('modal-select-branch').value;
            if (val) {
                virtualMerge(val);
                closeModal();
            }
        });
    });

    quickRebaseBtn.addEventListener('click', () => {
        modalTitle.textContent = currentLang === 'zh' ? `將 ${gitState.activeBranch} Rebase 至基底分支 (git rebase)` : `Rebase ${gitState.activeBranch} onto Base Branch (git rebase)`;
        
        let options = '';
        Object.keys(gitState.branches).forEach(b => {
            options += `<option value="${b}" ${b === gitState.activeBranch ? 'disabled' : ''}>${b}</option>`;
        });

        modalBodyContent.innerHTML = `
            <div class="form-row">
                <label for="modal-select-branch"><i data-lucide="refresh-cw"></i> ${currentLang === 'zh' ? '選擇目標基底分支 (Base)' : 'Select Base Branch (Base)'}</label>
                <select id="modal-select-branch">
                    ${options}
                </select>
                <span class="cli-hint">${currentLang === 'zh' ? `警告：Rebase 會重寫當前分支的提交歷史 (Rewrite History)，適合整理本地未 push 的 commits。` : `Warning: Rebase rewrites commit history. Best used for cleaning up local commits before pushing.`}</span>
            </div>
        `;
        lucide.createIcons();
        interactiveModal.style.display = 'flex';

        const confirmBtnClone = modalConfirmBtn.cloneNode(true);
        modalConfirmBtn.parentNode.replaceChild(confirmBtnClone, modalConfirmBtn);

        document.getElementById('modal-confirm-btn').addEventListener('click', () => {
            const val = document.getElementById('modal-select-branch').value;
            if (val) {
                virtualRebase(val);
                closeModal();
            }
        });
    });

    quickResetBtn.addEventListener('click', () => {
        const resetConfirmMsg = currentLang === 'zh' ? '確定要清空所有模擬數據，重回初始 main 分支狀態嗎？' : 'Are you sure you want to reset all simulation data and return to initial main branch state?';
        if (confirm(resetConfirmMsg)) {
            initGitSimulator();
            logToTerminal(currentLang === 'zh' ? 'Git 模擬器重設成功！' : 'Git Simulator Reset Successful!', 'success');
        }
    });

    /* ==========================================================================
       10. Startup Initialization
       ========================================================================== */
    setLanguage('zh'); // Initialize default to Traditional Chinese
    initGitSimulator();
});
