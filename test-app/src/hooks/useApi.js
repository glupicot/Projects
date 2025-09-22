// src/hooks/useApi.js
import { useState, useCallback } from 'react';

const API_BASE_URL = 'http://localhost:3000';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (endpoint, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const getAllTodos = useCallback(async () => {
    try {
      const todos = await request('/getToDos');
      return todos.map(todo => ({
        id: todo._id || todo.id,
        name: todo.name || 'Без названия',
        description: todo.description || "",
        dueDate: todo.dueDate || new Date().toISOString().split('T')[0],
        sprint: todo.sprint || "Без спринта",
        completed: todo.completed || false
      }));
    } catch (error) {
      console.error('Error fetching todos:', error);
      return [];
    }
  }, [request]);

  const addTodo = useCallback(async (taskData) => {
    return await request('/addToDo', {
      method: 'POST',
      body: JSON.stringify({
        name: taskData.name,
        description: taskData.description,
        dueDate: taskData.dueDate,
        sprint: taskData.sprint,
        completed: taskData.completed || false
      })
    });
  }, [request]);

  const deleteTodo = useCallback(async (id) => {
    return await request(`/deleteToDo/${id}`, {
      method: 'DELETE'
    });
  }, [request]);

  const updateTodo = useCallback(async (id, updateData) => {
    const dataToUpdate = {};
    
    if (updateData.name !== undefined) dataToUpdate.name = updateData.name;
    if (updateData.description !== undefined) dataToUpdate.description = updateData.description;
    if (updateData.dueDate !== undefined) dataToUpdate.dueDate = updateData.dueDate;
    if (updateData.sprint !== undefined) dataToUpdate.sprint = updateData.sprint;
    if (updateData.completed !== undefined) dataToUpdate.completed = updateData.completed;

    return await request(`/updateToDo/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(dataToUpdate)
    });
  }, [request]);

  return {
    loading,
    error,
    getAllTodos,
    addTodo,
    deleteTodo,
    updateTodo,
    clearError: () => setError(null)
  };
};