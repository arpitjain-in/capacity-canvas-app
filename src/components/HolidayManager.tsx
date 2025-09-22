import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { CalendarIcon, Edit, Trash2, Plus, MapPin } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Holiday {
  id: number;
  name: string;
  date: string;
  type: "national" | "company" | "personal";
  description?: string;
  recurring: boolean;
}

const HolidayManager = () => {
  const [holidays, setHolidays] = useState<Holiday[]>([
    {
      id: 1,
      name: "New Year's Day",
      date: "2024-01-01",
      type: "national",
      description: "Federal holiday",
      recurring: true,
    },
    {
      id: 2,
      name: "Martin Luther King Jr. Day",
      date: "2024-01-15",
      type: "national",
      description: "Federal holiday",
      recurring: true,
    },
    {
      id: 3,
      name: "Company All-Hands",
      date: "2024-02-15",
      type: "company",
      description: "Quarterly all-hands meeting",
      recurring: false,
    },
    {
      id: 4,
      name: "Presidents Day",
      date: "2024-02-19",
      type: "national",
      description: "Federal holiday",
      recurring: true,
    },
  ]);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    date: undefined as Date | undefined,
    type: "national" as Holiday["type"],
    description: "",
    recurring: false,
  });

  const getTypeColor = (type: Holiday["type"]) => {
    const colors = {
      national: "bg-success",
      company: "bg-primary",
      personal: "bg-accent",
    };
    return colors[type];
  };

  const getTypeLabel = (type: Holiday["type"]) => {
    const labels = {
      national: "National",
      company: "Company",
      personal: "Personal",
    };
    return labels[type];
  };

  const handleCreateHoliday = () => {
    if (!formData.name || !formData.date) return;

    const newHoliday: Holiday = {
      id: Date.now(),
      name: formData.name,
      date: format(formData.date, "yyyy-MM-dd"),
      type: formData.type,
      description: formData.description,
      recurring: formData.recurring,
    };

    setHolidays([...holidays, newHoliday].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    ));
    
    setFormData({ 
      name: "", 
      date: undefined, 
      type: "national", 
      description: "", 
      recurring: false 
    });
    setIsCreateOpen(false);
  };

  const handleEditHoliday = (holiday: Holiday) => {
    setEditingHoliday(holiday);
    setFormData({
      name: holiday.name,
      date: new Date(holiday.date),
      type: holiday.type,
      description: holiday.description || "",
      recurring: holiday.recurring,
    });
  };

  const handleUpdateHoliday = () => {
    if (!editingHoliday || !formData.name || !formData.date) return;

    const updatedHolidays = holidays.map(holiday =>
      holiday.id === editingHoliday.id
        ? {
            ...holiday,
            name: formData.name,
            date: format(formData.date!, "yyyy-MM-dd"),
            type: formData.type,
            description: formData.description,
            recurring: formData.recurring,
          }
        : holiday
    );

    setHolidays(updatedHolidays.sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    ));
    
    setEditingHoliday(null);
    setFormData({ 
      name: "", 
      date: undefined, 
      type: "national", 
      description: "", 
      recurring: false 
    });
  };

  const handleDeleteHoliday = (id: number) => {
    setHolidays(holidays.filter(holiday => holiday.id !== id));
  };

  // Group holidays by month for better organization
  const groupedHolidays = holidays.reduce((groups, holiday) => {
    const month = new Date(holiday.date).toLocaleDateString("en-US", { 
      month: "long", 
      year: "numeric" 
    });
    if (!groups[month]) {
      groups[month] = [];
    }
    groups[month].push(holiday);
    return groups;
  }, {} as Record<string, Holiday[]>);

  const upcomingHolidays = holidays.filter(holiday => 
    new Date(holiday.date) >= new Date()
  ).slice(0, 5);

  const HolidayForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Holiday Name</Label>
        <Input
          id="name"
          placeholder="e.g., Independence Day"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !formData.date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.date ? format(formData.date, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={formData.date}
              onSelect={(date) => setFormData({ ...formData, date })}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label>Type</Label>
        <Select
          value={formData.type}
          onValueChange={(value: Holiday["type"]) => 
            setFormData({ ...formData, type: value })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="national">National Holiday</SelectItem>
            <SelectItem value="company">Company Holiday</SelectItem>
            <SelectItem value="personal">Personal Time Off</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Input
          id="description"
          placeholder="e.g., Federal holiday, Team building day"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="recurring"
          checked={formData.recurring}
          onChange={(e) => setFormData({ ...formData, recurring: e.target.checked })}
          className="rounded border-border"
        />
        <Label htmlFor="recurring" className="text-sm">
          Recurring yearly
        </Label>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          variant="outline"
          onClick={() => {
            setIsCreateOpen(false);
            setEditingHoliday(null);
            setFormData({ 
              name: "", 
              date: undefined, 
              type: "national", 
              description: "", 
              recurring: false 
            });
          }}
        >
          Cancel
        </Button>
        <Button onClick={editingHoliday ? handleUpdateHoliday : handleCreateHoliday}>
          {editingHoliday ? "Update Holiday" : "Add Holiday"}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Upcoming Holidays</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {upcomingHolidays.length > 0 ? (
              upcomingHolidays.map((holiday) => (
                <div key={holiday.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getTypeColor(holiday.type)}`}></div>
                    <div>
                      <h4 className="font-medium">{holiday.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(holiday.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <Badge className={`${getTypeColor(holiday.type)} text-white`}>
                    {getTypeLabel(holiday.type)}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-4">
                No upcoming holidays
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Holiday Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Holiday Calendar</CardTitle>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Holiday
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Holiday</DialogTitle>
                </DialogHeader>
                <HolidayForm />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(groupedHolidays).map(([month, monthHolidays]) => (
              <div key={month}>
                <h3 className="font-semibold text-lg mb-3 text-muted-foreground">
                  {month}
                </h3>
                <div className="space-y-3">
                  {monthHolidays.map((holiday) => (
                    <div
                      key={holiday.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-4 h-4 rounded-full ${getTypeColor(holiday.type)}`}></div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium">{holiday.name}</h4>
                            {holiday.recurring && (
                              <Badge variant="outline" className="text-xs">
                                Recurring
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <p>
                              {new Date(holiday.date).toLocaleDateString("en-US", {
                                weekday: "long",
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </p>
                            {holiday.description && <p>{holiday.description}</p>}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Badge className={`${getTypeColor(holiday.type)} text-white`}>
                          {getTypeLabel(holiday.type)}
                        </Badge>
                        
                        <Dialog 
                          open={editingHoliday?.id === holiday.id} 
                          onOpenChange={(open) => !open && setEditingHoliday(null)}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditHoliday(holiday)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Edit Holiday</DialogTitle>
                            </DialogHeader>
                            <HolidayForm />
                          </DialogContent>
                        </Dialog>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteHoliday(holiday.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HolidayManager;