import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const API = "https://student-api-25x0.onrender.com";

  const [token, setToken] = useState(localStorage.getItem("token"));
  const [showSignup, setShowSignup] = useState(false);

  const [login, setLogin] = useState({
    username: "",
    password: ""
  });

  const [signup, setSignup] = useState({
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

  useEffect(() => {
    if (token) {
      getStudents();
    }
  }, [token]);

  const loginUser = async () => {
    try {
      const data = new URLSearchParams();
      data.append("username", login.username);
      data.append("password", login.password);

      const res = await axios.post(API + "/login", data);

      localStorage.setItem("token", res.data.access_token);
      setToken(res.data.access_token);
    } catch (error) {
      alert("Invalid Username or Password");
    }
  };

  const registerUser = async () => {
    try {
      await axios.post(API + "/users/register", signup);

      alert("Signup Successful! Please Login.");

      setSignup({
        username: "",
        password: ""
      });

      setShowSignup(false);
    } catch (error) {
      alert("Signup Failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  const getStudents = async () => {
    try {
      const res = await axios.get(API + "/students");
      setStudents(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleForm = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const addStudent = async () => {
    try {
      await axios.post(API + "/students/", form, {
        headers: {
          Authorization: "Bearer " + token
        }
      });

      getStudents();

      setForm({
        name: "",
        age: "",
        course: ""
      });
    } catch (error) {
      alert("Failed to add student");
    }
  };

  const deleteStudent = async (id) => {
    try {
      await axios.delete(API + "/students/" + id, {
        headers: {
          Authorization: "Bearer " + token
        }
      });

      getStudents();
    } catch (error) {
      alert("Delete failed");
    }
  };

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  if (!token) {
    return (
      <div className="container">
        <div className="card">
          <h1>{showSignup ? "Sign Up" : "Login"}</h1>

          {showSignup ? (
            <>
              <input
                placeholder="Username"
                value={signup.username}
                onChange={(e) =>
                  setSignup({
                    ...signup,
                    username: e.target.value
                  })
                }
              />

              <input
                type="password"
                placeholder="Password"
                value={signup.password}
                onChange={(e) =>
                  setSignup({
                    ...signup,
                    password: e.target.value
                  })
                }
              />

              <button onClick={registerUser}>Create Account</button>

              <p
                onClick={() => setShowSignup(false)}
                style={{
                  color: "#2563eb",
                  cursor: "pointer",
                  marginTop: "12px",
                  fontWeight: "600"
                }}
              >
                Already have account? Login
              </p>
            </>
          ) : (
            <>
              <input
                placeholder="Username"
                value={login.username}
                onChange={(e) =>
                  setLogin({
                    ...login,
                    username: e.target.value
                  })
                }
              />

              <input
                type="password"
                placeholder="Password"
                value={login.password}
                onChange={(e) =>
                  setLogin({
                    ...login,
                    password: e.target.value
                  })
                }
              />

              <button onClick={loginUser}>Login</button>

              <p
                onClick={() => setShowSignup(true)}
                style={{
                  color: "#2563eb",
                  cursor: "pointer",
                  marginTop: "12px",
                  fontWeight: "600"
                }}
              >
                Don't have account? Sign Up
              </p>
            </>
          )}
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
        <h2>Add Student</h2>

        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleForm}
        />

        <input
          name="age"
          placeholder="Age"
          value={form.age}
          onChange={handleForm}
        />

        <input
          name="course"
          placeholder="Course"
          value={form.course}
          onChange={handleForm}
        />

        <button onClick={addStudent}>Add Student</button>
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