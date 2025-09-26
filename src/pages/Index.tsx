import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Clock, Settings, ListTodo } from "lucide-react";
import mockData from "@/data/mockData.json";
import SprintCalendar from "@/components/SprintCalendar";
import SprintManager from "@/components/SprintManager";
import CapacityTracker from "@/components/CapacityTracker";
import HolidayManager from "@/components/HolidayManager";
import TaskManager from "@/components/TaskManager";
import DataControls from "@/components/DataControls";
import CreateSprintModal from "@/components/CreateSprintModal";
import AddHolidayModal from "@/components/AddHolidayModal";
import ManageTeamModal from "@/components/ManageTeamModal";

const Index = () => {
  const [activeTab, setActiveTab] = useState("calendar");
  
  // Modal states
  const [isCreateSprintOpen, setIsCreateSprintOpen] = useState(false);
  const [isAddHolidayOpen, setIsAddHolidayOpen] = useState(false);
  const [isManageTeamOpen, setIsManageTeamOpen] = useState(false);

  const mockStats = mockData.stats;
  const mockUpcomingSprints = mockData.upcomingSprints;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Calendar className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Sprint Planner</h1>
                <p className="text-sm text-muted-foreground">Manage your team's sprint planning</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sprints</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.totalSprints}</div>
              <p className="text-xs text-muted-foreground">This quarter</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Sprints</CardTitle>
              <Badge variant="default" className="bg-sprint-active text-white">Active</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.activeSprints}</div>
              <p className="text-xs text-muted-foreground">Currently running</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Size</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.totalEngineers}</div>
              <p className="text-xs text-muted-foreground">Engineers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Capacity</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.plannedCapacity}%</div>
              <p className="text-xs text-muted-foreground">Planned</p>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6 flex space-x-1 rounded-lg bg-muted p-1">
          {[
            { id: "calendar", label: "Calendar", icon: Calendar },
            { id: "sprints", label: "Sprints", icon: Clock },
            { id: "capacity", label: "Capacity", icon: Users },
            { id: "tasks", label: "Tasks", icon: ListTodo },
            { id: "holidays", label: "Holidays", icon: Settings },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(tab.id)}
              className="flex-1"
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Primary Content */}
          <div className="lg:col-span-2">
            {activeTab === "calendar" && <SprintCalendar />}
            {activeTab === "sprints" && <SprintManager />}
            {activeTab === "capacity" && <CapacityTracker />}
            {activeTab === "tasks" && (
              <div>
                <DataControls />
                <TaskManager />
              </div>
            )}
            {activeTab === "holidays" && <HolidayManager />}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Sprints */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upcoming Sprints</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockUpcomingSprints.map((sprint) => (
                  <div key={sprint.id} className="rounded-lg border p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{sprint.name}</h4>
                      <Badge 
                        variant={sprint.status === "active" ? "default" : "secondary"}
                        className={sprint.status === "active" ? "bg-sprint-active" : "bg-sprint-planning"}
                      >
                        {sprint.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>Start: {new Date(sprint.startDate).toLocaleDateString()}</p>
                      <p>Working Days: {sprint.workingDays}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full" 
                  size="sm"
                  onClick={() => setIsCreateSprintOpen(true)}
                >
                  Create New Sprint
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  size="sm"
                  onClick={() => setIsAddHolidayOpen(true)}
                >
                  Add Holiday
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  size="sm"
                  onClick={() => setIsManageTeamOpen(true)}
                >
                  Manage Team
                </Button>
              </CardContent>
            </Card>
        </div>
      </div>

      {/* Modals */}
      <CreateSprintModal 
        isOpen={isCreateSprintOpen} 
        onClose={() => setIsCreateSprintOpen(false)} 
      />
      <AddHolidayModal 
        isOpen={isAddHolidayOpen} 
        onClose={() => setIsAddHolidayOpen(false)} 
      />
      <ManageTeamModal 
        isOpen={isManageTeamOpen} 
        onClose={() => setIsManageTeamOpen(false)} 
      />
    </div>
    </div>
  );
};

export default Index;