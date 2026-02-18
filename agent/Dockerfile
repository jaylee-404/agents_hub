# 使用官方预装好浏览器的基础镜像（注意版本号要和你的 Playwright 匹配）
FROM mcr.microsoft.com/playwright/python:v1.49.0-noble
FROM python:3.12-slim

# 1. 安装 uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# 设置环境变量，确保 uv 创建的虚拟环境在容器内易于访问
ENV UV_PROJECT_ENVIRONMENT=/app/.venv
ENV PATH="/app/.venv/bin:$PATH"

WORKDIR /app

# 2. 【关键】仅拷贝依赖配置文件
# 如果你有 uv.lock 文件，也请一并加上；如果没有，uv.lock* 会自动忽略
COPY pyproject.toml uv.lock* ./

# 3. 【关键】安装 Python 依赖（但不安装项目本身）
# --no-install-project 告诉 uv 还没到拷贝代码的时候
RUN uv sync --no-install-project

# 4. 【核心优化】安装 Playwright 浏览器及其系统依赖
# 这一层被排在了“拷贝代码”之前。
# 意味着：只要你不改 pyproject.toml，这一层在构建时永远是 "CACHED"，不会重新下载！
RUN uv run playwright install --with-deps chromium

# 5. 现在才拷贝你的业务代码
# 以后你修改 app/main.py，构建只会从这一行开始，跳过上面的浏览器下载
COPY . .

# 6. 最后进行一次同步，确保项目代码被正确安装
RUN uv sync

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]