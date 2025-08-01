import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DenialTrendData {
  month: string;
  denialRate: number;
  totalClaims: number;
}

interface DenialTrendChartProps {
  data: DenialTrendData[];
}

export function DenialTrendChart({ data }: DenialTrendChartProps) {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-card-foreground">
          Denial Rate Trend Over Time
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="month" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: 'var(--shadow-card)'
              }}
              formatter={(value) => [`${value}%`, 'Denial Rate']}
            />
            <Line 
              type="monotone" 
              dataKey="denialRate" 
              stroke="hsl(var(--destructive))" 
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--destructive))', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: 'hsl(var(--destructive))', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}