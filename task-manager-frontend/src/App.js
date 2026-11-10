
import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const API = "http://localhost:5000/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  const loadTasks = async () => {
    try {
      const response = await axios.get(API);
      setTasks(response.data);
    } catch (error) {
      console.error("Unable to load tasks", error);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const addTask = async () => {
    if (!title.trim()) {
      alert("Please enter a task name");
      return;
    }

    try {
      await axios.post(API, { title });
      setTitle("");
      loadTasks();
    } catch (error) {
      alert("Could not add task. Check the backend.");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`${API}/${id}`, { status });
      loadTasks();
    } catch (error) {
      alert("Could not update task");
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      loadTasks();
    } catch (error) {
      alert("Could not delete task");
    }
  };

  const statuses = ["Pending", "Ongoing", "Completed"];

  return (
    <div className="container py-5">
      <h1 className="text-center mb-2">Project Management</h1>
      <p className="text-center text-muted mb-4">
        Organize your work, one task at a time.
      </p>

      <div className="input-group mb-4">
        <input
          className="form-control"
          placeholder="Enter a new task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />
        <button className="btn btn-primary" onClick={addTask}>
          Add Task
        </button>
      </div>

      <div className="row">
        {statuses.map((status) => (
          <div className="col-md-4 mb-3" key={status}>
            <div className="card h-100">
              <div className="card-header fw-bold">
                {status} Tasks
              </div>

              <div className="card-body">
                {tasks.filter((task) => task.status === status).length === 0
                  ? <p className="text-muted">No tasks yet.</p>
                  : tasks
                      .filter((task) => task.status === status)
                      .map((task) => (
                        <div className="card mb-3" key={task._id}>
                          <div className="card-body">
                            <h6>{task.title}</h6>
                            <p className="small">Status: {task.status}</p>

                            <select
                              className="form-select mb-2"
                              value={task.status}
                              onChange={(e) =>
                                updateStatus(task._id, e.target.value)
                              }
                            >
                              {statuses.map((s) => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>

                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => deleteTask(task._id)}
                            >
                              Delete Task
                            </button>
                          </div>
                        </div>
                      ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
