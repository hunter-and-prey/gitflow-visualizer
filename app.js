/* ==========================================================================
   GitFlow Visualizer - Interactive Simulation & Rendering Engine
   Author: 張紘睿
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initial Lucide Icons
    lucide.createIcons();

    // UI Elements
    const terminalCli = document.getElementById('terminal-cli');
    const cliExecuteBtn = document.getElementById('cli-execute-btn');
    const terminalLog = document.getElementById('terminal-log');
    const activeBranchIndicator = document.getElementById('active-branch-indicator');
    const commitCountIndicator = document.getElementById('commit-count-indicator');
    const clearLogBtn = document.getElementById('clear-log-btn');
    
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
       1. Git Simulator State & Data Models
       ========================================================================== */
    let gitState = {
        commits: {},       // Keyed by hash (C0, C1, ...)
        branches: {},      // Name -> Hash
        activeBranch: '',  // Current branch name
        commitCounter: 0,  // Generator index
        branchColors: {},  // Branch name -> color channel
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

    // Default branches styling
    const branchColorPalette = {
        'main': 'var(--branch-main)',
        'develop': 'var(--branch-develop)',
        'feature': 'var(--branch-feature)',
        'release': 'var(--branch-release)',
        'hotfix': 'var(--branch-hotfix)',
    };

    /* ==========================================================================
       2. Core Simulation Engine Functions
       ========================================================================== */
    
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
            author: '張紘睿',
            date: getTodayString(),
            branch: 'main',
            x: X_START,
            y: Y_MAIN,
            stepIndex: 0
        };

        updateActiveIndicators();
        renderGitTree();
    }

    // Generate date string in format YYYY-MM-DD
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

        // Determine X coordinate
        const newStepIndex = parentCommit ? parentCommit.stepIndex + 1 : 0;
        const xCoord = X_START + (newStepIndex * X_STEP);
        
        // Determine Y coordinate based on branch type
        const yCoord = getBranchYCoordinate(gitState.activeBranch);

        // Make commit
        gitState.commits[hash] = {
            id: hash,
            parents: parentHash ? [parentHash] : [],
            message: message,
            author: '張紘睿',
            date: getTodayString(),
            branch: gitState.activeBranch,
            x: xCoord,
            y: yCoord,
            body: details.body || '',
            breaking: details.breaking || false,
            stepIndex: newStepIndex
        };

        // Move branch head
        gitState.branches[gitState.activeBranch] = hash;

        // Log message
        logToTerminal(`[commit] 建立新提交 ${hash} (${message})`, 'success');
        
        updateActiveIndicators();
        renderGitTree();
        
        // Update tutorial check if tutorial is active
        checkTutorialStep('commit', message);
        return hash;
    }

    // Create a new virtual branch
    function virtualBranch(branchName) {
        if (!branchName) {
            logToTerminal('錯誤：請指定分支名稱。', 'error');
            return false;
        }
        if (gitState.branches[branchName]) {
            logToTerminal(`錯誤：分支名稱 '${branchName}' 已存在。`, 'error');
            return false;
        }

        // Parent is head of current active branch
        const parentHash = gitState.branches[gitState.activeBranch];
        gitState.branches[branchName] = parentHash;

        // Assign colors and rows
        if (branchName.startsWith('feature/')) {
            gitState.branchColors[branchName] = 'var(--branch-feature)';
            // Count existing features to stagger
            const featureCount = Object.keys(gitState.branches).filter(b => b.startsWith('feature/')).length;
            gitState.branchRows[branchName] = 1 + (featureCount % 2); // 1 or 2 features Y spacing
        } else if (branchName.startsWith('release/')) {
            gitState.branchColors[branchName] = 'var(--branch-release)';
            gitState.branchRows[branchName] = -1; // Y_RELEASE (top)
        } else if (branchName.startsWith('hotfix/')) {
            gitState.branchColors[branchName] = 'var(--branch-hotfix)';
            gitState.branchRows[branchName] = -2; // Y_HOTFIX (top-top)
        } else if (branchName === 'develop') {
            gitState.branchColors[branchName] = 'var(--branch-develop)';
            gitState.branchRows[branchName] = 0.5; // level Y_DEVELOP
        } else {
            gitState.branchColors[branchName] = 'var(--accent)';
            gitState.branchRows[branchName] = 3;
        }

        logToTerminal(`[branch] 成功建立新分支 '${branchName}' 自 ${parentHash}`, 'success');
        
        renderGitTree();
        checkTutorialStep('branch', branchName);
        return true;
    }

    // Checkout a virtual branch
    function virtualCheckout(branchName) {
        if (!branchName) {
            logToTerminal('錯誤：請指定分支名稱。', 'error');
            return false;
        }

        if (!gitState.branches[branchName]) {
            logToTerminal(`錯誤：找不到分支 '${branchName}'。`, 'error');
            return false;
        }

        gitState.activeBranch = branchName;
        logToTerminal(`[checkout] 切換至分支 '${branchName}'`, 'output');
        
        updateActiveIndicators();
        renderGitTree();
        
        checkTutorialStep('checkout', branchName);
        return true;
    }

    // Virtual Merge (Simple three-way merge commit creation)
    function virtualMerge(sourceBranch) {
        const currentBranch = gitState.activeBranch;
        
        if (!sourceBranch) {
            logToTerminal('錯誤：請指定要合併的來源分支。', 'error');
            return false;
        }
        if (currentBranch === sourceBranch) {
            logToTerminal('錯誤：無法將分支合併到自身。', 'error');
            return false;
        }
        if (!gitState.branches[sourceBranch]) {
            logToTerminal(`錯誤：找不到分支 '${sourceBranch}'。`, 'error');
            return false;
        }

        const targetHash = gitState.branches[currentBranch];
        const sourceHash = gitState.branches[sourceBranch];

        if (targetHash === sourceHash) {
            logToTerminal('訊息：兩個分支已是最新狀態，無需合併。', 'warning');
            return true;
        }

        const hash = `C${++gitState.commitCounter}`;
        const targetCommit = gitState.commits[targetHash];
        const sourceCommit = gitState.commits[sourceHash];

        const newStepIndex = Math.max(targetCommit.stepIndex, sourceCommit.stepIndex) + 1;
        const xCoord = X_START + (newStepIndex * X_STEP);
        const yCoord = getBranchYCoordinate(currentBranch);

        // Create merge commit
        gitState.commits[hash] = {
            id: hash,
            parents: [targetHash, sourceHash],
            message: `merge: Merge branch '${sourceBranch}' into ${currentBranch}`,
            author: '張紘睿',
            date: getTodayString(),
            branch: currentBranch,
            x: xCoord,
            y: yCoord,
            stepIndex: newStepIndex,
            isMerge: true
        };

        // Move current branch head
        gitState.branches[currentBranch] = hash;

        logToTerminal(`[merge] 成功合併 '${sourceBranch}' 至 '${currentBranch}' 建立合併提交 ${hash}`, 'success');
        
        updateActiveIndicators();
        renderGitTree();
        
        checkTutorialStep('merge', sourceBranch);
        return hash;
    }

    // Virtual Rebase
    function virtualRebase(baseBranch) {
        const currentBranch = gitState.activeBranch;
        if (!baseBranch) {
            logToTerminal('錯誤：請指定 Rebase 的目標基底分支。', 'error');
            return false;
        }
        if (currentBranch === baseBranch) {
            logToTerminal('錯誤：無法 Rebase 分支到自身。', 'error');
            return false;
        }
        if (!gitState.branches[baseBranch]) {
            logToTerminal(`錯誤：找不到分支 '${baseBranch}'。`, 'error');
            return false;
        }

        const currentHash = gitState.branches[currentBranch];
        const baseHash = gitState.branches[baseBranch];

        // Gather all commits unique to current branch
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
            logToTerminal(`[rebase] 分支 '${currentBranch}' 無獨特提交，直接 Fast-forward 至 '${baseBranch}' (${baseHash})`, 'warning');
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
            logToTerminal(`[rebase] 成功將分支 '${currentBranch}' Rebase 至 '${baseBranch}' (${commitsToRebase.length} 個提交重寫)`, 'success');
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

        document.querySelector('.develop-legend').style.display = gitState.branches['develop'] ? 'flex' : 'none';
        document.querySelector('.release-legend').style.display = Object.keys(gitState.branches).some(b => b.startsWith('release/')) ? 'flex' : 'none';
        document.querySelector('.hotfix-legend').style.display = Object.keys(gitState.branches).some(b => b.startsWith('hotfix/')) ? 'flex' : 'none';
    }

    /* ==========================================================================
       3. Dynamic SVG Rendering Engine
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
       4. UI Utilities & Event Handlers
       ========================================================================== */
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetPaneId = btn.getAttribute('data-tab');
            
            tabButtons.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));

            btn.classList.add('active');
            document.getElementById(targetPaneId).classList.add('active');
        });
    });

    function logToTerminal(message, type = 'system') {
        const line = document.createElement('div');
        line.classList.add('log-line', type);
        line.textContent = message;
        terminalLog.appendChild(line);
        terminalLog.scrollTop = terminalLog.scrollHeight;
    }

    window.scrollToSection = function(id) {
        document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
    };

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
        inspectorBodyDesc.textContent = commit.body || '這個提交採用 Conventional Commits 語意化命名，資訊明確，無需額外備註說明。';

        inspectorCard.style.opacity = '1';
    }

    clearLogBtn.addEventListener('click', () => {
        terminalLog.innerHTML = `<div class="log-line system">&gt;&gt; 終端機記錄清空。目前位於分支: ${gitState.activeBranch}</div>`;
    });

    /* ==========================================================================
       5. CLI Parser (Command Line Interpreter)
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
            logToTerminal('錯誤：輸入為空或不可解析的 Git 命令。', 'error');
            return;
        }

        switch (cmd) {
            case 'help':
                logToTerminal('可用虛擬命令:', 'system');
                logToTerminal('  commit -m "msg"  | 在目前分支建立新提交', 'output');
                logToTerminal('  branch <name>     | 建立新分支', 'output');
                logToTerminal('  checkout <name>   | 切換至目標分支 (支援 -b 建立並切換)', 'output');
                logToTerminal('  merge <name>      | 合併目標分支至目前分支', 'output');
                logToTerminal('  rebase <name>     | 將目前分支 Rebase 至目標分支', 'output');
                logToTerminal('  reset             | 重設所有分支至初始狀態', 'output');
                logToTerminal('  help              | 顯示此命令說明清單', 'output');
                break;
            
            case 'commit':
                let mIndex = tokens.indexOf('-m');
                if (mIndex === -1) mIndex = tokens.indexOf('--message');
                
                if (mIndex === -1 || !tokens[mIndex + 1]) {
                    logToTerminal('錯誤：請提供提交訊息，語法：git commit -m "訊息描述"', 'error');
                } else {
                    let message = tokens.slice(mIndex + 1).join(' ');
                    if (message.startsWith('"') && message.endsWith('"')) message = message.slice(1, -1);
                    if (message.startsWith("'") && message.endsWith("'")) message = message.slice(1, -1);
                    virtualCommit(message);
                }
                break;

            case 'branch':
                if (!tokens[1]) {
                    logToTerminal('可用本地分支:', 'system');
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
                    logToTerminal('錯誤：請指定 checkout 的分支名稱。語法：git checkout <branch_name>', 'error');
                }
                break;

            case 'merge':
                if (tokens[1]) {
                    virtualMerge(tokens[1]);
                } else {
                    logToTerminal('錯誤：請指定要合併的來源分支。語法：git merge <branch_name>', 'error');
                }
                break;

            case 'rebase':
                if (tokens[1]) {
                    virtualRebase(tokens[1]);
                } else {
                    logToTerminal('錯誤：請指定 Rebase 目標基底分支。語法：git rebase <branch_name>', 'error');
                }
                break;

            case 'reset':
                initGitSimulator();
                logToTerminal('Git 模擬器重設成功！所有虛擬分支回歸初始狀態。', 'success');
                break;

            default:
                logToTerminal(`錯誤：不支援的虛擬指令 '${cmd}'。輸入 'help' 取得協助。`, 'error');
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
       6. Conventional Commit Form Actions
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
        preview += `: ${subject || '初始設定描述'}`;

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
            copyCommitBtn.innerHTML = '<i data-lucide="check"></i> 複製成功！';
            lucide.createIcons();
            
            logToTerminal(`[Copy] 已成功複製命令至剪貼簿：${fullCmd}`, 'system');
            
            setTimeout(() => {
                copyCommitBtn.innerHTML = originalText;
                lucide.createIcons();
            }, 2000);
        }).catch(err => {
            logToTerminal('複製失敗：請手動複製預覽文字。', 'error');
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
       7. Scenarios & Guided Tutorials System
       ========================================================================== */
    const scenarios = {
        'github-flow': {
            title: 'GitHub Flow 實戰引導',
            steps: [
                {
                    text: '<strong>步驟 1 / 4：建立功能分支。</strong><br>開源專案的主分支 main 應隨時保持乾淨。請建立一條名為 <code>feature/login</code> 的分支來進行功能開發。<br><em>請輸入：<code>git branch feature/login</code></em>',
                    hint: '建立 feature/login 分支',
                    trigger: 'branch',
                    arg: 'feature/login',
                    autoCmd: 'branch feature/login'
                },
                {
                    text: '<strong>步驟 2 / 4：切換到功能分支。</strong><br>接下來，請切換至該分支，確保接下來的提交訊息不會弄亂 main。<br><em>請輸入：<code>git checkout feature/login</code></em>',
                    hint: '切換至 feature/login 分支',
                    trigger: 'checkout',
                    arg: 'feature/login',
                    autoCmd: 'checkout feature/login'
                },
                {
                    text: '<strong>步驟 3 / 4：進行開發提交。</strong><br>在此分支進行代碼修改並完成 Conventional Commit。建議使用 feat 類型。<br><em>請輸入：<code>git commit -m "feat(auth): add google authentication"</code></em>',
                    hint: '提交 feat(auth): add google authentication',
                    trigger: 'commit',
                    arg: 'feat(auth): add google authentication',
                    autoCmd: 'commit -m "feat(auth): add google authentication"'
                },
                {
                    text: '<strong>步驟 4 / 4：合併回主要分支。</strong><br>功能在 PR 通過後，必須安全併回 main。請先切回 <code>main</code>，然後將 <code>feature/login</code> 分支進行 Merge 合併。<br><em>請輸入：<code>git checkout main</code>，接著 <code>git merge feature/login</code></em>',
                    hint: '合併 feature/login 至 main 分支',
                    trigger: 'merge',
                    arg: 'feature/login',
                    autoCmd: 'merge feature/login'
                }
            ]
        },
        'git-flow': {
            title: 'Git Flow 經典流程引導',
            steps: [
                {
                    text: '<strong>步驟 1 / 5：建立 develop 分支。</strong><br>Git Flow 的核心在於擁有主要分支 main (生產環境) 與 develop (日常整合環境)。請先建立 develop 分支。<br><em>請輸入：<code>git branch develop</code></em>',
                    hint: '建立 develop 分支',
                    trigger: 'branch',
                    arg: 'develop',
                    autoCmd: 'branch develop'
                },
                {
                    text: '<strong>步驟 2 / 5：切換至 develop 分支。</strong><br>平常開發都是基於 develop。請切換過去。<br><em>請輸入：<code>git checkout develop</code></em>',
                    hint: '切換至 develop',
                    trigger: 'checkout',
                    arg: 'develop',
                    autoCmd: 'checkout develop'
                },
                {
                    text: '<strong>步驟 3 / 5：拉出 feature 功能分支。</strong><br>當要開發某個新功能時，必須從 develop 拉出功能分支。我們拉一個 <code>feature/payment</code> 分支。<br><em>請輸入：<code>git checkout -b feature/payment</code></em>',
                    hint: '建立並切換至 feature/payment',
                    trigger: 'checkout',
                    arg: 'feature/payment',
                    autoCmd: 'checkout -b feature/payment'
                },
                {
                    text: '<strong>步驟 4 / 5：在新分支進行提交。</strong><br>在新功能分支上新增一些變更提交。<br><em>請輸入：<code>git commit -m "feat(payment): integrate Stripe API gateway"</code></em>',
                    hint: '提交付款功能代碼',
                    trigger: 'commit',
                    arg: 'feat(payment): integrate Stripe API gateway',
                    autoCmd: 'commit -m "feat(payment): integrate Stripe API gateway"'
                },
                {
                    text: '<strong>步驟 5 / 5：合併功能回 develop。</strong><br>開發完成後，請切換回 <code>develop</code>，並將 <code>feature/payment</code> 合併回來。<br><em>請輸入：<code>git checkout develop</code>，隨後 <code>git merge feature/payment</code></em>',
                    hint: '合併 feature/payment 到 develop',
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
        
        logToTerminal(`🚀 已載入教學引導：「${activeScenario.title}」，請跟著步驟嘗試！`, 'warning');
    };

    function updateGuideUI() {
        if (!activeScenario) return;
        const currentStep = activeScenario.steps[currentStepIndex];

        guideTitle.textContent = activeScenario.title;
        guideProgress.textContent = `步驟 ${currentStepIndex + 1} / ${activeScenario.steps.length}`;
        guideInstructions.innerHTML = currentStep.text;
        guideNextHint.textContent = `待完成目標：${currentStep.hint}`;
        
        guidePrevBtn.disabled = currentStepIndex === 0;
        guideNextBtn.innerHTML = '<i data-lucide="zap"></i> 自動帶入並執行命令';
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
                logToTerminal(`🎉 步驟 ${currentStepIndex + 1} 完成成功！`, 'success');
                
                if (currentStepIndex < activeScenario.steps.length - 1) {
                    currentStepIndex++;
                    updateGuideUI();
                } else {
                    logToTerminal(`🏆 恭喜！您已成功完成「${activeScenario.title}」所有步驟！大功告成！`, 'success');
                    guideInstructions.innerHTML = '<strong>🏆 恭喜完成！</strong><br>您已成功演練了這個標準工作流。您可以繼續使用上方的快捷操作自由發揮，或者開啟其他的教學挑戰。';
                    guideNextHint.textContent = '挑戰已解鎖！🎉';
                    guideNextBtn.disabled = true;
                    guideNextBtn.style.opacity = 0.5;
                }
            }
        }
    }

    /* ==========================================================================
       8. Quick Modal Control (For Branches / Switch Checkout)
       ========================================================================== */
    window.closeModal = function() {
        interactiveModal.style.display = 'none';
    };

    quickCommitBtn.addEventListener('click', () => {
        document.querySelector('.tab-btn[data-tab="commit-builder"]').click();
        commitSubject.focus();
    });

    quickBranchBtn.addEventListener('click', () => {
        modalTitle.textContent = '建立新分支 (git branch)';
        modalBodyContent.innerHTML = `
            <div class="form-row">
                <label for="modal-input-branch-name"><i data-lucide="git-fork"></i> 新分支名稱</label>
                <input type="text" id="modal-input-branch-name" placeholder="例如: feature/payment, release/v1.0..." required>
                <span class="cli-hint">為符合開源規範，建議使用 <code>feature/</code> 或 <code>bugfix/</code> 等斜線命名。</span>
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
        modalTitle.textContent = '切換分支 (git checkout)';
        
        let options = '';
        Object.keys(gitState.branches).forEach(b => {
            options += `<option value="${b}" ${b === gitState.activeBranch ? 'disabled' : ''}>${b} ${b === gitState.activeBranch ? '(目前)' : ''}</option>`;
        });

        modalBodyContent.innerHTML = `
            <div class="form-row">
                <label for="modal-select-branch"><i data-lucide="git-pull-request"></i> 選擇目標分支</label>
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
        modalTitle.textContent = `合併分支至 ${gitState.activeBranch} (git merge)`;
        
        let options = '';
        Object.keys(gitState.branches).forEach(b => {
            options += `<option value="${b}" ${b === gitState.activeBranch ? 'disabled' : ''}>${b}</option>`;
        });

        modalBodyContent.innerHTML = `
            <div class="form-row">
                <label for="modal-select-branch"><i data-lucide="git-merge"></i> 選擇來源分支合併進來</label>
                <select id="modal-select-branch">
                    ${options}
                </select>
                <span class="cli-hint">這會將所選分支的所有程式碼變更合併至目前分支 <code>${gitState.activeBranch}</code> 中。</span>
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
        modalTitle.textContent = `將 ${gitState.activeBranch} Rebase 至基底分支 (git rebase)`;
        
        let options = '';
        Object.keys(gitState.branches).forEach(b => {
            options += `<option value="${b}" ${b === gitState.activeBranch ? 'disabled' : ''}>${b}</option>`;
        });

        modalBodyContent.innerHTML = `
            <div class="form-row">
                <label for="modal-select-branch"><i data-lucide="refresh-cw"></i> 選擇目標基底分支 (Base)</label>
                <select id="modal-select-branch">
                    ${options}
                </select>
                <span class="cli-hint">警告：Rebase 會重寫當前分支的提交歷史 (Rewrite History)，適合整理本地未 push 的 commits。</span>
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
        if (confirm('確定要清空所有模擬數據，重回初始 main 分支狀態嗎？')) {
            initGitSimulator();
            logToTerminal('Git 模擬器重設成功！', 'success');
        }
    });

    /* ==========================================================================
       9. Startup Initialization
       ========================================================================== */
    initGitSimulator();
    updateCommitPreview();
});
