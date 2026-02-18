# agent/app/main.py
from fastapi import FastAPI, BackgroundTasks, HTTPException
from pydantic import BaseModel
import httpx
import asyncio
import os

app = FastAPI(title="Agents Hub - Agent Service")


# 1. 定义请求体格式
class TaskRequest(BaseModel):
    task_id: int
    stream_token: str
    payload: dict


# 2. 模拟 AI 执行逻辑
async def run_agent_process(task_id: int, stream_token: str, payload: dict):
    print(f"🚀 开始处理任务 {task_id}...")

    # 模拟 AI 耗时操作 (比如调用 LLM)
    await asyncio.sleep(5)

    ai_result = {
        "status": "success",
        "content": f"AI 已根据标题 '{payload.get('title')}' 生成了小红书文案：今天天气真不错！",
        "tokens_used": 150
    }

    # 3. 执行完毕，打电话回 Rails 汇报
    # 注意：在 Docker 网络中，FastAPI 找 Rails 要用 http://backend:3000
    callback_url = "http://backend:3000/api/v1/internal/callback"

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                callback_url,
                json={
                    "task_id": task_id,
                    "status": "success",
                    "result": ai_result
                }
            )
            if response.status_code == 200:
                print(f"✅ 任务 {task_id} 结果已同步至 Rails")
            else:
                print(f"❌ 回调 Rails 失败: {response.status_code}")
        except Exception as e:
            print(f"❌ 回调连接异常: {e}")


# 4. 核心入口：接收 Rails 的派单
@app.post("/agent/run")
async def receive_task(request: TaskRequest, background_tasks: BackgroundTasks):
    print(f"📥 收到来自 Rails 的任务派发: {request.task_id}")

    # 使用 FastAPI 的 BackgroundTasks 立即返回响应，不阻塞 Sidekiq
    # 这样 Sidekiq 就能立刻完成它的工作，真正的 AI 逻辑在后台跑
    background_tasks.add_task(
        run_agent_process,
        request.task_id,
        request.stream_token,
        request.payload
    )

    return {"message": "Task received and started in background", "task_id": request.task_id}


@app.get("/health")
async def health_check():
    return {"status": "ok"}