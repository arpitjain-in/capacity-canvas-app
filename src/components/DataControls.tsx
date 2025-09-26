import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dataService } from "@/utils/dataService";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, Download, Upload } from "lucide-react";

const DataControls = () => {
  const { toast } = useToast();

  const resetData = () => {
    dataService.resetData();
    toast({
      title: "Data Reset",
      description: "All data has been reset to original values",
    });
    // Refresh the page to reload components with fresh data
    window.location.reload();
  };

  const exportData = () => {
    const data = {
      tasks: dataService.getTasks(),
      engineers: dataService.getEngineers(),
      sprints: dataService.getSprints(),
      stats: dataService.getStats()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'project-data.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "Data Exported",
      description: "Project data has been exported as JSON file",
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Data Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2">
          <Button onClick={resetData} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset Data
          </Button>
          <Button onClick={exportData} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Data persists in localStorage. Changes are automatically saved.
        </p>
      </CardContent>
    </Card>
  );
};

export default DataControls;