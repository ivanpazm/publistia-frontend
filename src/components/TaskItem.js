import React, { useState } from 'react';

const TaskItem = ({ task }) => {
  const [isCompleted, setIsCompleted] = useState(task.completed || false);
  const [isHovered, setIsHovered] = useState(false);
  
  const toggleCompleted = () => {
    setIsCompleted(!isCompleted);
    // Aquí iría la lógica para actualizar el estado en la base de datos
  };
  
  // Formato de la fecha
  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
  };

  return (
    <div 
      className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button 
        onClick={toggleCompleted}
        className={`h-5 w-5 rounded-full border flex-shrink-0 flex items-center justify-center ${
          isCompleted ? 'bg-accent border-accent' : 'border-gray-500'
        }`}
      >
        {isCompleted && (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>
      
      <div className="ml-3 flex-1">
        <div className={`text-sm ${isCompleted ? 'line-through text-gray-400' : 'text-white'}`}>
          {task.name}
        </div>
        
        {task.description && (
          <div className="text-xs text-gray-400 mt-1">
            {task.description}
          </div>
        )}
        
        {(task.dueDate || task.tags) && (
          <div className="flex items-center mt-1 space-x-2">
            {task.dueDate && (
              <span className="text-xs bg-gray-600 text-gray-300 px-2 py-0.5 rounded">
                {formatDate(task.dueDate)}
              </span>
            )}
            
            {task.tags && task.tags.map(tag => (
              <span 
                key={tag}
                className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      
      {isHovered && (
        <div className="flex items-center space-x-1">
          <button className="p-1 hover:bg-gray-600 rounded">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button className="p-1 hover:bg-gray-600 rounded">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskItem;
