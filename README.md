# FastAPI + React Todo List

一个现代化的、轻量级的待办事项管理系统，采用前后端分离架构，基于 FastAPI 和 React 构建。

## 🌐 在线访问

- **前端应用**: [http://43.140.194.195:8080](http://43.140.194.195:8080)
- **后端 API 文档**: [http://43.140.194.195:8000/docs](http://43.140.194.195:8000/docs)

> 💡 提示：可以直接访问前端应用体验完整功能，或查看后端 API 文档了解接口详情。

## ✨ 核心特性

- **用户系统**：安全的用户注册与登录（JWT 认证，bcrypt 密码加密）。
- **任务管理**：创建、删除、标记完成/未完成。
- **拖拽排序**：直观的拖拽操作来调整任务顺序。
- **多维属性**：支持任务优先级（高/中/低）、自定义分类标签、截止日期。
- **智能视图**：支持按状态（进行中/已完成）、时间（今天/本周）筛选任务。
- **数据持久化**：使用 MySQL 数据库存储数据，SQLAlchemy ORM 管理。
- **现代化 UI**：简洁美观的卡片式设计，响应式布局。

## 🛠️ 技术栈

### 后端 (Backend)
- **框架**: FastAPI (Python)
- **数据库**: MySQL + SQLAlchemy (ORM)
- **认证**: PyJWT (Token based auth) + Passlib (bcrypt)
- **校验**: Pydantic

### 前端 (Frontend)
- **框架**: React + Vite
- **路由**: React Router
- **状态管理**: Context API
- **HTTP 客户端**: Axios
- **拖拽库**: @hello-pangea/dnd

## 🚀 快速开始

### 环境要求
- Python 3.8+
- Node.js 16+
- MySQL 5.7+

### 1. 后端设置

```bash
cd backend

# 1. 创建虚拟环境 (可选但推荐)
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# 2. 安装依赖
pip install -r requirements.txt

# 3. 配置数据库
# 确保你安装了 MySQL 并创建了名为 todo_db 的数据库
# 修改 app/database.py 中的数据库连接字符串（如果你的密码不是 123456）
# SQLALCHEMY_DATABASE_URL = "mysql+pymysql://root:你的密码@localhost/todo_db"

# 4. 启动服务
uvicorn app.main:app --reload
```
后端服务将运行在 `http://localhost:8000`

### 2. 前端设置

```bash
cd frontend

# 1. 安装依赖
npm install

# 2. 启动开发服务器
npm run dev
```
前端页面将运行在 `http://localhost:5173`

## 📝 更新日志 (Changelog)

### v1.0.0 (2025-12-06)
- **Initial Release**: 项目初始化。
- 实现基础的 CRUD 功能。
- 集成 MySQL 数据库。
- 完成用户注册登录流程。
- 界面全面汉化。
- 新增功能：
    - 任务优先级 (Low/Medium/High)。
    - 任务分类标签。
    - 截止日期选择与显示。
    - 拖拽排序功能。
    - "清理已完成" 快捷按钮。
    - "今天" 和 "本周" 视图过滤器。
- UI 升级：卡片式设计，优化视觉体验。

## 🔮 未来计划 (Roadmap)

- [ ] 黑暗模式 (Dark Mode)
- [ ] 数据统计看板 (完成率、趋势图)
- [ ] 任务搜索功能
- [ ] 导出数据 (CSV/JSON)
