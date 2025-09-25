import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle, Circle, User, Clock, Filter } from "lucide-react";

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

const TaskManager = () => {
  const [tasks] = useState<Task[]>([
    {
      id: 1,
      title: "Setup React Native project and basic navigation",
      description: "Initialize RN project, configure navigation, setup folder structure",
      assignee: "Keerthi",
      status: "completed",
      sprintId: 1,
      storyPoints: 5,
      techStack: ["React Native"]
    },
    {
      id: 2,
      title: "Design and implement cashier dashboard UI",
      description: "Create main dashboard interface for cashier operations",
      assignee: "Keerthi",
      status: "completed",
      sprintId: 2,
      storyPoints: 8,
      techStack: ["React Native"]
    },
    {
      id: 3,
      title: "Create category management system",
      description: "Build UI for managing product categories (vegetables, fruits, milk, frozen)",
      assignee: "Keerthi",
      status: "completed",
      sprintId: 2,
      storyPoints: 5,
      techStack: ["React Native"]
    },
    {
      id: 4,
      title: "Setup NodeJS backend API with GraphQL",
      description: "Initialize backend server, configure GraphQL endpoints",
      assignee: "Arpit",
      status: "completed",
      sprintId: 3,
      storyPoints: 8,
      techStack: ["NodeJS", "GraphQL"]
    },
    {
      id: 5,
      title: "Design and implement SQL database schema",
      description: "Create database tables for sales data, categories, and historic records",
      assignee: "Pure",
      status: "completed",
      sprintId: 3,
      storyPoints: 6,
      techStack: ["SQL"]
    },
    {
      id: 6,
      title: "Implement daily sales entry forms",
      description: "Create forms for entering sales data for each category",
      assignee: "Keerthi",
      status: "completed",
      sprintId: 4,
      storyPoints: 7,
      techStack: ["React Native"]
    },
    {
      id: 7,
      title: "Create data persistence layer",
      description: "Build API endpoints for storing historic sales data",
      assignee: "Arpit",
      status: "completed",
      sprintId: 4,
      storyPoints: 6,
      techStack: ["NodeJS", "GraphQL", "SQL"]
    },
    {
      id: 8,
      title: "Build historic data display screens",
      description: "Create tabular views for displaying historical sales data",
      assignee: "Keerthi",
      status: "completed",
      sprintId: 4,
      storyPoints: 5,
      techStack: ["React Native"]
    },
    {
      id: 9,
      title: "Create graphical sales visualization",
      description: "Implement charts and graphs for sales data visualization",
      assignee: "Keerthi",
      status: "in_progress",
      sprintId: 5,
      storyPoints: 8,
      techStack: ["React Native"]
    },
    {
      id: 10,
      title: "Implement sales comparison logic",
      description: "Build day-over-day sales comparison with color coding (red/green)",
      assignee: "Arpit",
      status: "in_progress",
      sprintId: 5,
      storyPoints: 6,
      techStack: ["NodeJS", "GraphQL"]
    },
    {
      id: 11,
      title: "Sales data retrieval API endpoints",
      description: "Create efficient APIs for fetching historic and current sales data",
      assignee: "Pure",
      status: "in_progress",
      sprintId: 5,
      storyPoints: 5,
      techStack: ["SQL", "NodeJS"]
    },
    {
      id: 12,
      title: "Add color coding for sales performance",
      description: "Implement red/green indicators for sales performance metrics",
      assignee: "Keerthi",
      status: "todo",
      sprintId: 6,
      storyPoints: 3,
      techStack: ["React Native"]
    },
    {
      id: 13,
      title: "Create sales analytics and reporting",
      description: "Build comprehensive analytics dashboard with reporting features",
      assignee: "Arpit",
      status: "todo",
      sprintId: 6,
      storyPoints: 8,
      techStack: ["NodeJS", "GraphQL"]
    },
    {
      id: 14,
      title: "Implement data validation and error handling",
      description: "Add robust validation and error handling across the application",
      assignee: "Pure",
      status: "todo",
      sprintId: 6,
      storyPoints: 5,
      techStack: ["SQL", "NodeJS"]
    },
    {
      id: 15,
      title: "Add user authentication and role management",
      description: "Implement login system and role-based access control",
      assignee: "Arpit",
      status: "todo",
      sprintId: 6,
      storyPoints: 7,
      techStack: ["NodeJS", "GraphQL"]
    },
    {
      id: 16,
      title: "Testing and quality assurance",
      description: "Comprehensive testing of all features and bug fixes",
      assignee: "Keerthi",
      status: "todo",
      sprintId: 6,
      storyPoints: 8,
      techStack: ["React Native"]
    },
    {
      id: 17,
      title: "Deployment setup and production configuration",
      description: "Configure production environment and deployment pipeline",
      assignee: "Pure",
      status: "todo",
      sprintId: 6,
      storyPoints: 6,
      techStack: ["NodeJS", "SQL"]
    }
  ]);

  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterAssignee, setFilterAssignee] = useState<string>("all");

  const getStatusColor = (status: Task["status"]) => {
    const colors = {
      todo: "bg-secondary",
      in_progress: "bg-warning",
      completed: "bg-success",
      blocked: "bg-destructive",
    };
    return colors[status];
  };

  const getStatusIcon = (status: Task["status"]) => {
    if (status === "completed") {
      return <CheckCircle className="h-4 w-4 text-success" />;
    }
    return <Circle className="h-4 w-4 text-muted-foreground" />;
  };

  const getStatusLabel = (status: Task["status"]) => {
    const labels = {
      todo: "To Do",
      in_progress: "In Progress",
      completed: "Completed",
      blocked: "Blocked",
    };
    return labels[status];
  };

  const getAssigneeColor = (assignee: Task["assignee"]) => {
    const colors = {
      Keerthi: "bg-blue-500",
      Arpit: "bg-green-500",
      Pure: "bg-purple-500",
    };
    return colors[assignee];
  };

  const filteredTasks = tasks.filter(task => {
    const statusMatch = filterStatus === "all" || task.status === filterStatus;
    const assigneeMatch = filterAssignee === "all" || task.assignee === filterAssignee;
    return statusMatch && assigneeMatch;
  });

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === "completed").length,
    inProgress: tasks.filter(t => t.status === "in_progress").length,
    todo: tasks.filter(t => t.status === "todo").length,
  };

  const sprintNames = {
    1: "Sprint 1 - RN Setup",
    2: "Sprint 2 - UI & Categories", 
    3: "Sprint 3 - Backend & DB",
    4: "Sprint 4 - Data & Display",
    5: "Sprint 5 - Analytics",
    6: "Sprint 6 - Testing & Deploy"
  };

  return (
    <div className="space-y-6">
      {/* Task Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <Circle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskStats.total}</div>
            <p className="text-xs text-muted-foreground">Grocery Store App</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{taskStats.completed}</div>
            <p className="text-xs text-muted-foreground">Tasks done</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-warning-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning-foreground">{taskStats.inProgress}</div>
            <p className="text-xs text-muted-foreground">Active work</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">To Do</CardTitle>
            <Circle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskStats.todo}</div>
            <p className="text-xs text-muted-foreground">Remaining</p>
          </CardContent>
        </Card>
      </div>

      {/* Task Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Project Tasks - Grocery Store Mobile App</CardTitle>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterAssignee} onValueChange={setFilterAssignee}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Team</SelectItem>
                  <SelectItem value="Keerthi">Keerthi</SelectItem>
                  <SelectItem value="Arpit">Arpit</SelectItem>
                  <SelectItem value="Pure">Pure</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent> 
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start space-x-3 flex-1">
                  {getStatusIcon(task.status)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-medium text-sm">{task.title}</h3>
                      <Badge className={`${getStatusColor(task.status)} text-white text-xs`}>
                        {getStatusLabel(task.status)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span className={`inline-block w-2 h-2 rounded-full ${getAssigneeColor(task.assignee)}`}></span>
                        <span>{task.assignee}</span>
                      </div>
                      <span>SP: {task.storyPoints}</span>
                      <span>{sprintNames[task.sprintId as keyof typeof sprintNames]}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {task.techStack.map((tech, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskManager;