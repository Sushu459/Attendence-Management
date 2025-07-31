import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Target, Calendar, Zap } from 'lucide-react';

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

interface AttendanceInsightsProps {
  data: AttendanceData;
  result: AttendanceResult;
}

const AttendanceInsights: React.FC<AttendanceInsightsProps> = ({ data, result }) => {
  const { totalClasses, attendedClasses, targetPercentage } = data;
  const { currentPercentage, status, classesToAttend, classesToBunk } = result;

  // Generate personalized insights
  const insights = [];

  // Basic status insight
  if (status === 'safe') {
    insights.push({
      icon: <Zap className="h-4 w-4" />,
      title: "Excellent Attendance!",
      description: `You're ${(currentPercentage - targetPercentage).toFixed(1)}% above the minimum requirement.`,
      type: 'success'
    });
  } else if (status === 'warning') {
    insights.push({
      icon: <Target className="h-4 w-4" />,
      title: "Close to Minimum",
      description: "You're approaching the minimum attendance threshold. Be careful!",
      type: 'warning'
    });
  } else {
    insights.push({
      icon: <Target className="h-4 w-4" />,
      title: "Critical Situation",
      description: "Immediate action required to avoid attendance shortage.",
      type: 'danger'
    });
  }

  // Strategic insights
  if (classesToAttend > 0) {
    const weeksNeeded = Math.ceil(classesToAttend / 5); // Assuming 5 classes per week
    insights.push({
      icon: <Calendar className="h-4 w-4" />,
      title: "Strategic Plan",
      description: `Attend all classes for the next ${weeksNeeded} week${weeksNeeded > 1 ? 's' : ''} to reach your target.`,
      type: 'info'
    });
  }

  if (classesToBunk > 0 && status === 'safe') {
    insights.push({
      icon: <Lightbulb className="h-4 w-4" />,
      title: "Flexibility Buffer",
      description: `You have a buffer of ${classesToBunk} classes. Use wisely for emergencies or planned leaves.`,
      type: 'success'
    });
  }

  // Custom target insights
  const customTargets = [80, 85, 90, 95].filter(target => target > targetPercentage);
  const targetInsights = customTargets.slice(0, 2).map(target => {
    const classesNeeded = Math.max(0, Math.ceil(
      (target * totalClasses - 100 * attendedClasses) / (100 - target)
    ));
    
    return {
      icon: <Target className="h-4 w-4" />,
      title: `Reach ${target}% Attendance`,
      description: classesNeeded > 0 
        ? `Attend ${classesNeeded} more classes to achieve ${target}% attendance.`
        : `You've already achieved ${target}% target!`,
      type: classesNeeded > 0 ? 'info' : 'success'
    };
  });

  insights.push(...targetInsights);

  // Efficiency insights
  const attendanceRate = attendedClasses / totalClasses;
  if (attendanceRate > 0.9) {
    insights.push({
      icon: <Zap className="h-4 w-4" />,
      title: "Consistent Performer",
      description: "Your attendance pattern shows excellent consistency. Keep it up!",
      type: 'success'
    });
  } else if (attendanceRate < 0.6) {
    insights.push({
      icon: <Lightbulb className="h-4 w-4" />,
      title: "Improvement Opportunity",
      description: "Consider setting daily reminders or study group commitments to improve attendance.",
      type: 'info'
    });
  }

  const getInsightStyle = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-success-light border-success/20';
      case 'warning':
        return 'bg-warning-light border-warning/20';
      case 'danger':
        return 'bg-destructive-light border-destructive/20';
      default:
        return 'bg-muted border-border';
    }
  };

  const getInsightIconColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'danger':
        return 'text-destructive';
      default:
        return 'text-primary';
    }
  };

  return (
    <Card className="bg-gradient-card shadow-card border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          Smart Insights & Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          {insights.map((insight, index) => (
            <div 
              key={index}
              className={`p-4 rounded-lg border ${getInsightStyle(insight.type)}`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 ${getInsightIconColor(insight.type)}`}>
                  {insight.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm mb-1">{insight.title}</h4>
                  <p className="text-sm text-muted-foreground">{insight.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Action Recommendations */}
        <div className="mt-6 pt-4 border-t">
          <h4 className="font-semibold text-sm mb-3 uppercase tracking-wide text-muted-foreground">
            Quick Actions
          </h4>
          <div className="flex flex-wrap gap-2">
            {status !== 'safe' && (
              <Badge variant="destructive" className="text-xs">
                Attend next {Math.min(classesToAttend, 5)} classes
              </Badge>
            )}
            {currentPercentage > 80 && (
              <Badge variant="default" className="text-xs">
                Maintain consistency
              </Badge>
            )}
            {currentPercentage < 70 && (
              <Badge variant="secondary" className="text-xs">
                Set daily reminders
              </Badge>
            )}
            <Badge variant="outline" className="text-xs">
              Track weekly progress
            </Badge>
          </div>
        </div>

        {/* Attendance Breakdown */}
        <div className="mt-6 pt-4 border-t">
          <h4 className="font-semibold text-sm mb-3 uppercase tracking-wide text-muted-foreground">
            Detailed Breakdown
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-lg font-bold text-success">{attendedClasses}</div>
              <div className="text-xs text-muted-foreground">Classes Attended</div>
            </div>
            <div className="space-y-1">
              <div className="text-lg font-bold text-destructive">{totalClasses - attendedClasses}</div>
              <div className="text-xs text-muted-foreground">Classes Missed</div>
            </div>
            <div className="space-y-1">
              <div className="text-lg font-bold text-primary">{currentPercentage.toFixed(1)}%</div>
              <div className="text-xs text-muted-foreground">Current %</div>
            </div>
            <div className="space-y-1">
              <div className="text-lg font-bold text-warning">{(100 - currentPercentage).toFixed(1)}%</div>
              <div className="text-xs text-muted-foreground">Missed %</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceInsights;