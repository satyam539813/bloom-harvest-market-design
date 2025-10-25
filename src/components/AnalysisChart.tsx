import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Activity, AlertCircle, Leaf, Target } from 'lucide-react';

interface AnalysisData {
  name: string;
  score: number;
  color: string;
  icon: React.ReactNode;
}

interface AnalysisChartProps {
  analysisText: string;
}

const AnalysisChart = ({ analysisText }: AnalysisChartProps) => {
  const [chartData, setChartData] = useState<AnalysisData[]>([]);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    // Parse the analysis text to extract scores
    const data: AnalysisData[] = [];
    const lines = analysisText.split('\n');
    
    lines.forEach(line => {
      const trimmed = line.trim().toLowerCase();
      
      // Extract crop health metrics with scoring
      if (trimmed.includes('crop type') || trimmed.includes('1)')) {
        const hasIssue = trimmed.includes('unable') || trimmed.includes('demo');
        data.push({
          name: 'Crop Type',
          score: hasIssue ? 40 : 85,
          color: 'hsl(var(--chart-1))',
          icon: <Leaf className="h-4 w-4" />
        });
      }
      if (trimmed.includes('health status') || trimmed.includes('2)')) {
        const isHealthy = trimmed.includes('healthy') || trimmed.includes('good');
        const hasIssue = trimmed.includes('unable') || trimmed.includes('demo') || trimmed.includes('poor');
        data.push({
          name: 'Health',
          score: hasIssue ? 45 : isHealthy ? 90 : 65,
          color: 'hsl(var(--chart-2))',
          icon: <Activity className="h-4 w-4" />
        });
      }
      if (trimmed.includes('growth stage') || trimmed.includes('3)')) {
        const hasMature = trimmed.includes('mature') || trimmed.includes('ready');
        const hasIssue = trimmed.includes('unable') || trimmed.includes('demo');
        data.push({
          name: 'Growth',
          score: hasIssue ? 50 : hasMature ? 95 : 70,
          color: 'hsl(var(--chart-3))',
          icon: <TrendingUp className="h-4 w-4" />
        });
      }
      if (trimmed.includes('visible issues') || trimmed.includes('4)')) {
        const hasIssues = trimmed.includes('pest') || trimmed.includes('disease') || trimmed.includes('damage');
        const noIssues = trimmed.includes('none') || trimmed.includes('no issues');
        data.push({
          name: 'Condition',
          score: noIssues ? 95 : hasIssues ? 45 : 60,
          color: 'hsl(var(--chart-4))',
          icon: <AlertCircle className="h-4 w-4" />
        });
      }
      if (trimmed.includes('recommendations') || trimmed.includes('5)')) {
        data.push({
          name: 'Action',
          score: 75,
          color: 'hsl(var(--chart-5))',
          icon: <Target className="h-4 w-4" />
        });
      }
    });

    // If no data parsed, create default demo data
    if (data.length === 0) {
      data.push(
        { name: 'Crop Type', score: 40, color: 'hsl(var(--chart-1))', icon: <Leaf className="h-4 w-4" /> },
        { name: 'Health', score: 45, color: 'hsl(var(--chart-2))', icon: <Activity className="h-4 w-4" /> },
        { name: 'Growth', score: 50, color: 'hsl(var(--chart-3))', icon: <TrendingUp className="h-4 w-4" /> },
        { name: 'Condition', score: 60, color: 'hsl(var(--chart-4))', icon: <AlertCircle className="h-4 w-4" /> },
        { name: 'Action', score: 75, color: 'hsl(var(--chart-5))', icon: <Target className="h-4 w-4" /> }
      );
    }

    setChartData(data);
    setAnimationKey(prev => prev + 1);
  }, [analysisText]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-foreground">{payload[0].payload.name}</p>
          <p className="text-primary font-medium">{`Score: ${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="border-0 shadow-lg bg-background/50 backdrop-blur-sm animate-fade-in">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl">Analysis Metrics</CardTitle>
        <p className="text-sm text-muted-foreground">Visual breakdown of AI assessment</p>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-5 gap-4 mb-6">
          {chartData.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-4 rounded-lg bg-background/50 border border-border/50 hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-md group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2 group-hover:bg-primary/20 transition-colors">
                {item.icon}
              </div>
              <p className="text-xs font-medium text-muted-foreground mb-1">{item.name}</p>
              <p className="text-2xl font-bold" style={{ color: item.color }}>
                {item.score}%
              </p>
            </div>
          ))}
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart key={animationKey} data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="name" 
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              domain={[0, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="score" 
              radius={[8, 8, 0, 0]}
              animationDuration={1500}
              animationBegin={0}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default AnalysisChart;
