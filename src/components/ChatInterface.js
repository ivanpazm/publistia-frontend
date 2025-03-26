import React, { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';

const ChatInterface = ({ onAddTask, onAddIdea }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: '¡Hola! Soy tu asistente IA. ¿En qué puedo ayudarte hoy?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Añadir mensaje del usuario
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: input
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    // Simular respuesta del asistente
    // En producción, esto sería una llamada a la API
    setTimeout(() => {
      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: processUserMessage(input)
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  // Función simple para simular la respuesta del asistente
  const processUserMessage = (message) => {
    const lowerMessage = message.toLowerCase();
    
    // Detectar creación de ideas
    if (lowerMessage.includes('nueva idea') || lowerMessage.includes('crear idea')) {
      const ideaName = lowerMessage.includes('llamada') 
        ? message.split('llamada')[1].trim().replace(/['"]/g, '')
        : 'nueva idea';
      
      // Notificar al componente padre
      onAddIdea({ name: ideaName, created: new Date() });
      
      return `He creado la nueva idea "${ideaName}". ¿Qué tareas deberían formar parte de esta idea?`;
    }
    
    // Detectar creación de tareas
    if (lowerMessage.includes('tarea') || lowerMessage.includes('crear task')) {
      const tasks = [];
      const words = message.split(' ');
      
      if (lowerMessage.includes('crea')) {
        for (let i = 0; i < words.length; i++) {
          if (words[i].toLowerCase() === 'llamada' && i < words.length - 1) {
            const taskName = words[i + 1].replace(/['",.]/g, '');
            tasks.push(taskName);
            onAddTask({ name: taskName, completed: false, created: new Date() });
          }
        }
      } else if (lowerMessage.includes('tareas')) {
        // Extraer múltiples tareas de la frase
        const taskMatches = message.match(/["']([^"']+)["']/g);
        if (taskMatches) {
          taskMatches.forEach(match => {
            const taskName = match.replace(/["']/g, '');
            tasks.push(taskName);
            onAddTask({ name: taskName, completed: false, created: new Date() });
          });
        }
      }
      
      if (tasks.length > 0) {
        return `He creado ${tasks.length} ${tasks.length === 1 ? 'tarea' : 'tareas'}: ${tasks.join(', ')}`;
      } else {
        return `No he podido identificar el nombre de la tarea. ¿Puedes intentarlo de nuevo?`;
      }
    }
    
    // Respuesta por defecto
    return `Entiendo tu mensaje. ¿Quieres crear una nueva idea o tarea relacionada con "${message}"?`;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center text-sm mr-3">
            i
          </div>
          <span className="text-sm text-gray-300">Chat</span>
        </div>
        <div>
          <button className="text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isLoading && (
          <div className="flex justify-center items-center p-2">
            <div className="animate-pulse flex space-x-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700 flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
        />
        <button 
          type="submit" 
          disabled={isLoading || !input.trim()}
          className="ml-2 p-2 bg-accent hover:bg-blue-600 rounded-lg disabled:opacity-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;
