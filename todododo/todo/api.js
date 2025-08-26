// todo/api.js
const API_BASE_URL = 'http://localhost:3000';

class TodoAPI {
  
  static async getAllTodos() {
    try {
      const response = await fetch(`${API_BASE_URL}/getToDos`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const todos = await response.json();
      console.log("Todos from server:", todos);
      
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
  }

  static async addTodo(taskData) {
    try {
      const response = await fetch(`${API_BASE_URL}/addToDo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: taskData.name,
          description: taskData.description,
          dueDate: taskData.dueDate,
          sprint: taskData.sprint,
          completed: taskData.completed || false
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log("Add todo result:", result);
      return result;
    } catch (error) {
      console.error('Error adding todo:', error);
      throw error;
    }
  }

  static async deleteTodo(id) {
    try {
      console.log("Deleting todo with ID:", id);
      
      const response = await fetch(`${API_BASE_URL}/deleteToDo/${id}`, {
        method: 'DELETE'
      });
      
      console.log("Delete response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Delete error response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const result = await response.json();
      console.log("Delete result:", result);
      return result;
    } catch (error) {
      console.error('Error deleting todo:', error);
      throw error;
    }
  }

  static async updateTodo(id, updateData) {
    try {
      console.log("Updating todo with ID:", id);
      
      const dataToUpdate = {};
      
      if (updateData.name !== undefined) dataToUpdate.name = updateData.name;
      if (updateData.description !== undefined) dataToUpdate.description = updateData.description;
      if (updateData.dueDate !== undefined) dataToUpdate.dueDate = updateData.dueDate;
      if (updateData.sprint !== undefined) dataToUpdate.sprint = updateData.sprint;
      if (updateData.completed !== undefined) dataToUpdate.completed = updateData.completed;

      const response = await fetch(`${API_BASE_URL}/updateToDo/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToUpdate)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating todo:', error);
      throw error;
    }
  }
}