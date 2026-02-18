// ==================== ====================
// Team Todo App - Main Logic
// Version: 1.0
// ==================== ====================

// ==================== State Management ====================
const AppState = {
    users: [],
    tasks: [],
    goals: [],
    currentUser: null,
    currentTab: 'dashboard',
    searchFilter: '',
    statsPeriod: 'monthly'
};

// ==================== Initialization ====================
document.addEventListener('DOMContentLoaded', () => {
    // 加载数据
    loadData();
    // 初始化当前用户
    initializeCurrentUser();
    // 初始化 UI
    initUI();
    // 自动保存定时器
    setInterval(autoSave, 30000);
});

// ==================== Data Management ====================
function loadData() {
    const users = localStorage.getItem('todo-users');
    const tasks = localStorage.getItem('todo-tasks');
    const goals = localStorage.getItem('todo-goals');

    if (users) AppState.users = JSON.parse(users);
    if (tasks) AppState.tasks = JSON.parse(tasks);
    if (goals) AppState.goals = JSON.parse(goals);

    // 如果没有用户，添加默认用户
    if (AppState.users.length === 0) {
        const defaultUser = {
            id: 'user_' + Date.now(),
            name: '我的用户',
            avatar: `https://i.pravatar.cc/150?u=${Date.now()}`
        };
        AppState.users.push(defaultUser);
        AppState.currentUser = defaultUser.id;
    } else if (!AppState.currentUser) {
        AppState.currentUser = AppState.users[0].id;
    }

    // 渲染用户列表
    renderUserList();
    updateCurrentUserInfo();
}

function saveData() {
    localStorage.setItem('todo-users', JSON.stringify(AppState.users));
    localStorage.setItem('todo-tasks', JSON.stringify(AppState.tasks));
    localStorage.setItem('todo-goals', JSON.stringify(AppState.goals));
    autoSave = saveData; // 更新自动保存函数
}

function autoSave() {
    localStorage.setItem('todo-users', JSON.stringify(AppState.users));
    localStorage.setItem('todo-tasks', JSON.stringify(AppState.tasks));
    localStorage.setItem('todo-goals', JSON.stringify(AppState.goals));
    showToast('数据已自动保存', 'success');
}

function initializeCurrentUser() {
    if (!localStorage.getItem('todo-current-user')) {
        localStorage.setItem('todo-current-user', AppState.currentUser);
    } else {
        AppState.currentUser = localStorage.getItem('todo-current-user');
    }

    updateCurrentUserInfo();
}

// ==================== UI Initialization ====================
function initUI() {
    // 导航切换
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.dataset.tab;
            switchTab(tabId);
        });
    });

    // 用户切换模态框
    document.getElementById('userSwitch').addEventListener('click', () => {
        showUserModal();
    });

    document.getElementById('addUserModalBtn').addEventListener('click', addUserModal);
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.target.closest('.modal').classList.remove('show');
        });
    });

    // 搜索模态框
    document.getElementById('searchToggle').addEventListener('click', () => {
        document.getElementById('searchModal').classList.add('show');
        document.getElementById('searchInput').focus();
    });

    document.getElementById('searchModal').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
            e.currentTarget.classList.remove('show');
        }
    });

    // 任务管理
    document.getElementById('addTaskBtn').addEventListener('click', () => {
        document.getElementById('taskForm').style.display = 'block';
        document.getElementById('taskInput').focus();
    });

    document.getElementById('saveTaskBtn').addEventListener('click', saveTask);
    document.getElementById('taskInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            saveTask();
        }
    });

    // 筛选器
    document.getElementById('filterSelect').addEventListener('change', renderTasks);
    document.getElementById('teamFilter').addEventListener('change', renderTasks);

    // 时间选择器
    document.querySelectorAll('.time-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            AppState.statsPeriod = btn.dataset.period;
            renderStats();
        });
    });

    // 更新当前日期
    const now = new Date();
    document.getElementById('currentDate').textContent = now.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // 初始渲染
    renderTasks();
    renderStats();
    updateTeamFilter();
    renderGoals();
}

