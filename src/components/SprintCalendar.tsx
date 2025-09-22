import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

const SprintCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Mock data for sprints and holidays
  const mockSprints = [
    { id: 1, name: "Sprint 23", startDate: "2024-01-15", status: "planning" },
    { id: 2, name: "Sprint 24", startDate: "2024-01-29", status: "active" },
  ];

  const mockHolidays = [
    { date: "2024-01-01", name: "New Year's Day" },
    { date: "2024-01-15", name: "MLK Day" },
  ];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
    setCurrentDate(newDate);
  };

  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  };

  const getEventsForDate = (year: number, month: number, day: number) => {
    const dateStr = formatDate(year, month, day);
    const sprints = mockSprints.filter(sprint => sprint.startDate === dateStr);
    const holidays = mockHolidays.filter(holiday => holiday.date === dateStr);
    return { sprints, holidays };
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const monthYear = currentDate.toLocaleDateString("en-US", { 
    month: "long", 
    year: "numeric" 
  });

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const calendarDays = [];

  // Empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Sprint Calendar</CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-lg font-medium min-w-[180px] text-center">
              {monthYear}
            </span>
            <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button size="sm" className="ml-4">
              <Plus className="h-4 w-4 mr-2" />
              Add Sprint
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-4">
          {dayNames.map((dayName) => (
            <div
              key={dayName}
              className="p-2 text-center text-sm font-medium text-muted-foreground border-b"
            >
              {dayName}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            if (day === null) {
              return <div key={index} className="aspect-square p-2"></div>;
            }

            const today = new Date();
            const isToday = 
              day === today.getDate() &&
              currentDate.getMonth() === today.getMonth() &&
              currentDate.getFullYear() === today.getFullYear();

            const dayOfWeek = (firstDay + day - 1) % 7;
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

            const events = getEventsForDate(
              currentDate.getFullYear(),
              currentDate.getMonth(),
              day
            );

            return (
              <div
                key={day}
                className={`
                  aspect-square p-2 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors
                  ${isToday ? "bg-calendar-today/10 border-calendar-today" : ""}
                  ${isWeekend ? "bg-calendar-weekend" : ""}
                  ${events.holidays.length > 0 ? "bg-calendar-holiday" : ""}
                `}
              >
                <div className="flex flex-col h-full">
                  <span
                    className={`
                      text-sm font-medium mb-1
                      ${isToday ? "text-calendar-today font-bold" : ""}
                      ${isWeekend ? "text-muted-foreground" : ""}
                    `}
                  >
                    {day}
                  </span>
                  
                  <div className="flex flex-col space-y-1 flex-1">
                    {events.sprints.map((sprint) => (
                      <Badge
                        key={sprint.id}
                        variant="secondary"
                        className={`
                          text-xs px-1 py-0 truncate
                          ${sprint.status === "active" ? "bg-sprint-active text-white" : ""}
                          ${sprint.status === "planning" ? "bg-sprint-planning text-white" : ""}
                        `}
                      >
                        {sprint.name}
                      </Badge>
                    ))}
                    
                    {events.holidays.map((holiday, idx) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="text-xs px-1 py-0 bg-success text-white truncate"
                      >
                        {holiday.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-sprint-planning"></div>
            <span className="text-sm text-muted-foreground">Planning</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-sprint-active"></div>
            <span className="text-sm text-muted-foreground">Active</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-success"></div>
            <span className="text-sm text-muted-foreground">Holiday</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-calendar-today"></div>
            <span className="text-sm text-muted-foreground">Today</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SprintCalendar;