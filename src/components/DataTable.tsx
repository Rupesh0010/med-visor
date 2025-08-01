import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Download, Filter } from "lucide-react";

interface DataTableProps {
  title: string;
  data: any[];
  columns: {
    key: string;
    label: string;
    render?: (value: any, row: any) => React.ReactNode;
  }[];
  searchable?: boolean;
  exportable?: boolean;
}

export function DataTable({ 
  title, 
  data, 
  columns, 
  searchable = true, 
  exportable = true 
}: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredData = data.filter(item =>
    Object.values(item).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handleExport = () => {
    const csvContent = [
      columns.map(col => col.label).join(','),
      ...filteredData.map(row =>
        columns.map(col => row[col.key] || '').join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '_')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      'Paid': 'default',
      'Denied': 'destructive',
      'Pending': 'outline',
      'Submitted': 'secondary'
    } as const;
    
    return (
      <Badge variant={statusColors[status as keyof typeof statusColors] || 'secondary'}>
        {status}
      </Badge>
    );
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold text-card-foreground">
            {title}
          </CardTitle>
          <div className="flex gap-2">
            {searchable && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
            )}
            {exportable && (
              <Button onClick={handleExport} variant="medical" size="sm">
                <Download className="w-4 h-4" />
                Export
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {columns.map((column) => (
                  <th 
                    key={column.key}
                    className="text-left p-3 font-medium text-muted-foreground"
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, index) => (
                <tr 
                  key={index}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  {columns.map((column) => (
                    <td key={column.key} className="p-3 text-sm">
                      {column.render 
                        ? column.render(row[column.key], row)
                        : column.key === 'status' 
                          ? getStatusBadge(row[column.key])
                          : row[column.key]
                      }
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-muted-foreground">
              Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length} results
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}