// ==================== User Management ====================
function renderUserList() {
    const container = document.getElementById('userList');
    container.innerHTML = AppState.users.map(user => `
        <div class="user-item">
            <div class="user-item-content">
                <img src="${user.avatar}" class="task-avatar" alt="${user.name}">
                <span class="user-name">${user.name}</span>
                ${user.id === AppState.currentUser ? '<span class="current-user-badge">当前</span>' : ''}
            </div>
            <div class="user-actions">
                ${user.id !== AppState.currentUser ? `
                    <button class="btn btn-small btn-primary" data-user-id="${user.id}">切换</button>
                    <button class="btn btn-small btn-delete" data-user-id="${user.id}">删除</button>
                ` : '<span class="current-user-badge active">已选择</span>'}
            </div>
        </div>
    `).join('');

    // 绑定事件
    container.querySelectorAll('.user-actions button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const userId = btn.dataset.userId;
            if (btn.classList.contains('btn-delete')) {
                if (confirm('确定要删除此用户吗？所有任务将被保留。')) {
                    deleteUser(userId);
                }
            } else {
                switchUser(userId);
            }
        });
    });
}

function showUserModal() {
    renderUserList();
    document.getElementById('userModal').classList.add('show');
}

function addUserModal() {
    const username = prompt('请输入用户名：', '新用户');
    if (!username || !username.trim()) {
        showToast('用户名不能为空', 'error');
        return;
    }

    const user = {
        id: 'user_' + Date.now(),
        name: username.trim(),
        avatar: `https://i.pravatar.cc/150?u=${Date.now()}`
    };

    AppState.users.push(user);
    saveData();
    renderUserList();
    showToast('用户添加成功', 'success');
}

function deleteUser(userId) {
    AppState.users = AppState.users.filter(u => u.id !== userId);
    if (AppState.currentUser === userId) {
        AppState.currentUser = AppState.users[0].id;
    }
    saveData();
    renderUserList();
    updateCurrentUserInfo();
    updateTeamFilter();
    showToast('用户删除成功', 'success');
}

function switchUser(userId) {
    AppState.currentUser = userId;
    localStorage.setItem('todo-current-user', userId);
    saveData();
    renderUserList();
    updateCurrentUserInfo();
    renderTasks();
    renderStats();
    renderGoals();
    showToast('已切换用户', 'success');
}

function updateCurrentUserInfo() {
    const user = AppState.users.find(u => u.id === AppState.currentUser);
    if (user) {
        document.getElementById('currentUserInfo').innerHTML = `
            <img src="${user.avatar}" class="current-user-avatar" alt="${user.name}">
            <span class="current-user-name">${user.name}</span>
        `;
    }
}

function updateTeamFilter() {
    const select = document.getElementById('teamFilter');
    const currentValue = select.value;
    select.innerHTML = '<option value="all">全部成员</option>' +
        AppState.users.map(u => `<option value="${u.id}">${u.name}</option>`).join('');

    // 重新选择
    select.value = currentValue;
}

// ==================== Task Management ====================
function saveTask() {
    const input = document.getElementById('taskInput');
    const text = input.value.trim();
    const priority = document.getElementById('taskPriority').value;
    const category = document.getElementById('taskCategory').value;

    if (!text) {
        showToast('请输入任务内容', 'error');
        return;
    }

    const task = {
        id: 'task_' + Date.now(),
        text: text,
        completed: false,
        priority: priority,
        category: category,
        assignee: AppState.currentUser,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    AppState.tasks.unshift(task);
    saveData();
    renderTasks();
    renderStats();

    // 重置表单
    input.value = '';
    showToast('任务添加成功', 'success');
}

function toggleTask(taskId) {
    const task = AppState.tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        task.updatedAt = new Date().toISOString();
        saveData();
        renderTasks();
        renderStats();
        showToast(task.completed ? '任务已完成 🎉' : '任务已恢复', 'success');
    }
}

function editTask(taskId) {
    const task = AppState.tasks.find(t => t.id === taskId);
    if (!task) return;

    const newText = prompt('编辑任务内容：', task.text);
    if (!newText || !newText.trim()) {
        showToast('任务内容不能为空', 'error');
        return;
    }

    task.text = newText.trim();
    task.updatedAt = new Date().toISOString();
    saveData();
    renderTasks();
    showToast('任务已更新', 'success');
}

function deleteTask(taskId) {
    if (confirm('确定要删除此任务吗？')) {
        AppState.tasks = AppState.tasks.filter(t => t.id !== taskId);
        saveData();
        renderTasks();
        renderStats();
        showToast('任务已删除', 'success');
    }
}

