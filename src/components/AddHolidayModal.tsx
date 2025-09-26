import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface AddHolidayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddHolidayModal = ({ isOpen, onClose }: AddHolidayModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    date: undefined as Date | undefined,
    description: "",
  });
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!formData.name || !formData.date) {
      toast({
        title: "Error",
        description: "Please fill in holiday name and date",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would save to backend
    const holidayData = {
      name: formData.name,
      date: format(formData.date, "yyyy-MM-dd"),
      description: formData.description,
    };

    console.log("Adding holiday:", holidayData);
    
    toast({
      title: "Holiday Added",
      description: `${formData.name} has been added to the calendar`,
    });

    // Reset form and close modal
    setFormData({ name: "", date: undefined, description: "" });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Holiday</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="holiday-name">Holiday Name</Label>
            <Input
              id="holiday-name"
              placeholder="e.g., Christmas Day, Team Outing"
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
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="holiday-description">Description (Optional)</Label>
            <Input
              id="holiday-description"
              placeholder="Additional details about the holiday"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              Add Holiday
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddHolidayModal;