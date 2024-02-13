import React, { useEffect, useState } from "react";
import TaskForm from "./TaskForm";
import Task from "./Task";
import { toast } from "react-toastify";
import axios from "axios";
import { URL } from "../App";
import loadingImage from "../assets/loader.gif";
function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    completed: false,
  });
  const { name } = formData;
  const [isEditing, setIsEditing ] = useState(false)
  const [taskID, setTaskID ] = useState("")

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const getTasks = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`${URL}/api/tasks`);
      setTasks(data);
      setIsLoading(false);

    } catch (error) {
      toast.error(error.message);
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  const createTask = async (e) => {
    e.preventDefault();
    if (name === "") {
      return toast.error("Fill the input Mother F*****r!");
    }
    try {
      await axios.post(`${URL}/api/tasks`, formData);
      toast.success("Task Added Sucessfully!");
      setFormData({ ...formData, name: "" });
      getTasks();
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${URL}/api/tasks/${id}`);
      getTasks();
      toast.success("Task Deleted Sucessfully!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const cTask = tasks.filter((task) => {
        return task.completed === true
    })
    setCompletedTasks(cTask)
  },[tasks])
  const getSingleTask = async (task) => {
    setFormData({
      name: task.name, 
      completed: false
    });
    setTaskID(task._id);
    setIsEditing(true); // Use setIsEditing instead of isEditing
  }

  const updateTask = async (e) => {
    e.preventDefault()
    if(name === ""){
        toast.error("fill all")
    }
    try {
        await axios.put(`${URL}/api/tasks/${taskID}`, formData)
        toast.success("Updated Sucessfully!")
        setFormData({...formData, name: ""})
        setIsEditing(false)
        getTasks()
    } catch (error) {
        toast.error(error.message)
    }
  }

  const setToComplete = async (task) => {
   const newFormData = {
    name: task.name,
    completed: true,
   }
   try {
    await axios.put(`${URL}/api/tasks/${task._id}`, newFormData)
    toast.success("Weldone!")
    getTasks();
   } catch (error) {
    toast.error(error.message)
   }
  }

  
  return (
    <>
      <h2>Task Manager</h2>
      <h5>Code with Dev-lord!</h5>
      <TaskForm
  name={name}
  createTask={createTask} // Make sure this is defined in your TaskList component
  handleInputChange={handleInputChange}
  isEditing={isEditing}
  updateTask={updateTask}
/>


    {
        tasks.length > 0 && (
            <div className="--flex-between --pb">
            <p>
              <b>Total Tasks:</b> {tasks.length}
            </p>
            <p>
              <b>Completed Tasks:</b> {completedTasks.length}
            </p>
          </div>
        )
    }

      <hr />

      {isLoading && (
        <div className="--flex-center">
          <img src={loadingImage} />
        </div>
      )}
      {!isLoading && tasks.length === 0 ? (
        <p className="--py">No task added</p>
      ) : (
        <>
          {tasks.map((task, index) => {
            return (
                <Task
                key={task._id}
                task={task}
                index={index}
                deleteTask={deleteTask}
                getSingleTask={getSingleTask} 
                setToComplete={setToComplete}
              />
              
            );
          })}
        </>
      )}
    </>
  );
}

export default TaskList;
