from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import List, Dict
import uvicorn

from database import Database

app = FastAPI(title="Portfolio API", version="1.0.0")

# CORS para permitir requisições do frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inicializar banco de dados
db = Database()

# Modelos Pydantic
class ContactMessage(BaseModel):
    name: str
    email: EmailStr
    message: str

class Project(BaseModel):
    id: int
    name: str
    description: str
    github_url: str
    tech_stack: str
    created_at: str

class Skill(BaseModel):
    id: int
    name: str
    category: str
    level: int
    created_at: str

# Rotas da API
@app.get("/")
async def root():
    return {"message": "Portfolio API", "version": "1.0.0"}

@app.get("/projects", response_model=List[Project])
async def get_projects():
    """Busca todos os projetos"""
    try:
        projects = db.get_projects()
        return projects
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/skills", response_model=List[Skill])
async def get_skills():
    """Busca todas as skills"""
    try:
        skills = db.get_skills()
        return skills
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/contact")
async def send_contact_message(message: ContactMessage):
    """Envia mensagem de contato"""
    try:
        message_id = db.add_contact_message(
            message.name, 
            message.email, 
            message.message
        )
        return {"id": message_id, "status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
