import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import mockData from "@/data/mockData.json";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Edit, Trash2, Plus } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Sprint {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  status: "planning" | "active" | "completed" | "blocked";
  workingDays: number;
}

const SprintManager = () => {
  const [sprints, setSprints] = useState<Sprint[]>(mockData.sprints as Sprint[]);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingSprint, setEditingSprint] = useState<Sprint | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    status: "planning" as Sprint["status"],
  });

  const getStatusColor = (status: Sprint["status"]) => {
    const colors = {
      planning: "bg-sprint-planning",
      active: "bg-sprint-active",
      completed: "bg-sprint-completed",
      blocked: "bg-sprint-blocked",
    };
    return colors[status];
  };

  const calculateWorkingDays = (start: Date, end: Date) => {
    let count = 0;
    const current = new Date(start);
    
    while (current <= end) {
      const dayOfWeek = current.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday or Saturday
        count++;
      }
      current.setDate(current.getDate() + 1);
    }
    
    return count;
  };

  const handleCreateSprint = () => {
    if (!formData.name || !formData.startDate || !formData.endDate) return;

    const newSprint: Sprint = {
      id: Date.now(),
      name: formData.name,
      startDate: format(formData.startDate, "yyyy-MM-dd"),
      endDate: format(formData.endDate, "yyyy-MM-dd"),
      status: formData.status,
      workingDays: calculateWorkingDays(formData.startDate, formData.endDate),
    };

    setSprints([...sprints, newSprint]);
    setFormData({ name: "", startDate: undefined, endDate: undefined, status: "planning" });
    setIsCreateOpen(false);
  };

  const handleEditSprint = (sprint: Sprint) => {
    setEditingSprint(sprint);
    setFormData({
      name: sprint.name,
      startDate: new Date(sprint.startDate),
      endDate: new Date(sprint.endDate),
      status: sprint.status,
    });
  };

  const handleUpdateSprint = () => {
    if (!editingSprint || !formData.name || !formData.startDate || !formData.endDate) return;

    const updatedSprints = sprints.map(sprint =>
      sprint.id === editingSprint.id
        ? {
            ...sprint,
            name: formData.name,
            startDate: format(formData.startDate!, "yyyy-MM-dd"),
            endDate: format(formData.endDate!, "yyyy-MM-dd"),
            status: formData.status,
            workingDays: calculateWorkingDays(formData.startDate!, formData.endDate!),
          }
        : sprint
    );

    setSprints(updatedSprints);
    setEditingSprint(null);
    setFormData({ name: "", startDate: undefined, endDate: undefined, status: "planning" });
  };

  const handleDeleteSprint = (id: number) => {
    setSprints(sprints.filter(sprint => sprint.id !== id));
  };

  const SprintForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Sprint Name</Label>
        <Input
          id="name"
          placeholder="e.g., Sprint 25 - Feature Development"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.startDate ? format(formData.startDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.startDate}
                onSelect={(date) => setFormData({ ...formData, startDate: date })}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>End Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.endDate ? format(formData.endDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.endDate}
                onSelect={(date) => setFormData({ ...formData, endDate: date })}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Status</Label>
        <Select
          value={formData.status}
          onValueChange={(value: Sprint["status"]) => 
            setFormData({ ...formData, status: value })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="planning">Planning</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="blocked">Blocked</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {formData.startDate && formData.endDate && (
        <div className="p-3 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            Working Days: <span className="font-medium">
              {calculateWorkingDays(formData.startDate, formData.endDate)}
            </span>
          </p>
        </div>
      )}

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          variant="outline"
          onClick={() => {
            setIsCreateOpen(false);
            setEditingSprint(null);
            setFormData({ name: "", startDate: undefined, endDate: undefined, status: "planning" });
          }}
        >
          Cancel
        </Button>
        <Button onClick={editingSprint ? handleUpdateSprint : handleCreateSprint}>
          {editingSprint ? "Update Sprint" : "Create Sprint"}
        </Button>
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Sprint Management</CardTitle>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Sprint
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Sprint</DialogTitle>
              </DialogHeader>
              <SprintForm />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sprints.map((sprint) => (
            <div
              key={sprint.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="font-medium">{sprint.name}</h3>
                  <Badge className={`${getStatusColor(sprint.status)} text-white`}>
                    {sprint.status}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>
                    {new Date(sprint.startDate).toLocaleDateString()} - {" "}
                    {new Date(sprint.endDate).toLocaleDateString()}
                  </p>
                  <p>Working Days: {sprint.workingDays}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Dialog 
                  open={editingSprint?.id === sprint.id} 
                  onOpenChange={(open) => !open && setEditingSprint(null)}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditSprint(sprint)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Edit Sprint</DialogTitle>
                    </DialogHeader>
                    <SprintForm />
                  </DialogContent>
                </Dialog>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteSprint(sprint.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SprintManager;