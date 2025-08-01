import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DenialReasonData {
  reason: string;
  count: number;
  percentage: number;
}

interface DenialReasonsChartProps {
  data: DenialReasonData[];
}

const COLORS = [
  'hsl(var(--destructive))',
  'hsl(var(--warning))',
  'hsl(var(--primary))',
  'hsl(var(--accent))',
  'hsl(var(--muted-foreground))'
];

export function DenialReasonsChart({ data }: DenialReasonsChartProps) {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-card-foreground">
          Top 5 Denial Reasons
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="hsl(var(--primary))"
              dataKey="count"
              label={({ percentage }) => `${percentage}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: 'var(--shadow-card)'
              }}
              formatter={(value, name) => [value, 'Count']}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value) => <span className="text-sm text-muted-foreground">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}