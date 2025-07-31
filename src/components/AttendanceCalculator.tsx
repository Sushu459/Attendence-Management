import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calculator, RotateCcw, BookOpen, Target, TrendingUp, AlertTriangle, CheckCircle, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AttendanceChart from './AttendanceChart';
import AttendanceInsights from './AttendanceInsights';
import ExportDialog from './ExportDialog';

interface AttendanceData {
  totalClasses: number;
  attendedClasses: number;
  targetPercentage: number;
}

interface AttendanceResult {
  currentPercentage: number;
  status: 'safe' | 'warning' | 'danger';
  classesToAttend: number;
  classesToBunk: number;
  message: string;
}

const AttendanceCalculator = () => {
  const [data, setData] = useState<AttendanceData>({
    totalClasses: 0,
    attendedClasses: 0,
    targetPercentage: 75
  });
  
  const [result, setResult] = useState<AttendanceResult | null>(null);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const { toast } = useToast();

  const calculateAttendance = useCallback(() => {
    const { totalClasses, attendedClasses, targetPercentage } = data;

    if (totalClasses <= 0) {
      toast({
        title: "Invalid Input",
        description: "Total classes must be greater than 0",
        variant: "destructive"
      });
      return;
    }

    if (attendedClasses > totalClasses) {
      toast({
        title: "Invalid Input", 
        description: "Attended classes cannot exceed total classes",
        variant: "destructive"
      });
      return;
    }

    const currentPercentage = (attendedClasses / totalClasses) * 100;
    
    // Calculate classes needed to reach target
    const classesToAttend = Math.max(0, Math.ceil(
      (targetPercentage * totalClasses - 100 * attendedClasses) / (100 - targetPercentage)
    ));

    // Calculate classes that can be bunked while maintaining target
    const maxMissableClasses = Math.floor(
      (attendedClasses - (targetPercentage / 100) * totalClasses) / (targetPercentage / 100)
    );
    const classesToBunk = Math.max(0, maxMissableClasses);

    let status: 'safe' | 'warning' | 'danger';
    let message: string;

    if (currentPercentage >= targetPercentage) {
      status = 'safe';
      message = `Great! You're ${(currentPercentage - targetPercentage).toFixed(1)}% above target. Safe to bunk ${classesToBunk} classes.`;
    } else if (currentPercentage >= targetPercentage - 5) {
      status = 'warning';
      message = `Close to minimum! Attend ${classesToAttend} more classes to reach ${targetPercentage}%.`;
    } else {
      status = 'danger';
      message = `Critical! You need to attend ${classesToAttend} more classes to avoid condonation.`;
    }

    setResult({
      currentPercentage,
      status,
      classesToAttend,
      classesToBunk,
      message
    });

    toast({
      title: "Calculation Complete",
      description: `Current attendance: ${currentPercentage.toFixed(1)}%`,
    });
  }, [data, toast]);

  const resetCalculator = () => {
    setData({ totalClasses: 0, attendedClasses: 0, targetPercentage: 75 });
    setResult(null);
    toast({
      title: "Calculator Reset",
      description: "All fields have been cleared",
    });
  };

  const updateData = (field: keyof AttendanceData, value: string) => {
    const numValue = parseInt(value) || 0;
    setData(prev => ({ ...prev, [field]: numValue }));
  };

  const getStatusIcon = () => {
    if (!result) return <Calculator className="h-5 w-5" />;
    
    switch (result.status) {
      case 'safe':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      case 'danger':
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
      default:
        return <Calculator className="h-5 w-5" />;
    }
  };

  const getStatusBadgeVariant = () => {
    if (!result) return 'secondary';
    
    switch (result.status) {
      case 'safe':
        return 'default';
      case 'warning':
        return 'secondary';
      case 'danger':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Student Attendance Calculator
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Plan your attendance to stay above the 75% minimum requirement
          </p>
        </div>

        {/* Input Card */}
        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Input Your Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="total-classes">Total Classes Held *</Label>
                <Input
                  id="total-classes"
                  type="number"
                  min="1"
                  placeholder="e.g., 50"
                  value={data.totalClasses || ''}
                  onChange={(e) => updateData('totalClasses', e.target.value)}
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="attended-classes">Classes Attended *</Label>
                <Input
                  id="attended-classes"
                  type="number"
                  min="0"
                  placeholder="e.g., 40"
                  value={data.attendedClasses || ''}
                  onChange={(e) => updateData('attendedClasses', e.target.value)}
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="target-percentage">Target Percentage</Label>
                <Input
                  id="target-percentage"
                  type="number"
                  min="1"
                  max="100"
                  placeholder="75"
                  value={data.targetPercentage || ''}
                  onChange={(e) => updateData('targetPercentage', e.target.value)}
                  className="h-12"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={calculateAttendance} 
                className="flex-1" 
                variant="hero" 
                size="lg"
                disabled={!data.totalClasses || !data.attendedClasses}
              >
                <Calculator className="h-4 w-4" />
                Calculate Attendance
              </Button>
              <Button 
                onClick={resetCalculator} 
                variant="reset" 
                size="lg"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
              {result && (
                <Button 
                  onClick={() => setIsExportDialogOpen(true)} 
                  variant="outline" 
                  size="lg"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <div className="space-y-6 animate-slide-up">
            {/* Status Card */}
            <Card className="bg-gradient-card shadow-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon()}
                    Current Status
                  </div>
                  <Badge variant={getStatusBadgeVariant()}>
                    {result.currentPercentage.toFixed(1)}%
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Attendance Progress</span>
                    <span>{result.currentPercentage.toFixed(1)}%</span>
                  </div>
                  <Progress 
                    value={result.currentPercentage} 
                    className="h-3"
                  />
                </div>
                
                <div className={`p-4 rounded-lg border-l-4 ${
                  result.status === 'safe' ? 'bg-success-light border-success' :
                  result.status === 'warning' ? 'bg-warning-light border-warning' :
                  'bg-destructive-light border-destructive'
                }`}>
                  <p className="font-medium">{result.message}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.status !== 'safe' && result.classesToAttend > 0 && (
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="text-sm font-medium">Classes to attend:</span>
                      <Badge variant="secondary">{result.classesToAttend}</Badge>
                    </div>
                  )}
                  {result.status === 'safe' && result.classesToBunk > 0 && (
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="text-sm font-medium">Safe to bunk:</span>
                      <Badge variant="default">{result.classesToBunk}</Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Chart */}
            <AttendanceChart data={data} result={result} />
            
            {/* Insights */}
            <AttendanceInsights data={data} result={result} />
          </div>
        )}

        {/* Export Dialog */}
        <ExportDialog
          open={isExportDialogOpen}
          onOpenChange={setIsExportDialogOpen}
          data={data}
          result={result}
        />
      </div>
    </div>
  );
};

export default AttendanceCalculator;