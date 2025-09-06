import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from '@/components/Navbar';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Play, 
  Square, 
  Calendar, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Settings,
  Zap,
  RefreshCw,
  FileText,
  Download
} from 'lucide-react';

interface GenerationJob {
  job_id: string;
  success: boolean;
  message: string;
  scheduled_classes?: any[];
  conflicts?: any[];
  diagnostics?: string[];
}

const GenerateConsole = () => {
  const [generating, setGenerating] = useState(false);
  const [currentJob, setCurrentJob] = useState<GenerationJob | null>(null);
  const [settings, setSettings] = useState({
    semester: 3,
    semester_type: 'odd' as 'odd' | 'even' | 'summer',
    academic_year: 2024,
    dry_run: true
  });
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (generating) return;
    
    setGenerating(true);
    setCurrentJob(null);

    try {
      const { data, error } = await supabase.functions.invoke('generate-timetable', {
        body: settings
      });

      if (error) throw error;

      setCurrentJob(data);

      if (data.success) {
        toast({
          title: "Generation Successful",
          description: data.message
        });
      } else {
        toast({
          variant: "destructive",
          title: "Generation Issues",
          description: `${data.message}. Check diagnostics for details.`
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: error.message || "An error occurred during generation"
      });
    } finally {
      setGenerating(false);
    }
  };

  const exportResults = () => {
    if (!currentJob) return;

    const exportData = {
      job_id: currentJob.job_id,
      settings,
      results: {
        success: currentJob.success,
        message: currentJob.message,
        scheduled_classes_count: currentJob.scheduled_classes?.length || 0,
        conflicts_count: currentJob.conflicts?.length || 0,
        diagnostics: currentJob.diagnostics || []
      },
      scheduled_classes: currentJob.scheduled_classes || [],
      conflicts: currentJob.conflicts || []
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `timetable_generation_${currentJob.job_id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Generate Console</h1>
            <p className="text-muted-foreground mt-2">
              AI-powered timetable generation with constraint optimization
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Generation Settings */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Generation Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="semester">Semester</Label>
                  <Input
                    id="semester"
                    type="number"
                    min="1"
                    max="8"
                    value={settings.semester}
                    onChange={(e) => setSettings(prev => ({ 
                      ...prev, 
                      semester: parseInt(e.target.value) 
                    }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="semester_type">Semester Type</Label>
                  <select
                    id="semester_type"
                    className="w-full p-2 border border-input rounded-md bg-background"
                    value={settings.semester_type}
                    onChange={(e) => setSettings(prev => ({ 
                      ...prev, 
                      semester_type: e.target.value as 'odd' | 'even' | 'summer'
                    }))}
                  >
                    <option value="odd">Odd Semester</option>
                    <option value="even">Even Semester</option>
                    <option value="summer">Summer Semester</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="academic_year">Academic Year</Label>
                  <Input
                    id="academic_year"
                    type="number"
                    min="2020"
                    max="2030"
                    value={settings.academic_year}
                    onChange={(e) => setSettings(prev => ({ 
                      ...prev, 
                      academic_year: parseInt(e.target.value) 
                    }))}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="dry_run"
                    checked={settings.dry_run}
                    onChange={(e) => setSettings(prev => ({ 
                      ...prev, 
                      dry_run: e.target.checked 
                    }))}
                  />
                  <Label htmlFor="dry_run">Dry Run (Preview Only)</Label>
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={generating}
                  className="w-full"
                  size="lg"
                >
                  {generating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Generate Timetable
                    </>
                  )}
                </Button>

                {settings.dry_run && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-700">
                      <Clock className="h-3 w-3 inline mr-1" />
                      Dry run mode: No changes will be saved to the database
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Generation Results */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Generation Results
                  {currentJob && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={exportResults}
                      className="ml-auto"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Export
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!currentJob ? (
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Click "Generate Timetable" to start the scheduling process
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Job Summary */}
                    <div className="flex items-center gap-4">
                      {currentJob.success ? (
                        <CheckCircle className="h-6 w-6 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-6 w-6 text-yellow-500" />
                      )}
                      <div>
                        <p className="font-medium">{currentJob.message}</p>
                        <p className="text-sm text-muted-foreground">
                          Job ID: {currentJob.job_id}
                        </p>
                      </div>
                    </div>

                    {/* Statistics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">
                          {currentJob.scheduled_classes?.length || 0}
                        </p>
                        <p className="text-xs text-muted-foreground">Scheduled Classes</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-red-600">
                          {currentJob.conflicts?.length || 0}
                        </p>
                        <p className="text-xs text-muted-foreground">Conflicts</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">
                          {currentJob.diagnostics?.length || 0}
                        </p>
                        <p className="text-xs text-muted-foreground">Diagnostics</p>
                      </div>
                      <div className="text-center">
                        <Badge variant={currentJob.success ? "default" : "destructive"}>
                          {currentJob.success ? "Success" : "Issues"}
                        </Badge>
                      </div>
                    </div>

                    {/* Diagnostics */}
                    {currentJob.diagnostics && currentJob.diagnostics.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Diagnostics
                        </h4>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {currentJob.diagnostics.map((diagnostic, index) => (
                            <div key={index} className="p-2 bg-muted rounded text-sm">
                              {diagnostic}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Conflicts */}
                    {currentJob.conflicts && currentJob.conflicts.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          Conflicts Detected
                        </h4>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {currentJob.conflicts.map((conflict, index) => (
                            <div key={index} className="p-2 bg-red-50 rounded text-sm border border-red-200">
                              {JSON.stringify(conflict)}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-4 border-t">
                      <Button
                        variant="outline"
                        onClick={() => window.location.href = '/timetable-view'}
                        disabled={!currentJob.success || !currentJob.scheduled_classes?.length}
                      >
                        View Timetable
                      </Button>
                      {settings.dry_run && currentJob.success && (
                        <Button
                          onClick={() => {
                            setSettings(prev => ({ ...prev, dry_run: false }));
                            handleGenerate();
                          }}
                        >
                          Apply Changes
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GenerateConsole;