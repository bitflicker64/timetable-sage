import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from '@/components/Navbar';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Download,
  AlertCircle,
  Users,
  BookOpen,
  UserCheck
} from 'lucide-react';

interface ImportResult {
  success: boolean;
  total: number;
  created: number;
  failed: number;
  errors: Array<{
    row: number;
    data: any;
    error: string;
  }>;
}

const ImportData = () => {
  const [uploading, setUploading] = useState<{ [key: string]: boolean }>({});
  const [results, setResults] = useState<{ [key: string]: ImportResult }>({});
  const { toast } = useToast();

  const importTypes = [
    {
      id: 'students',
      title: 'Import Students',
      description: 'Upload student data with roll numbers, names, and program details',
      icon: Users,
      color: 'text-blue-500',
      sampleColumns: ['name', 'roll_number', 'email', 'current_semester']
    },
    {
      id: 'faculty',
      title: 'Import Faculty',
      description: 'Upload faculty information including departments and employee IDs',
      icon: UserCheck,
      color: 'text-green-500',
      sampleColumns: ['name', 'employee_id', 'email', 'department']
    },
    {
      id: 'courses',
      title: 'Import Courses',
      description: 'Upload course details with codes, credits, and semester information',
      icon: BookOpen,
      color: 'text-purple-500',
      sampleColumns: ['name', 'code', 'credits', 'semester', 'semester_type']
    }
  ];

  const handleFileUpload = async (importType: string, file: File) => {
    setUploading(prev => ({ ...prev, [importType]: true }));
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      const { data, error } = await supabase.functions.invoke('csv-import', {
        body: formData,
        headers: {
          // Let the browser set the Content-Type for multipart/form-data
        }
      });

      if (error) throw error;

      setResults(prev => ({ ...prev, [importType]: data }));

      if (data.success) {
        toast({
          title: "Import Successful",
          description: `Successfully imported ${data.created} ${importType}`
        });
      } else {
        toast({
          variant: "destructive",
          title: "Import Completed with Errors",
          description: `${data.created} succeeded, ${data.failed} failed`
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Import Failed",
        description: error.message || "An error occurred during import"
      });
    } finally {
      setUploading(prev => ({ ...prev, [importType]: false }));
    }
  };

  const downloadSampleCSV = (importType: string) => {
    const sampleData = {
      students: [
        { name: 'John Doe', roll_number: '2021CSE001', email: 'john.doe@example.com', current_semester: 3 },
        { name: 'Jane Smith', roll_number: '2021CSE002', email: 'jane.smith@example.com', current_semester: 3 }
      ],
      faculty: [
        { name: 'Dr. Alice Johnson', employee_id: 'FAC001', email: 'alice.johnson@university.edu', department: 'Computer Science' },
        { name: 'Prof. Bob Wilson', employee_id: 'FAC002', email: 'bob.wilson@university.edu', department: 'Computer Science' }
      ],
      courses: [
        { name: 'Data Structures and Algorithms', code: 'CSE201', credits: 4, semester: 3, semester_type: 'odd' },
        { name: 'Database Management Systems', code: 'CSE301', credits: 3, semester: 5, semester_type: 'odd' }
      ]
    };

    const data = sampleData[importType as keyof typeof sampleData];
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => row[header as keyof typeof row]).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sample_${importType}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const ImportCard = ({ importConfig }: { importConfig: typeof importTypes[0] }) => {
    const result = results[importConfig.id];
    const isUploading = uploading[importConfig.id];

    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <importConfig.icon className={`h-5 w-5 ${importConfig.color}`} />
            {importConfig.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {importConfig.description}
          </p>
          
          <div className="flex flex-wrap gap-2">
            {importConfig.sampleColumns.map(col => (
              <Badge key={col} variant="outline" className="text-xs">
                {col}
              </Badge>
            ))}
          </div>

          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="file"
                accept=".csv"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(importConfig.id, file);
                }}
                className="hidden"
                id={`file-${importConfig.id}`}
              />
              <Button
                onClick={() => document.getElementById(`file-${importConfig.id}`)?.click()}
                disabled={isUploading}
                className="flex-1"
              >
                {isUploading ? (
                  <>
                    <AlertCircle className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload CSV
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                onClick={() => downloadSampleCSV(importConfig.id)}
                size="icon"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>

            {result && (
              <div className="p-3 rounded-lg bg-muted">
                <div className="flex items-center gap-2 mb-2">
                  {result.success ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-sm font-medium">
                    Import {result.success ? 'Successful' : 'Completed with Errors'}
                  </span>
                </div>
                
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>Total: {result.total} | Created: {result.created} | Failed: {result.failed}</div>
                  
                  {result.errors.length > 0 && (
                    <div className="mt-2">
                      <p className="font-medium">Errors:</p>
                      <div className="max-h-32 overflow-y-auto space-y-1">
                        {result.errors.slice(0, 3).map((error, index) => (
                          <div key={index} className="text-xs bg-red-50 p-2 rounded">
                            Row {error.row}: {error.error}
                          </div>
                        ))}
                        {result.errors.length > 3 && (
                          <div className="text-xs text-muted-foreground">
                            ... and {result.errors.length - 3} more errors
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Import Data</h1>
            <p className="text-muted-foreground mt-2">
              Upload CSV files to bulk import students, faculty, and courses
            </p>
          </div>
        </div>

        {/* Instructions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              CSV Import Instructions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">File Format Requirements:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Use CSV format with comma separators</li>
                  <li>• First row must contain column headers</li>
                  <li>• Ensure all required fields are present</li>
                  <li>• Use UTF-8 encoding for special characters</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Tips for Success:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Download sample templates first</li>
                  <li>• Check for duplicate entries</li>
                  <li>• Validate email formats</li>
                  <li>• Review error messages if import fails</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Import Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {importTypes.map(importConfig => (
            <ImportCard key={importConfig.id} importConfig={importConfig} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default ImportData;