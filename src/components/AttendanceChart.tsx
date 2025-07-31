import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, BarChart3 } from 'lucide-react';

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

interface AttendanceChartProps {
  data: AttendanceData;
  result: AttendanceResult;
}

const AttendanceChart: React.FC<AttendanceChartProps> = ({ data, result }) => {
  const { totalClasses, attendedClasses, targetPercentage } = data;
  const { currentPercentage } = result;
  
  const missedClasses = totalClasses - attendedClasses;
  const attendedPercent = (attendedClasses / totalClasses) * 100;
  const missedPercent = (missedClasses / totalClasses) * 100;

  // Future projections
  const futureAttendanceScenarios = [
    { label: 'If you attend next 5 classes', classes: 5 },
    { label: 'If you attend next 10 classes', classes: 10 },
    { label: 'If you miss next 3 classes', classes: -3 },
    { label: 'If you miss next 5 classes', classes: -5 },
  ].map(scenario => {
    const newAttended = attendedClasses + Math.max(0, scenario.classes);
    const newTotal = totalClasses + Math.abs(scenario.classes);
    const newPercentage = (newAttended / newTotal) * 100;
    return {
      ...scenario,
      percentage: newPercentage,
      status: newPercentage >= targetPercentage ? 'safe' : 'danger'
    };
  });

  return (
    <Card className="bg-gradient-card shadow-card border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Visual Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Breakdown */}
        <div className="space-y-4">
          <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
            Current Breakdown
          </h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Classes Attended</span>
              <span className="font-medium">{attendedClasses} / {totalClasses}</span>
            </div>
            <div className="space-y-2">
              <Progress value={attendedPercent} className="h-2 bg-success-light">
                <div 
                  className="h-full bg-gradient-success rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${attendedPercent}%` }}
                />
              </Progress>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Attended: {attendedPercent.toFixed(1)}%</span>
                <span>Missed: {missedPercent.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* Target Line Visualization */}
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">Target: {targetPercentage}%</span>
              <span className="text-xs text-muted-foreground">
                {currentPercentage >= targetPercentage ? 'Above target' : 'Below target'}
              </span>
            </div>
            <div className="relative h-4 bg-muted rounded-full overflow-hidden">
              {/* Background progress */}
              <div 
                className="absolute inset-y-0 left-0 bg-gradient-primary rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${Math.min(currentPercentage, 100)}%` }}
              />
              
              {/* Target line */}
              <div 
                className="absolute inset-y-0 w-0.5 bg-destructive z-10"
                style={{ left: `${targetPercentage}%` }}
              />
              
              {/* Current percentage marker */}
              <div 
                className="absolute top-0 bottom-0 w-1 bg-foreground rounded-full z-20 transform -translate-x-0.5"
                style={{ left: `${Math.min(currentPercentage, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>0%</span>
              <span className="relative">
                {targetPercentage}%
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs bg-destructive text-destructive-foreground px-1 rounded">
                  Min
                </div>
              </span>
              <span>100%</span>
            </div>
          </div>
        </div>

        {/* Future Scenarios */}
        <div className="space-y-4">
          <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Future Scenarios
          </h4>
          
          <div className="grid gap-3">
            {futureAttendanceScenarios.map((scenario, index) => (
              <div 
                key={index}
                className={`p-3 rounded-lg border ${
                  scenario.status === 'safe' 
                    ? 'bg-success-light border-success/20' 
                    : 'bg-destructive-light border-destructive/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{scenario.label}</span>
                  <span className={`text-sm font-semibold ${
                    scenario.status === 'safe' ? 'text-success' : 'text-destructive'
                  }`}>
                    {scenario.percentage.toFixed(1)}%
                  </span>
                </div>
                <Progress 
                  value={Math.min(scenario.percentage, 100)} 
                  className="h-1.5"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{attendedClasses}</div>
            <div className="text-xs text-muted-foreground">Attended</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-destructive">{missedClasses}</div>
            <div className="text-xs text-muted-foreground">Missed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-warning">{targetPercentage}%</div>
            <div className="text-xs text-muted-foreground">Target</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${
              currentPercentage >= targetPercentage ? 'text-success' : 'text-destructive'
            }`}>
              {currentPercentage.toFixed(1)}%
            </div>
            <div className="text-xs text-muted-foreground">Current</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceChart;