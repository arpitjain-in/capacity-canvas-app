import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import mockData from "@/data/mockData.json";
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
  const [tasks] = useState<Task[]>(mockData.tasks as Task[]);

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

  const sprintNames = mockData.sprintNames;

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
                      <span>{sprintNames[task.sprintId.toString() as keyof typeof sprintNames]}</span>
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