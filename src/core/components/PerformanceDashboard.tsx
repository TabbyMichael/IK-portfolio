import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, Clock, Zap, Eye } from 'lucide-react';
import { getStoredMetrics, calculatePerformanceScore } from '../../utils/performance';

interface MetricData {
  value: number;
  grade: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
  url: string;
  id: string;
}

interface MetricSummary {
  name: string;
  current: number;
  average: number;
  grade: string;
  trend: 'up' | 'down' | 'stable';
  icon: React.ComponentType<{ className?: string }>;
  unit: string;
  description: string;
}

const PerformanceDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<Record<string, MetricData[]>>({});
  const [score, setScore] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const updateMetrics = () => {
      const storedMetrics = getStoredMetrics();
      setMetrics(storedMetrics);
      setScore(calculatePerformanceScore());
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [refreshKey]);

  const getMetricSummary = (): MetricSummary[] => {
    const summaries: MetricSummary[] = [
      {
        name: 'LCP',
        current: 0,
        average: 0,
        grade: 'good',
        trend: 'stable',
        icon: Eye,
        unit: 'ms',
        description: 'Largest Contentful Paint'
      },
      {
        name: 'FID',
        current: 0,
        average: 0,
        grade: 'good',
        trend: 'stable',
        icon: Zap,
        unit: 'ms',
        description: 'First Input Delay'
      },
      {
        name: 'CLS',
        current: 0,
        average: 0,
        grade: 'good',
        trend: 'stable',
        icon: Activity,
        unit: '',
        description: 'Cumulative Layout Shift'
      },
      {
        name: 'FCP',
        current: 0,
        average: 0,
        grade: 'good',
        trend: 'stable',
        icon: Clock,
        unit: 'ms',
        description: 'First Contentful Paint'
      }
    ];

    summaries.forEach(summary => {
      const metricData = metrics[summary.name];
      if (metricData && metricData.length > 0) {
        const recent = metricData.slice(-5); // Last 5 measurements
        const current = recent[recent.length - 1];
        const average = recent.reduce((sum, m) => sum + m.value, 0) / recent.length;
        
        summary.current = summary.name === 'CLS' ? 
          Math.round(current.value * 1000) / 1000 : 
          Math.round(current.value);
        summary.average = summary.name === 'CLS' ? 
          Math.round(average * 1000) / 1000 : 
          Math.round(average);
        summary.grade = current.grade;
        
        // Calculate trend
        if (recent.length >= 2) {
          const prev = recent[recent.length - 2].value;
          const curr = current.value;
          const change = Math.abs(curr - prev) / prev;
          
          if (change > 0.1) {
            summary.trend = curr > prev ? 'down' : 'up'; // Lower is better for performance
          }
        }
      }
    });

    return summaries;
  };

  const getScoreColor = (score: number): string => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGradeColor = (grade: string): string => {
    switch (grade) {
      case 'good': return 'bg-green-100 text-green-800 border-green-200';
      case 'needs-improvement': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'poor': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const clearMetrics = () => {
    localStorage.removeItem('webVitalsMetrics');
    setRefreshKey(prev => prev + 1);
  };

  if (!import.meta.env.DEV) {
    return null; // Only show in development
  }

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 right-4 z-[9999] bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label={isVisible ? 'Hide performance dashboard' : 'Show performance dashboard'}
        title="Performance Dashboard"
      >
        <Activity className="w-5 h-5" />
      </button>

      {/* Dashboard Panel */}
      {isVisible && (
        <div className="fixed bottom-20 right-4 z-[9998] w-96 max-h-96 overflow-y-auto bg-white rounded-lg shadow-2xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
              Performance Dashboard
            </h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setRefreshKey(prev => prev + 1)}
                className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                title="Refresh metrics"
              >
                Refresh
              </button>
              <button
                onClick={clearMetrics}
                className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                title="Clear stored metrics"
              >
                Clear
              </button>
              <button
                onClick={() => setIsVisible(false)}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close dashboard"
              >
                ×
              </button>
            </div>
          </div>

          {/* Overall Score */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Performance Score</span>
              <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
                {score}/100
              </span>
            </div>
            <div className="mt-2 bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  score >= 90 ? 'bg-green-500' : 
                  score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${score}%` }}
              />
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="space-y-3">
            {getMetricSummary().map((metric) => {
              const Icon = metric.icon;
              return (
                <div key={metric.name} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Icon className="w-4 h-4 text-gray-600" />
                      <span className="font-medium text-sm text-gray-900">
                        {metric.name}
                      </span>
                      {metric.trend !== 'stable' && (
                        <div className={`w-3 h-3 ${
                          metric.trend === 'up' ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {metric.trend === 'up' ? 
                            <TrendingUp className="w-3 h-3" /> : 
                            <TrendingDown className="w-3 h-3" />
                          }
                        </div>
                      )}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded border ${getGradeColor(metric.grade)}`}>
                      {metric.grade.replace('-', ' ')}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <span className="text-gray-600">Current: </span>
                      <span className="font-mono font-medium">
                        {metric.current}{metric.unit}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Avg: </span>
                      <span className="font-mono text-gray-500">
                        {metric.average}{metric.unit}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-1 text-xs text-gray-500">
                    {metric.description}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-4 pt-3 border-t border-gray-200 text-xs text-gray-500">
            <div className="flex items-center justify-between">
              <span>Metrics update every 5s</span>
              <span>Development only</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PerformanceDashboard;