function renderTasks() {
    const filter = document.getElementById('filterSelect').value;
    const teamFilter = document.getElementById('teamFilter').value;
    const container = document.getElementById('taskList');
    const emptyState = document.getElementById('emptyState');

    let filteredTasks = AppState.tasks.filter(task => {
        if (filter === 'all') return true;
        if (filter === 'completed') return task.completed;
        if (filter === 'pending') return !task.completed;
        return task.priority === filter;
    });

    if (teamFilter !== 'all') {
        filteredTasks = filteredTasks.filter(task => task.assignee === teamFilter);
    }

    if (filteredTasks.length === 0) {
        container.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';
    container.innerHTML = filteredTasks.map(task => {
        const assignee = AppState.users.find(u => u.id === task.assignee);
        const avatarUrl = assignee ? assignee.avatar : `https://i.pravatar.cc/150?u=${task.assignee}`;

        return `
            <div class="task-card ${task.completed ? 'completed' : ''}">
                <div class="task-checkbox ${task.completed ? 'checked' : ''}" data-task-id="${task.id}">
                    ${task.completed ? '✓' : ''}
                </div>
                <div class="task-content">
                    <div class="task-text">${escapeHtml(task.text)}</div>
                    <div class="task-meta">
                        <div class="task-meta-item">
                            <span class="task-avatar">👥</span>
                            <span>${assignee ? assignee.name : '未分配'}</span>
                        </div>
                        ${task.category ? `
                            <div class="task-meta-item">
                                <span>📁</span>
                                <span>${task.category}</span>
                            </div>
                        ` : ''}
                        ${task.category !== '健康' ? `
                            <div class="task-meta-item">
                                <span>⏰</span>
                                <span>${new Date(task.createdAt).toLocaleDateString('zh-CN')}</span>
                            </div>
                        ` : ''}
                    </div>
                </div>
                <div class="task-actions">
                    <button class="btn-edit" data-task-id="${task.id}">编辑</button>
                    <button class="btn-delete" data-task-id="${task.id}">删除</button>
                </div>
            </div>
        `;
    }).join('');

    // 绑定任务事件
    container.querySelectorAll('.task-checkbox').forEach(checkbox => {
        checkbox.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleTask(checkbox.dataset.taskId);
        });
    });

    container.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            editTask(btn.dataset.taskId);
        });
    });

    container.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteTask(btn.dataset.taskId);
        });
    });
}

// ==================== Statistics ====================
function renderStats() {
    const now = new Date();
    let startDate;
    let endDate = now.toISOString();

    if (AppState.statsPeriod === 'monthly') {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    } else {
        startDate = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1).toISOString();
    }

    const periodTasks = AppState.tasks.filter(task => {
        return task.createdAt >= startDate && task.createdAt <= endDate;
    });

    const completedTasks = periodTasks.filter(task => task.completed);
    const completionRate = periodTasks.length > 0 ? Math.round((completedTasks.length / periodTasks.length) * 100) : 0;

    // 渲染统计概览
    document.getElementById('completionRate').textContent = `${completionRate}%`;

    // 渲染任务类型分布
    const categoryData = {};
    periodTasks.forEach(task => {
        const category = task.category || '未分类';
        categoryData[category] = (categoryData[category] || 0) + 1;
    });

    const categoryChart = echarts.init(document.getElementById('categoryChart'));
    categoryChart.setOption({
        tooltip: { trigger: 'axis' },
        series: [{
            type: 'pie',
            radius: ['40%', '70%'],
            data: Object.keys(categoryData).map(key => ({
                value: categoryData[key],
                name: key
            }))
        }]
    });

    // 渲染优先级分布
    const priorityData = { 高: 0, 中: 0, 低: 0 };
    periodTasks.forEach(task => {
        if (task.priority === 'high') priorityData['高']++;
        else if (task.priority === 'medium') priorityData['中']++;
        else priorityData['低']++;
    });

    const priorityChart = echarts.init(document.getElementById('priorityChart'));
    priorityChart.setOption({
        tooltip: { trigger: 'axis' },
        xAxis: {
            type: 'category',
            data: ['高', '中', '低']
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            data: [priorityData['高'], priorityData['中'], priorityData['低']],
            type: 'bar',
            barWidth: '50%',
            itemStyle: {
                color: function(params) {
                    return params.value > 0 ? '#007AFF' : '#E5E5EA';
                }
            }
        }]
    });

    // 处理完成率图表
    const completionChart = echarts.init(document.getElementById('completionChart'));
    const completionTrend = [];
    const currentMonth = now.getMonth();
    const year = now.getFullYear();

    for (let i = 6; i >= 0; i--) {
        const d = new Date(year, currentMonth - i, 1);
        const trendStart = d.toISOString();
        d.setMonth(d.getMonth() + 1);
        const trendEnd = d.toISOString();

        const trendTasks = AppState.tasks.filter(task =>
            task.createdAt >= trendStart && task.createdAt <= trendEnd
        );
        const trendCompleted = trendTasks.filter(task => task.completed);
        const rate = trendTasks.length > 0 ? Math.round((trendCompleted.length / trendTasks.length) * 100) : 0;
        completionTrend.push(rate);
    }

    completionChart.setOption({
        tooltip: { trigger: 'axis' },
        grid: { top: 20, right: 20, bottom: 20, left: 40 },
        xAxis: {
            type: 'category',
            data: ['6周前', '5周前', '4周前', '3周前', '2周前', '上周', '本周']
        },
        yAxis: {
            type: 'value',
            min: 0,
            max: 100,
            axisLabel: { formatter: '{value}%' }
        },
        series: [{
            data: completionTrend,
            type: 'line',
            smooth: true,
            areaStyle: {
                color: {
                    type: 'linear',
                    x: 0, y: 0, x2: 0, y2: 1,
                    colorStops: [
                        { offset: 0, color: 'rgba(0, 122, 255, 0.3)' },
                        { offset: 1, color: 'rgba(0, 122, 255, 0.05)' }
                    ]
                }
            },
            itemStyle: { color: '#007AFF' },
            lineStyle: { width: 3 }
        }]
    });

    window.addEventListener('resize', () => {
        categoryChart.resize();
        priorityChart.resize();
        completionChart.resize();
    });
}

