from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from pydantic import BaseModel
from bson import ObjectId

app=FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_headers=["*"],
    allow_methods=["*"],
)
client = MongoClient("mongodb://localhost:27017")
db = client.tickit
tasks_collection = db.tasks
class Task(BaseModel):
    text: str
    done: bool = False
@app.get("/tasks")
async def get_tasks():
    all_tasks = []
    for task in tasks_collection.find():
        task["_id"] = str(task["_id"])
        all_tasks.append(task)
    return all_tasks
@app.post("/tasks")

async def add_task(task: Task):
    result = tasks_collection.insert_one(task.model_dump())
    return {"id": str(result.inserted_id)}


@app.delete("/tasks/{task_id}")
async def delete_task(task_id: str):
    tasks_collection.delete_one({"_id": ObjectId(task_id)})
    return {"message": "Task deleted"}



@app.put("/tasks/{task_id}")
async def update_task(task_id: str, task: Task):
    tasks_collection.update_one(
        {"_id": ObjectId(task_id)},
        {"$set": {"done": task.done}}
    )
    return {"message": "Task updated"}