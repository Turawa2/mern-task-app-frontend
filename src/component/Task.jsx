import React from 'react';
import { FaEdit, FaCheckDouble, FaRegTrashAlt } from 'react-icons/fa';

function Task({ task, index, deleteTask, getSingleTask, setToComplete }) {
  const taskIndex = parseInt(index, 10); // Explicitly convert index to a number

  return (
    <>
      <div className={task.completed ? "task completed" : "task" }>
        <p>
          <b>{taskIndex + 1}. </b>
          {task && task.name ? task.name : 'Task Name Undefined'}
        </p>
        <div className='task-icons'>
          <FaCheckDouble color='green'  onClick={() => setToComplete(task)}/>
          <FaEdit color='purple' onClick={() => getSingleTask(task)} />

          <FaRegTrashAlt color='red' onClick={() => {
            deleteTask(task._id)
          }} />
        </div>
      </div>
    </>
  );
}

export default Task;