// ==================== Goal Management ====================
function renderGoals() {
    const container = document.getElementById('goalsList');
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlyGoals = AppState.goals.filter(goal => {
        const goalMonth = new Date(goal.createdAt).getMonth();
        const goalYear = new Date(goal.createdAt).getFullYear();
        return goalMonth === currentMonth && goalYear === currentYear;
    });

    if (monthlyGoals.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🎯</div>
                <p>本月暂无目标，快去创建一个吧！</p>
                <button class="btn btn-primary" style="margin-top: 16px;" id="createGoalBtn">
                    创建月度目标
                </button>
            </div>
        `;
        return;
    }

    container.innerHTML = monthlyGoals.map(goal => {
        const assignedUser = AppState.users.find(u => u.id === goal.assignee);
        const totalProgress = goal.completedTasks / goal.totalTasks;
        const percentage = Math.round(totalProgress * 100);

        return `
            <div class="goal-card">
                <div class="goal-card-header">
                    <h3>${escapeHtml(goal.title)}</h3>
                </div>
                <div class="goal-progress">
                    <div class="goal-progress-bar" style="width: ${percentage}%"></div>
                </div>
                <div class="goal-stats-footer">
                    <div class="goal-stats-info">
                        已完成 <span class="goal-stat-value">${goal.completedTasks}</span> / ${goal.totalTasks}
                        <span style="margin-left: 12px; color: var(--text-secondary);">
                            负责人：${assignedUser ? assignedUser.name : '未分配'}
                        </span>
                    </div>
                    <div class="goal-stats-target">${percentage}%</div>
                </div>
            </div>
        `;
    }).join('');

    // 总目标统计
    const totalGoals = monthlyGoals.length;
    const completedGoals = monthlyGoals.filter(g => g.completed).length;
    const totalPercentage = Math.round((completedGoals / totalGoals) * 100);

    const statsContainer = document.getElementById('goalsStats');
    statsContainer.innerHTML = `
        <div class="goal-stat-card">
            <div class="goal-stat-label">本月目标总数</div>
            <div class="goal-stat-value">${totalGoals}</div>
        </div>
        <div class="goal-stat-card">
            <div class="goal-stat-label">已完成目标</div>
            <div class="goal-stat-value">${completedGoals}</div>
        </div>
        <div class="goal-stat-card">
            <div class="goal-stat-label">目标完成率</div>
            <div class="goal-stat-value">${totalPercentage}%</div>
        </div>
    `;
}

// ==================== Tab Navigation ====================
function switchTab(tabId) {
    AppState.currentTab = tabId;

    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.tab === tabId) {
            tab.classList.add('active');
        }
    });

    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
        if (section.id === tabId + 'Section') {
            section.classList.add('active');
        }
    });

    if (tabId === 'dashboard') {
        renderStats();
    } else if (tabId === 'tasks') {
        renderTasks();
    } else if (tabId === 'goals') {
        renderGoals();
    }

    // 关闭所有模态框
    document.querySelectorAll('.modal').forEach(modal => modal.classList.remove('show'));
}

// ==================== Utility Functions ====================
function escapeHtml(text) {
    if (typeof text !== 'string') return text;
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}