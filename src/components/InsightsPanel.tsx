import React, { useMemo } from 'react';
import { TableSchema, Dataset } from '../schema/schemaTypes';
import { generateInsights } from '../insights/insightBuilder';
import { 
  BarChart, Bar, 
  LineChart, Line, 
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

export interface InsightsPanelProps {
  data: Dataset;
  schema: TableSchema;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c', '#d0ed57'];

export const InsightsPanel: React.FC<InsightsPanelProps> = ({ data, schema }) => {
  const insights = useMemo(() => {
    return generateInsights(data, schema);
  }, [data, schema]);

  if (!insights || insights.length === 0) {
    return null;
  }

  return (
    <div className="rst-insights-panel">
      <h3>AI Generated Insights</h3>
      <div className="rst-insights-grid">
        {insights.map(widget => (
          <div key={widget.id} className="rst-insight-card">
            <h4 className="rst-insight-title">{widget.title}</h4>
            
            <div className="rst-insight-chart-wrapper" style={{ height: '240px' }}>
              <ResponsiveContainer width="100%" height="100%">
              {widget.type === 'bar' ? (
                <BarChart data={widget.data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey={widget.xAxisKey} tick={{fontSize: 11, fill: '#64748b'}} axisLine={{stroke: '#e2e8f0'}} tickLine={false} />
                  <YAxis tick={{fontSize: 11, fill: '#64748b'}} axisLine={{stroke: '#e2e8f0'}} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                    cursor={{fill: '#f1f5f9'}}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} iconType="circle" />
                  {widget.yAxisKeys.map((yKey, index) => (
                    <Bar key={yKey} dataKey={yKey} fill={COLORS[index % COLORS.length]} radius={[4, 4, 0, 0]} barSize={32} />
                  ))}
                </BarChart>
              ) : widget.type === 'line' ? (
                <LineChart data={widget.data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey={widget.xAxisKey} tick={{fontSize: 11, fill: '#64748b'}} axisLine={{stroke: '#e2e8f0'}} tickLine={false} />
                  <YAxis tick={{fontSize: 11, fill: '#64748b'}} axisLine={{stroke: '#e2e8f0'}} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} iconType="circle" />
                  {widget.yAxisKeys.map((yKey, index) => (
                    <Line key={yKey} type="monotone" dataKey={yKey} stroke={COLORS[index % COLORS.length]} strokeWidth={2.5} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6, strokeWidth: 0 }} />
                  ))}
                </LineChart>
              ) : (
                <PieChart>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} iconType="circle" />
                  <Pie
                    data={widget.data}
                    cx="50%"
                    cy="45%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey={widget.yAxisKeys[0]}
                    nameKey={widget.xAxisKey}
                    label={false}
                  >
                    {widget.data.map((_entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              )}
            </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
