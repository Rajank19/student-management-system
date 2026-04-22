# from fastapi import FastAPI, Depends, HTTPException
# from sqlalchemy.orm import Session

# import models
# import schemas
# from database import engine, SessionLocal

# models.Base.metadata.create_all(bind=engine)

# app = FastAPI(title="Student Management API")


# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()


# @app.get("/")
# def home():
#     return {"message": "Student API Running"}


# @app.post("/students")
# def create_student(student: schemas.StudentCreate, db: Session = Depends(get_db)):
#     new_student = models.Student(**student.model_dump())
#     db.add(new_student)
#     db.commit()
#     db.refresh(new_student)
#     return new_student


# @app.get("/students")
# def get_students(db: Session = Depends(get_db)):
#     return db.query(models.Student).all()


# @app.get("/students/{student_id}")
# def get_student(student_id: int, db: Session = Depends(get_db)):
#     student = db.query(models.Student).filter(models.Student.id == student_id).first()

#     if not student:
#         raise HTTPException(status_code=404, detail="Student not found")

#     return student


# @app.put("/students/{student_id}")
# def update_student(student_id: int, data: schemas.StudentCreate, db: Session = Depends(get_db)):
#     student = db.query(models.Student).filter(models.Student.id == student_id).first()

#     if not student:
#         raise HTTPException(status_code=404, detail="Student not found")

#     student.name = data.name
#     student.age = data.age
#     student.course = data.course

#     db.commit()
#     db.refresh(student)

#     return student


# @app.delete("/students/{student_id}")
# def delete_student(student_id: int, db: Session = Depends(get_db)):
#     student = db.query(models.Student).filter(models.Student.id == student_id).first()

#     if not student:
#         raise HTTPException(status_code=404, detail="Student not found")

#     db.delete(student)
#     db.commit()

#     return {"message": "Student deleted successfully"}

# from fastapi import FastAPI
# import models
# from database import engine
# from routers import student, login, users

# models.Base.metadata.create_all(bind=engine)

# app = FastAPI(title="Professional Student API")

# app.include_router(student.router)
# app.include_router(login.router)
# app.include_router(users.router)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import models
from database import engine
from routers import student, login, users

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Professional Student API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
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