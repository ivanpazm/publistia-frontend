import React, { useState } from 'react';
import TaskItem from './TaskItem';

const TaskPanel = ({ tasks, activeIdea }) => {
  const [filter, setFilter] = useState('all'); // 'all', 'today', 'tomorrow', 'scheduled'
  
  // Agrupar tareas por fecha para mostrarlas en secciones
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'today') return task.dueDate && new Date(task.dueDate).toDateString() === today.toDateString();
    if (filter === 'tomorrow') return task.dueDate && new Date(task.dueDate).toDateString() === tomorrow.toDateString();
    if (filter === 'scheduled') return task.dueDate && new Date(task.dueDate) > tomorrow;
    return true;
  });

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <div className="flex items-center">
          <h2 className="text-lg font-bold flex items-center gap-2">
            {activeIdea ? (
              <>
                <span className="text-accent">{activeIdea.name}</span>
              </>
            ) : (
              'Tasks'
            )}
          </h2>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-full hover:bg-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
          <button className="p-2 rounded-full hover:bg-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="p-4 border-b border-gray-700">
        <div className="flex">
          <button 
            className={`px-3 py-1 text-sm rounded-l-lg ${filter === 'all' ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-400'}`}
            onClick={() => setFilter('all')}
          >
            Todas
          </button>
          <button 
            className={`px-3 py-1 text-sm ${filter === 'today' ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-400'}`}
            onClick={() => setFilter('today')}
          >
            Hoy
          </button>
          <button 
            className={`px-3 py-1 text-sm ${filter === 'tomorrow' ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-400'}`}
            onClick={() => setFilter('tomorrow')}
          >
            Mañana
          </button>
          <button 
            className={`px-3 py-1 text-sm rounded-r-lg ${filter === 'scheduled' ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-400'}`}
            onClick={() => setFilter('scheduled')}
          >
            Programadas
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            {activeIdea ? (
              <p>No hay tareas para esta idea. Habla con el asistente para crear algunas.</p>
            ) : (
              <p>No hay tareas. Habla con el asistente para crear una nueva idea.</p>
            )}
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {/* Secciones para hoy */}
            <div className="space-y-2">
              <h3 className="text-sm text-gray-400 uppercase">Hoy</h3>
              {filteredTasks
                .filter(task => !task.dueDate || (task.dueDate && new Date(task.dueDate).toDateString() === today.toDateString()))
                .map(task => (
                  <TaskItem key={task.name} task={task} />
                ))}
            </div>
            
            {/* Sección para mañana */}
            {filteredTasks.some(task => task.dueDate && new Date(task.dueDate).toDateString() === tomorrow.toDateString()) && (
              <div className="space-y-2">
                <h3 className="text-sm text-gray-400 uppercase">Mañana</h3>
                {filteredTasks
                  .filter(task => task.dueDate && new Date(task.dueDate).toDateString() === tomorrow.toDateString())
                  .map(task => (
                    <TaskItem key={task.name} task={task} />
                  ))}
              </div>
            )}
            
            {/* Sección para futuras */}
            {filteredTasks.some(task => task.dueDate && new Date(task.dueDate) > tomorrow) && (
              <div className="space-y-2">
                <h3 className="text-sm text-gray-400 uppercase">Próximamente</h3>
                {filteredTasks
                  .filter(task => task.dueDate && new Date(task.dueDate) > tomorrow)
                  .map(task => (
                    <TaskItem key={task.name} task={task} />
                  ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskPanel;
