import React, { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const TodoPage = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [filter, setFilter] = useState('all'); // all, completed, active, today, week
  const { logout, user } = useAuth();

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await api.get('/todos/');
      const sortedTodos = response.data.sort((a, b) => a.order - b.order);
      setTodos(sortedTodos);
    } catch (error) {
      console.error("Failed to fetch todos", error);
    }
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    try {
      const categoryValue = category.trim() || '';
      const maxOrder = todos.length > 0 ? Math.max(...todos.map(t => t.order)) : 0;
      
      const payload = { 
        title: newTodo,
        priority: priority,
        category: categoryValue,
        order: maxOrder + 1,
      };

      if (dueDate) {
          payload.due_date = new Date(dueDate).toISOString();
      }

      const response = await api.post('/todos/', payload);
      setTodos([...todos, response.data]);
      setNewTodo('');
      setCategory('');
      setPriority('medium');
      setDueDate('');
    } catch (error) {
      console.error("Failed to add todo", error);
    }
  };

  const handleToggleTodo = async (todo) => {
    try {
      const response = await api.put(`/todos/${todo.id}`, {
        ...todo,
        completed: !todo.completed
      });
      setTodos(todos.map(t => t.id === todo.id ? response.data : t));
    } catch (error) {
      console.error("Failed to update todo", error);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await api.delete(`/todos/${id}`);
      setTodos(todos.filter(t => t.id !== id));
    } catch (error) {
      console.error("Failed to delete todo", error);
    }
  };

  const handleClearCompleted = async () => {
    const completedCount = todos.filter(t => t.completed).length;
    if (completedCount === 0) {
        alert("没有已完成的任务");
        return;
    }
    
    if (!window.confirm(`确定要删除 ${completedCount} 个已完成的任务吗？`)) return;
    
    try {
      await api.delete('/todos/completed');
      setTodos(todos.filter(t => !t.completed));
    } catch (error) {
      console.error("Failed to clear completed", error);
    }
  };

  const handleOnDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(todos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTodos(items);
  };

  const getPriorityColor = (p) => {
    switch(p) {
      case 'high': return '#fff1f0'; 
      case 'medium': return '#fffbe6'; 
      case 'low': return '#f6ffed'; 
      default: return '#ffffff';
    }
  };

  const getPriorityBorderColor = (p) => {
    switch(p) {
      case 'high': return '#ffa39e';
      case 'medium': return '#ffe58f';
      case 'low': return '#b7eb8f';
      default: return '#f0f0f0';
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };
  
  const formatDueDate = (dateString) => {
      if (!dateString) return null;
      const date = new Date(dateString);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const isOverdue = date < today;
      
      return (
          <span style={{
              color: isOverdue ? '#ff4d4f' : '#52c41a', 
              fontSize: '0.75em',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: isOverdue ? '#fff1f0' : '#f6ffed',
              padding: '2px 6px',
              borderRadius: '4px',
              border: `1px solid ${isOverdue ? '#ffa39e' : '#b7eb8f'}`
          }}>
              📅 {date.toLocaleDateString()}
          </span>
      );
  };

  const isToday = (someDate) => {
    const today = new Date();
    const date = new Date(someDate);
    return date.getDate() == today.getDate() &&
      date.getMonth() == today.getMonth() &&
      date.getFullYear() == today.getFullYear();
  }

  const isThisWeek = (someDate) => {
      const today = new Date();
      today.setHours(0,0,0,0);
      const date = new Date(someDate);
      const diffDays = Math.ceil((date - today) / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 7;
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === 'completed') return todo.completed;
    if (filter === 'active') return !todo.completed;
    if (filter === 'today') return todo.due_date && isToday(todo.due_date);
    if (filter === 'week') return todo.due_date && isThisWeek(todo.due_date);
    return true;
  });

  return (
    <div className="todo-container">
      <header className="todo-header">
        <h1>待办事项</h1>
        <div className="user-info">
            <span>你好, <strong>{user?.username}</strong></span>
            <button onClick={logout} className="logout-btn">退出</button>
        </div>
      </header>

      <form onSubmit={handleAddTodo} className="todo-form">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="添加新任务..."
          className="todo-input-main"
        />
        <div className="todo-form-controls">
            <select 
                value={priority} 
                onChange={(e) => setPriority(e.target.value)} 
                className="todo-select"
            >
                <option value="low">优先级: 低</option>
                <option value="medium">优先级: 中</option>
                <option value="high">优先级: 高</option>
            </select>
            <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                className="todo-select-category"
            >
                <option value="">无标签</option>
                <option value="工作">工作</option>
                <option value="学习">学习</option>
                <option value="生活">生活</option>
                <option value="娱乐">娱乐</option>
                <option value="健康">健康</option>
            </select>
            <input 
                type="date" 
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="todo-input-date"
            />
            <button type="submit" className="todo-add-btn">添加</button>
        </div>
      </form>

      <div className="todo-filters-container">
          <div className="filters">
            {['all', 'active', 'completed', 'today', 'week'].map(f => (
                <button 
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`filter-btn ${filter === f ? 'active' : ''}`}
                >
                    {{all:'全部', active:'进行中', completed:'已完成', today:'今天', week:'本周'}[f]}
                </button>
            ))}
          </div>

          {todos.some(t => t.completed) && (
              <button 
                onClick={handleClearCompleted}
                className="clear-completed-btn"
              >
                清理已完成 ({todos.filter(t => t.completed).length})
              </button>
          )}
      </div>

      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="todos">
          {(provided) => (
            <div className="todo-list" {...provided.droppableProps} ref={provided.innerRef}>
              {filteredTodos.map((todo, index) => (
                <Draggable key={todo.id} draggableId={todo.id.toString()} index={index}>
                  {(provided, snapshot) => (
                    <div 
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="todo-item" 
                      style={{
                        backgroundColor: getPriorityColor(todo.priority),
                        border: `1px solid ${getPriorityBorderColor(todo.priority)}`,
                        boxShadow: snapshot.isDragging ? '0 8px 16px rgba(0,0,0,0.1)' : 'none',
                        ...provided.draggableProps.style
                      }}
                    >
                      <div className="todo-content">
                          <span className="drag-handle">⋮⋮</span>
                          <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={() => handleToggleTodo(todo)}
                            className="todo-checkbox"
                          />
                          <div className="todo-text-group">
                              <div className="todo-header-line">
                                  <span className={`todo-title ${todo.completed ? 'completed' : ''}`}>
                                      {todo.title}
                                  </span>
                                  {todo.category && todo.category !== 'default' && (
                                    <span className="todo-category">
                                      {todo.category}
                                    </span>
                                  )}
                              </div>
                              <div className="todo-meta">
                                  {todo.due_date && formatDueDate(todo.due_date)}
                                  <span>创建于 {formatDate(todo.created_at)}</span>
                              </div>
                          </div>
                      </div>
                      <button 
                        onClick={() => handleDeleteTodo(todo.id)} 
                        className="delete-btn"
                        title="删除"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default TodoPage;
