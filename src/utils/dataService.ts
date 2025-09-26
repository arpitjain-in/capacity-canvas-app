import mockData from "@/data/mockData.json";

interface Task {
  id: number;
  title: string;
  description: string;
  assignee: "Keerthi" | "Arpit" | "Pure";
  status: "todo" | "in_progress" | "completed" | "blocked";
  sprintId: number;
  storyPoints: number;
  techStack: string[];
}

interface Engineer {
  id: number;
  name: string;
  role: string;
  capacity: number;
  availableDays: number;
  allocatedDays: number;
}

interface Sprint {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  status: string;
  workingDays: number;
}

class DataService {
  private data = { ...mockData };

  // Task operations
  updateTask(taskId: number, updates: Partial<Task>): Task[] {
    const taskIndex = this.data.tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
      this.data.tasks[taskIndex] = { ...this.data.tasks[taskIndex], ...updates };
      this.persistToStorage();
    }
    return this.data.tasks as Task[];
  }

  addTask(task: Omit<Task, 'id'>): Task[] {
    const newId = Math.max(...this.data.tasks.map(t => t.id)) + 1;
    const newTask = { ...task, id: newId };
    this.data.tasks.push(newTask);
    this.persistToStorage();
    return this.data.tasks as Task[];
  }

  deleteTask(taskId: number): Task[] {
    this.data.tasks = this.data.tasks.filter(task => task.id !== taskId);
    this.persistToStorage();
    return this.data.tasks as Task[];
  }

  // Engineer operations
  updateEngineer(engineerId: number, updates: Partial<Engineer>): Engineer[] {
    const engineerIndex = this.data.engineers.findIndex(eng => eng.id === engineerId);
    if (engineerIndex !== -1) {
      this.data.engineers[engineerIndex] = { ...this.data.engineers[engineerIndex], ...updates };
      this.persistToStorage();
    }
    return this.data.engineers as Engineer[];
  }

  // Sprint operations
  updateSprint(sprintId: number, updates: Partial<Sprint>): Sprint[] {
    const sprintIndex = this.data.sprints.findIndex(sprint => sprint.id === sprintId);
    if (sprintIndex !== -1) {
      this.data.sprints[sprintIndex] = { ...this.data.sprints[sprintIndex], ...updates };
      this.persistToStorage();
    }
    return this.data.sprints as Sprint[];
  }

  // Get operations
  getTasks(): Task[] {
    return this.data.tasks as Task[];
  }

  getEngineers(): Engineer[] {
    return this.data.engineers as Engineer[];
  }

  getSprints(): Sprint[] {
    return this.data.sprints as Sprint[];
  }

  getStats() {
    return this.data.stats;
  }

  // Persistence (in a real app, this would call backend API)
  private persistToStorage() {
    // Store in localStorage as a fallback persistence mechanism
    localStorage.setItem('projectData', JSON.stringify(this.data));
    
    // In a real application, this would make an API call to save to database
    console.log('Data persisted:', this.data);
  }

  // Load from storage
  loadFromStorage() {
    try {
      const stored = localStorage.getItem('projectData');
      if (stored) {
        this.data = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading from storage:', error);
    }
  }

  // Reset to original mock data
  resetData() {
    this.data = { ...mockData };
    this.persistToStorage();
  }
}

// Singleton instance
export const dataService = new DataService();

// Initialize from storage on first load
dataService.loadFromStorage();

export default dataService;