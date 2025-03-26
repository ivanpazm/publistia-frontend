import React, { useState, useEffect } from 'react';
import ChatInterface from './components/ChatInterface';
import TaskPanel from './components/TaskPanel';
import Header from './components/Header';

function App() {
  const [tasks, setTasks] = useState([]);
  const [activeIdea, setActiveIdea] = useState(null);
  const [ideas, setIdeas] = useState([]);
  
  // Simular que cargamos datos desde una API o base de datos
  useEffect(() => {
    // En un entorno real, esto sería una llamada a la API
    const mockIdeas = localStorage.getItem('ideas') 
      ? JSON.parse(localStorage.getItem('ideas')) 
      : [];
    
    const mockTasks = localStorage.getItem('tasks') 
      ? JSON.parse(localStorage.getItem('tasks')) 
      : [];
    
    setIdeas(mockIdeas);
    setTasks(mockTasks);
  }, []);

  // Guardar cambios en localStorage para simular persistencia
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  useEffect(() => {
    if (ideas.length > 0) {
      localStorage.setItem('ideas', JSON.stringify(ideas));
    }
  }, [ideas]);
  
  const addTask = (task) => {
    // Asignar la tarea a la idea activa si existe
    const newTask = activeIdea 
      ? { ...task, ideaId: activeIdea.id } 
      : task;
    
    setTasks([...tasks, newTask]);
  };

  const addIdea = (idea) => {
    const newIdea = {
      ...idea,
      id: Date.now().toString(),
      created: new Date().toISOString()
    };
    
    setIdeas([...ideas, newIdea]);
    setActiveIdea(newIdea);
    
    // Al crear una nueva idea, filtramos las tareas para mostrar solo las de esta idea
    // (que inicialmente no habrá ninguna)
    setTasks(tasks.filter(task => task.ideaId === newIdea.id));
  };
  
  const updateTask = (taskId, updatedTask) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, ...updatedTask } : task
    ));
  };
  
  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  return (
    <div className="min-h-screen bg-primary text-light flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/2 border-r border-gray-700">
          <ChatInterface 
            onAddTask={addTask} 
            onAddIdea={addIdea}
            activeIdea={activeIdea}
          />
        </div>
        <div className="w-1/2">
          <TaskPanel 
            tasks={activeIdea 
              ? tasks.filter(task => task.ideaId === activeIdea.id)
              : tasks
            } 
            activeIdea={activeIdea}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
