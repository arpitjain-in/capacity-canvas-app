import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import mockData from "@/data/mockData.json";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Users, Plus, Edit, Trash2, TrendingUp } from "lucide-react";

interface Engineer {
  id: number;
  name: string;
  role: string;
  capacity: number; // percentage (0-100)
  availableDays: number;
  allocatedDays: number;
}

const CapacityTracker = () => {
  const [engineers, setEngineers] = useState<Engineer[]>(mockData.engineers);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingEngineer, setEditingEngineer] = useState<Engineer | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    capacity: 100,
    availableDays: 10,
  });

  const totalCapacity = engineers.reduce((sum, eng) => sum + eng.capacity, 0) / engineers.length;
  const totalAvailableDays = engineers.reduce((sum, eng) => sum + eng.availableDays, 0);
  const totalAllocatedDays = engineers.reduce((sum, eng) => sum + eng.allocatedDays, 0);

  const getCapacityColor = (capacity: number) => {
    if (capacity >= 90) return "text-destructive";
    if (capacity >= 75) return "text-warning-foreground";
    return "text-success";
  };

  const getCapacityBgColor = (capacity: number) => {
    if (capacity >= 90) return "bg-destructive";
    if (capacity >= 75) return "bg-warning";
    return "bg-success";
  };

  const handleCreateEngineer = () => {
    if (!formData.name || !formData.role) return;

    const newEngineer: Engineer = {
      id: Date.now(),
      name: formData.name,
      role: formData.role,
      capacity: formData.capacity,
      availableDays: formData.availableDays,
      allocatedDays: (formData.availableDays * formData.capacity) / 100,
    };

    setEngineers([...engineers, newEngineer]);
    setFormData({ name: "", role: "", capacity: 100, availableDays: 10 });
    setIsCreateOpen(false);
  };

  const handleEditEngineer = (engineer: Engineer) => {
    setEditingEngineer(engineer);
    setFormData({
      name: engineer.name,
      role: engineer.role,
      capacity: engineer.capacity,
      availableDays: engineer.availableDays,
    });
  };

  const handleUpdateEngineer = () => {
    if (!editingEngineer || !formData.name || !formData.role) return;

    const updatedEngineers = engineers.map(engineer =>
      engineer.id === editingEngineer.id
        ? {
            ...engineer,
            name: formData.name,
            role: formData.role,
            capacity: formData.capacity,
            availableDays: formData.availableDays,
            allocatedDays: (formData.availableDays * formData.capacity) / 100,
          }
        : engineer
    );

    setEngineers(updatedEngineers);
    setEditingEngineer(null);
    setFormData({ name: "", role: "", capacity: 100, availableDays: 10 });
  };

  const handleDeleteEngineer = (id: number) => {
    setEngineers(engineers.filter(engineer => engineer.id !== id));
  };

  const EngineerForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          placeholder="e.g., John Doe"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Input
          id="role"
          placeholder="e.g., Senior Frontend Developer"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="capacity">Capacity (%)</Label>
          <Input
            id="capacity"
            type="number"
            min="0"
            max="100"
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="availableDays">Available Days</Label>
          <Input
            id="availableDays"
            type="number"
            min="0"
            max="20"
            value={formData.availableDays}
            onChange={(e) => setFormData({ ...formData, availableDays: Number(e.target.value) })}
          />
        </div>
      </div>

      <div className="p-3 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground">
          Allocated Days: <span className="font-medium">
            {((formData.availableDays * formData.capacity) / 100).toFixed(1)}
          </span>
        </p>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          variant="outline"
          onClick={() => {
            setIsCreateOpen(false);
            setEditingEngineer(null);
            setFormData({ name: "", role: "", capacity: 100, availableDays: 10 });
          }}
        >
          Cancel
        </Button>
        <Button onClick={editingEngineer ? handleUpdateEngineer : handleCreateEngineer}>
          {editingEngineer ? "Update Engineer" : "Add Engineer"}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Size</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{engineers.length}</div>
            <p className="text-xs text-muted-foreground">Total engineers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Capacity</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getCapacityColor(totalCapacity)}`}>
              {totalCapacity.toFixed(0)}%
            </div>
            <p className="text-xs text-muted-foreground">Team average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Days</CardTitle>
            <Badge variant="secondary">
              {totalAllocatedDays.toFixed(1)}/{totalAvailableDays}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAllocatedDays.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Allocated days</p>
          </CardContent>
        </Card>
      </div>

      {/* Engineer Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Team Capacity</CardTitle>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Engineer
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Engineer</DialogTitle>
                </DialogHeader>
                <EngineerForm />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {engineers.map((engineer) => (
              <div
                key={engineer.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-medium">{engineer.name}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {engineer.role}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Capacity</span>
                      <span className={`font-medium ${getCapacityColor(engineer.capacity)}`}>
                        {engineer.capacity}%
                      </span>
                    </div>
                    <Progress 
                      value={engineer.capacity} 
                      className="h-2"
                    />
                    
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Available: {engineer.availableDays} days</span>
                      <span>Allocated: {engineer.allocatedDays.toFixed(1)} days</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <Dialog 
                    open={editingEngineer?.id === engineer.id} 
                    onOpenChange={(open) => !open && setEditingEngineer(null)}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditEngineer(engineer)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Edit Engineer</DialogTitle>
                      </DialogHeader>
                      <EngineerForm />
                    </DialogContent>
                  </Dialog>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteEngineer(engineer.id)}
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
    </div>
  );
};

export default CapacityTracker;