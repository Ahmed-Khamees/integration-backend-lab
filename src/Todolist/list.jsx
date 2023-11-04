import { useEffect } from "react";
import { useState } from "react";
import { axiosInstance } from "../Config/axios.config";

const Todolist = () => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [search, setSearch] = useState("");

  const getTodos = async () => {
    const dbTodos = await axiosInstance.get(`/todos?q=${search}`);
    setTodos(dbTodos.data);
  }

  useEffect(() => {
    let timeoutId;
    timeoutId = setTimeout(() => {getTodos()}, 2000);
    return () => { clearTimeout(timeoutId) }
  }, [search])

  const handleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  }

  const handleDelete = (id) => { 
    axiosInstance.delete(`/todos/${id}`).then(() => {getTodos()})
  };
  const handleEdit = (content) => { 
    axiosInstance.patch(`/todos/${content.id}`, { isCompleted:false}).then(() => {getTodos()})
  };
  const handleDone = (status) => { 
    axiosInstance.patch(`/todos/${status.id}`, { isCompleted:true}).then(() => {getTodos()})
  };

  const addTask = async (e) => {
    e.preventDefault();
    axiosInstance.post("/todos", {
      taskName: title,
      isCompleted: false
    }).then(()=>getTodos())
  };

  return (
    <div className="todolist">
      <div className="search" onSubmit={addTask}>
        <input type="text" placeholder="Search ex: todo 1" onChange={handleSearchChange}
          value={search}/>
      </div>
      <form className="addTask" onSubmit={addTask}>
        <input
          type="text"
          onChange={handleChange}
          value={title}
          placeholder="Add a task........"
        />
        <button className="addtask-btn">Add Task</button>
      </form>
      <div className="lists">
        {todos?.map((todo, id) => (
          <div
            key={id}
            className={`list ${todo.isCompleted ? "completed" : ""}`}
          >
            <p> {todo.taskName}</p>
            <div className="span-btns">
              {!todo.isCompleted && (
                <span onClick={() => handleDone(todo)} title="completed">
                  ✓
                </span>
              )}
              <span
                className="delete-btn"
                onClick={() => handleDelete(todo.id)}
                title="delete"
              >
                x
              </span>
              <span
                className="edit-btn"
                onClick={() => handleEdit(todo)}
                title="edit"
              >
                ↻
              </span>
            </div>
          </div>
        ))}
        {!todos?.length && <h1>No Records</h1>}
      </div>
    </div>
  );
};

export default Todolist;
