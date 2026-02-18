FROM node:24-alpine

WORKDIR /app

# 1. 先复制 package.json 和 package-lock.json
COPY package*.json ./

# 2. 安装依赖
RUN npm install

# 3. 复制源代码
COPY . .

EXPOSE 5173

# 4. 启动命令
CMD ["npm", "run", "dev", "--", "--host"]
