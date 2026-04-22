# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.orm import Session

# import models
# import schemas
# from database import SessionLocal

# router = APIRouter(
#     prefix="/students",
#     tags=["Students"]
# )


# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()


# @router.post("/")
# def create_student(student: schemas.StudentCreate, db: Session = Depends(get_db)):

#     old_student = db.query(models.Student).filter(
#         models.Student.name == student.name
#     ).first()

#     if old_student:
#         raise HTTPException(status_code=400, detail="Student already exists")

#     new_student = models.Student(**student.model_dump())

#     db.add(new_student)
#     db.commit()
#     db.refresh(new_student)

#     return new_student


# @router.get("/")
# def get_students(
#     search: str = "",
#     skip: int = 0,
#     limit: int = 5,
#     db: Session = Depends(get_db)
# ):

#     query = db.query(models.Student)

#     if search:
#         query = query.filter(models.Student.name.contains(search))

#     students = query.offset(skip).limit(limit).all()

#     return students


# @router.get("/{student_id}")
# def get_student(student_id: int, db: Session = Depends(get_db)):

#     student = db.query(models.Student).filter(
#         models.Student.id == student_id
#     ).first()

#     if not student:
#         raise HTTPException(status_code=404, detail="Student not found")

#     return student


# @router.delete("/{student_id}")
# def delete_student(student_id: int, db: Session = Depends(get_db)):

#     student = db.query(models.Student).filter(
#         models.Student.id == student_id
#     ).first()

#     if not student:
#         raise HTTPException(status_code=404, detail="Student not found")

#     db.delete(student)
#     db.commit()

#     return {"message": "Deleted Successfully"}
# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.orm import Session

# import models
# import schemas
# from database import SessionLocal
# from auth import get_current_user

# router = APIRouter(
#     prefix="/students",
#     tags=["Students"]
# )


# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()


# @router.post("/")
# def create_student(
#     student: schemas.StudentCreate,
#     db: Session = Depends(get_db),
#     user: str = Depends(get_current_user)
# ):

#     old = db.query(models.Student).filter(
#         models.Student.name == student.name
#     ).first()

#     if old:
#         raise HTTPException(status_code=400, detail="Student already exists")

#     new_student = models.Student(**student.model_dump())

#     db.add(new_student)
#     db.commit()
#     db.refresh(new_student)

#     return {
#         "message": f"Created by {user}",
#         "data": new_student
#     }


# @router.get("/")
# def get_students(
#     search: str = "",
#     skip: int = 0,
#     limit: int = 5,
#     db: Session = Depends(get_db)
# ):
#     query = db.query(models.Student)

#     if search:
#         query = query.filter(models.Student.name.contains(search))

#     return query.offset(skip).limit(limit).all()


# @router.delete("/{student_id}")
# def delete_student(
#     student_id: int,
#     db: Session = Depends(get_db),
#     user: str = Depends(get_current_user)
# ):

#     student = db.query(models.Student).filter(
#         models.Student.id == student_id
#     ).first()

#     if not student:
#         raise HTTPException(status_code=404, detail="Student not found")

#     db.delete(student)
#     db.commit()

#     return {"message": f"Deleted by {user}"}

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import models
import schemas
from database import SessionLocal
from auth import get_current_user

router = APIRouter(
    prefix="/students",
    tags=["Students"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# CREATE STUDENT
@router.post("/")
def create_student(
    student: schemas.StudentCreate,
    db: Session = Depends(get_db),
    user: str = Depends(get_current_user)
):

    old = db.query(models.Student).filter(
        models.Student.name == student.name
    ).first()

    if old:
        raise HTTPException(
            status_code=400,
            detail="Student already exists"
        )

    new_student = models.Student(**student.model_dump())

    db.add(new_student)
    db.commit()
    db.refresh(new_student)

    return {
        "message": f"Created by {user}",
        "data": new_student
    }


# GET ALL STUDENTS
@router.get("/")
def get_students(
    search: str = "",
    skip: int = 0,
    limit: int = 5,
    db: Session = Depends(get_db)
):
    query = db.query(models.Student)

    if search:
        query = query.filter(
            models.Student.name.contains(search)
        )

    return query.offset(skip).limit(limit).all()


# DELETE STUDENT
@router.delete("/{student_id}")
def delete_student(
    student_id: int,
    db: Session = Depends(get_db),
    user: str = Depends(get_current_user)
):

    student = db.query(models.Student).filter(
        models.Student.id == student_id
    ).first()

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    db.delete(student)
    db.commit()

    return {
        "message": f"Deleted by {user}"
    }


# UPDATE STUDENT
@router.put("/{student_id}")
def update_student(
    student_id: int,
    student: schemas.StudentCreate,
    db: Session = Depends(get_db),
    user: str = Depends(get_current_user)
):

    old_student = db.query(models.Student).filter(
        models.Student.id == student_id
    ).first()

    if not old_student:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    old_student.name = student.name
    old_student.age = student.age
    old_student.course = student.course

    db.commit()

    return {
        "message": f"Updated by {user}"
    }