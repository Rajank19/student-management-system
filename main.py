from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import models
from database import engine
from routers import student, login, users

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Professional Student API")

# CORS FIXED FOR LOCAL + VERCEL
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://student-management-system.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(student.router)
app.include_router(login.router)
app.include_router(users.router)


@app.get("/")
def home():
    return {"message": "Professional API Running"}