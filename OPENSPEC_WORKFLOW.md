# OpenSpec + Cursor 工作流指南

> 快速上手：将 OpenSpec 集成到 Cursor 中，实现规格驱动开发。

## 🎯 核心理念

**OpenSpec** 提供规格（Spec）和任务清单（Features）让 AI 明确要做什么；
**Cursor** 负责高质量的代码编写。

---

## 📋 工作流流程图

```
需求描述
  ↓
[Cursor: 使用 OpenSpec 创建 Spec]
  ↓
生成 spec.md（功能需求、技术要求、验收标准）
  ↓
生成 features.json（可验证的任务清单）
  ↓
[Cursor: 根据 Spec 编写代码]
  ↓
根据 features.json 执行任务（按顺序）
  ↓
[验收测试]
  ↓
任务标记完成 ✅
```

---

## 🔧 本地环境配置

### 1. 安装 OpenSpec

```bash
pip install openspec
```

### 2. 初始化项目（可选）

```bash
mkdir my-project
cd my-project
openspec init
```

初始化后生成：
```
my-project/
├── openspec/
│   ├── openspec.json    # 项目配置
│   └── proposals/       # 需求提案
```

### 3. Cursor 配置

打开 Cursor 设置（`Cursor: Settings`），在 `Claude` 提示词中添加：

```markdown
# OpenSpec 集成规则

1. 在开始编码前，先为任务创建 OpenSpec 规格
2. 按照 Spec 中的技术要求和验收标准
3. 根据 features.json 中的 feature ID 逐步实现
4. 完成每个 feature 后，标记为 true 并提交

# 使用示例

任务：添加用户注册功能
步骤：
1. 创建 spec.md 包含需求、技术要求、验收标准
2. 创建 features.json 定义任务清单
3. 实现 create-user 特性
4. 测试并验证
```

---

## 💡 使用方式

### 方式一：手动打开 Spec

**Step 1：在 Cursor 中打开 Spec 文件**
```
my-project/openspec/proposals/my-feature/spec.md
```

**Step 2：参考 Spec 编写代码**
```markdown
# 在 Cursor 中创建
File: index.html
File: styles.css
File: app.js

# 代码应该遵循 Spec 中的：
- 技术要求
- 验收标准
- 实施步骤
```

### 方式二：让 Cursor 自动创建

**Step 1：在 Cursor 中输入**
```
请根据 [文件路径] 的 Spec 创建一个 Todo List 应用
```

**Step 2：Cursor 会自动**
- 读取 Spec
- 分析技术要求
- 按 features 顺序编写代码

---

## 🚀 实战演练

### 示例：任务添加功能

#### 输入给 Cursor：
```
请根据 openspec/proposals/add-todo-app/spec.md 创建一个完整的 Todo List 应用
```

#### Cursor 会执行：

**1. 创建 index.html**
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Todo List</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>Todo List</h1>
        <div class="input-group">
            <input type="text" id="todoInput" placeholder="Add a new task...">
            <button id="addBtn">Add</button>
        </div>
        <ul id="todoList"></ul>
    </div>
    <script src="app.js"></script>
</body>
</html>
```

**2. 创建 styles.css**
```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.container {
    max-width: 500px;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
}

.input-group {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}

input {
    flex: 1;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

button {
    padding: 10px 20px;
    background: #007acc;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.todo-item {
    display: flex;
    align-items: center;
    padding: 10px;
    background: #f5f5f5;
    margin-bottom: 5px;
    border-radius: 4px;
}

.completed {
    text-decoration: line-through;
    color: #999;
}
```

**3. 创建 app.js**
```javascript
class TodoApp {
    constructor() {
        this.todos = JSON.parse(localStorage.getItem('todos')) || [];
        this.initElements();
        this.bindEvents();
        this.render();
    }

    initElements() {
        this.todoInput = document.getElementById('todoInput');
        this.addBtn = document.getElementById('addBtn');
        this.todoList = document.getElementById('todoList');
    }

    bindEvents() {
        this.addBtn.addEventListener('click', () => this.addTodo());
        this.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTodo();
        });
    }

    addTodo() {
        const text = this.todoInput.value.trim();
        if (!text) return;

        const todo = {
            id: Date.now(),
            text,
            completed: false
        };

        this.todos.push(todo);
        this.save();
        this.render();
        this.todoInput.value = '';
    }

    toggleTodo(id) {
        this.todos = this.todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        this.save();
        this.render();
    }

    deleteCompleted() {
        this.todos = this.todos.filter(todo => !todo.completed);
        this.save();
        this.render();
    }

    save() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    render() {
        this.todoList.innerHTML = this.todos.map(todo => `
            <li class="todo-item ${todo.completed ? 'completed' : ''}">
                <span>${todo.text}</span>
                <div class="actions">
                    <input type="checkbox" ${todo.completed ? 'checked' : ''}>
                    <button class="delete-btn">删除</button>
                </div>
            </li>
        `).join('');

        // 绑定事件
        this.todoList.addEventListener('change', (e) => {
            if (e.target.type === 'checkbox') {
                this.toggleTodo(Number(e.target.closest('.todo-item').dataset.id));
            }
        });

        this.todoList.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-btn')) {
                const li = e.target.closest('.todo-item');
                this.todos = this.todos.filter(todo => todo.id !== Number(li.dataset.id));
                this.save();
                this.render();
            }
        });
    }
}

const app = new TodoApp();
```

---

## ✅ 验收流程

根据 Spec 中的验收标准逐一验证：

1. ✅ 任务添加功能正常工作
2. ✅ 任务切换完成状态后视觉变化
3. ✅ 删除任务功能正常
4. ✅ 刷新页面后任务数据不丢失
5. ✅ UI 美观、简洁、响应式

---

## 📝 常用命令

```bash
# 查看已安装的 OpenSpec 版本
openspec --version

# 查看提案列表
openspec list

# 删除提案
openspec delete <proposal-id>

# 添加一个新的提案
openspec add
```

---

## 💭 最佳实践

### ✅ 好的做法

```markdown
1. Spec 要详细，包含技术要求和验收标准
2. Features 要具体，ID 和描述清晰
3. 每完成一个 feature 就提交代码
4. 测试通过后再标记 feature 完成
```

### ❌ 不好的做法

```markdown
1. Spec 太模糊，不知道要做什么
2. 让 AI 直接写代码，没有 Spec
3. 只提交最终结果，没有过程
```

---

## 🎓 学习资源

根据你的笔记相关链接：

- [OpenSpec GitHub](https://github.com/Fission-AI/OpenSpec)
- [OpenSpec 官网](https://openspec.dev/)

---

## 🚦 快速开始

1. **打开测试项目**：`cd ~/openspec-test-project`
2. **查看 Spec**：`openspec/proposals/add-todo-app/spec.md`
3. **让 Cursor 创建代码**：
   ```
   请根据 openspec/proposals/add-todo-app/spec.md 创建 Todo List 应用
   ```
4. **运行并测试**：使用浏览器打开 `index.html`

---

## 🏆 总结

OpenSpec + Cursor 工作流的核心是：

> **用 Spec 明确要做什么，用 Cursor 高质量地完成**

- ✅ Spec 明确需求、技术要求、验收标准
- ✅ Features 提供**可验证**的任务清单
- ✅ Cursor 遵循 Spec 编写符合要求的代码
- ✅ 完成任务后更新 features.json 并标记完成

这种工作流确保 AI 不再"自由发挥"，而是按照明确的规格产出正确、可验收的代码。