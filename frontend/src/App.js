import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const API = "http://127.0.0.1:8000";

  const [token, setToken] = useState(localStorage.getItem("token"));
  const [login, setLogin] = useState({
    username: "",
    password: ""
  });

  const [students, setStudents] = useState([]);

  const [form, setForm] = useState({
    name: "",
    age: "",
    course: ""
  });

  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    if (token) getStudents();
  }, [token]);

  const handleLoginChange = (e) => {
    setLogin({
      ...login,
      [e.target.name]: e.target.value
    });
  };

  const loginUser = async () => {
    const data = new URLSearchParams();
    data.append("username", login.username);
    data.append("password", login.password);

    const res = await axios.post(API + "/login", data);

    localStorage.setItem("token", res.data.access_token);
    setToken(res.data.access_token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  const getStudents = async () => {
    const res = await axios.get(API + "/students");
    setStudents(res.data);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const addStudent = async () => {
    if (editId) {
      await axios.put(API + "/students/" + editId, form, {
        headers: {
          Authorization: "Bearer " + token
        }
      });

      setEditId(null);

    } else {
      await axios.post(API + "/students/", form, {
        headers: {
          Authorization: "Bearer " + token
        }
      });
    }

    setForm({
      name: "",
      age: "",
      course: ""
    });

    getStudents();
  };

  const editStudent = (student) => {
    setForm({
      name: student.name,
      age: student.age,
      course: student.course
    });

    setEditId(student.id);
  };

  const deleteStudent = async (id) => {
    await axios.delete(API + "/students/" + id, {
      headers: {
        Authorization: "Bearer " + token
      }
    });

    getStudents();
  };

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  if (!token) {
    return (
      <div className="container">
        <div className="card">
          <h1>Login</h1>

          <input
            name="username"
            placeholder="Username"
            onChange={handleLoginChange}
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleLoginChange}
          />

          <button onClick={loginUser}>Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Student Management Dashboard</h1>

      <button className="logout" onClick={logout}>
        Logout
      </button>

      <div className="card">
        <h2>{editId ? "Update Student" : "Add Student"}</h2>

        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
        />

        <input
          name="age"
          placeholder="Age"
          value={form.age}
          onChange={handleChange}
        />

        <input
          name="course"
          placeholder="Course"
          value={form.course}
          onChange={handleChange}
        />

        <button onClick={addStudent}>
          {editId ? "Update Student" : "Add Student"}
        </button>
      </div>

      <div className="card">
        <h2>Students</h2>

        <input
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Course</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((student) => (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.age}</td>
                <td>{student.course}</td>
                <td>
                  <button
                    className="edit"
                    onClick={() => editStudent(student)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete"
                    onClick={() => deleteStudent(student.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;