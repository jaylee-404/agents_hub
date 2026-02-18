from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="Agents Hub Engine")

class XhsTask(BaseModel):
    title: str
    content: str
    images: list[str]

@app.post("/publish")
async def publish(task: XhsTask):
    # 这里接入之前的 Playwright 逻辑
    return {"status": "success", "msg": f"Task {task.title} received"}