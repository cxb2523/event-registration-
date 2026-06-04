# 活动报名系统

基于 Nuxt.js + Express + MongoDB + Nodemailer 构建的完整活动报名系统。

## 功能特性

- 📋 活动详情展示页面
- ✍️ 在线报名表单（姓名、邮箱、手机号）
- 📊 实时报名人数统计和进度条显示
- 🚫 报名达到上限自动关闭报名通道
- 📧 自动发送报名确认邮件
- 🔒 邮箱唯一性验证
- 📱 响应式设计，支持移动端

## 技术栈

- **前端**: Nuxt.js 2.x, Vue.js
- **后端**: Express.js
- **数据库**: MongoDB + Mongoose
- **邮件服务**: Nodemailer
- **HTTP客户端**: Axios

## 项目结构

```
.
├── pages/
│   └── index.vue              # 活动报名主页
├── assets/
│   └── css/
│       └── main.css           # 全局样式
├── server/
│   ├── config/
│   │   └── database.js        # 数据库连接配置
│   ├── models/
│   │   ├── Registration.js    # 报名数据模型
│   │   └── Event.js           # 活动数据模型
│   ├── routes/
│   │   └── registrations.js   # 报名路由
│   ├── controllers/
│   │   └── registrationController.js  # 报名控制器
│   ├── services/
│   │   └── emailService.js    # 邮件服务
│   └── index.js               # 服务器入口
├── package.json
├── nuxt.config.js
└── .env                       # 环境变量配置
```

## 安装和运行

### 前置要求

- Node.js >= 14.x
- MongoDB >= 4.x
- SMTP邮件服务器（用于发送确认邮件）

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

编辑 `.env` 文件，配置以下信息：

```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/event-registration
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-password
SMTP_FROM=noreply@example.com
```

### 3. 启动 MongoDB

确保 MongoDB 服务正在运行：

```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
# 或
mongod
```

### 4. 启动后端服务器

```bash
npm run server
# 或开发模式（自动重启）
npm run dev:server
```

后端服务器将在 `http://localhost:3001` 启动

### 5. 启动前端 Nuxt.js 服务

```bash
npm run dev
```

前端服务将在 `http://localhost:3000` 启动

## API 接口

### 报名相关

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /api/registrations/count | 获取当前报名人数 |
| POST | /api/registrations | 创建报名 |
| GET | /api/registrations | 获取所有报名列表 |
| GET | /api/registrations/:id | 获取单个报名详情 |
| DELETE | /api/registrations/:id | 删除报名记录 |

### 系统接口

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /api/health | 健康检查 |

### 报名请求示例

```bash
curl -X POST http://localhost:3001/api/registrations \
  -H "Content-Type: application/json" \
  -d '{
    "name": "张三",
    "email": "zhangsan@example.com",
    "phone": "13800138000"
  }'
```

## 配置说明

### 修改活动信息

编辑 `pages/index.vue` 中的 `event` 对象：

```javascript
event: {
  title: '您的活动标题',
  tagline: '活动副标题',
  date: '2024年6月15日',
  location: '活动地点',
  time: '09:00 - 18:00',
  description: '活动详细描述...',
  maxParticipants: 100  // 报名人数上限
}
```

### 修改报名人数上限

编辑 `server/controllers/registrationController.js`：

```javascript
const MAX_PARTICIPANTS = 100  // 修改为您需要的人数
```

### SMTP 配置示例

#### Gmail (不推荐，需要开启低安全性应用访问)
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

#### QQ邮箱
```
SMTP_HOST=smtp.qq.com
SMTP_PORT=587
SMTP_USER=your-email@qq.com
SMTP_PASS=your-authorization-code
```

#### 企业邮箱/其他服务商
请参考您的邮件服务商文档进行配置。

## 生产环境部署

### 1. 构建前端

```bash
npm run build
```

### 2. 启动生产环境

```bash
# 启动后端
npm run server

# 启动前端
npm start
```

### 使用 PM2 (推荐)

```bash
# 安装 PM2
npm install -g pm2

# 启动后端
pm2 start server/index.js --name event-backend

# 启动前端
pm2 start npm --name event-frontend -- start

# 查看状态
pm2 status
```

## 注意事项

1. **邮件发送**: 首次部署时请确保 SMTP 配置正确，可查看服务器控制台的邮件连接状态
2. **数据备份**: 生产环境请定期备份 MongoDB 数据
3. **安全性**: 
   - 生产环境请更改默认端口
   - 建议添加 API 访问频率限制
   - 考虑添加 reCAPTCHA 防止恶意报名
4. **错误处理**: 邮件发送失败不会影响报名成功，系统会记录 `emailSent: false`

## 故障排查

### 问题: 无法连接 MongoDB
- 确认 MongoDB 服务是否正常运行
- 检查 `.env` 中的 `MONGODB_URI` 配置是否正确

### 问题: 邮件发送失败
- 检查 SMTP 配置是否正确
- 确认邮箱账号是否开启 SMTP 服务
- 检查是否有防火墙拦截 SMTP 端口
- 部分邮箱需要使用应用专用密码而非登录密码

### 问题: 前端无法连接后端 API
- 确认后端服务是否正常运行（访问 http://localhost:3001/api/health）
- 检查 `nuxt.config.js` 中的 axios baseURL 配置
- 检查浏览器控制台是否有 CORS 错误

## 许可证

MIT
