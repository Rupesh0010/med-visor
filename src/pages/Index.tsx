import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KPICard } from "@/components/KPICard";
import { DenialTrendChart } from "@/components/charts/DenialTrendChart";
import { DenialReasonsChart } from "@/components/charts/DenialReasonsChart";
import { DataTable } from "@/components/DataTable";
import { CSVUploader } from "@/components/CSVUploader";
import { AIInsightsPanel } from "@/components/AIInsightsPanel";
import { 
  DollarSign, 
  TrendingDown, 
  CreditCard, 
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  Upload,
  Download,
  Filter,
  Search
} from "lucide-react";
import {
  mockKPIData,
  mockDenialTrendData,
  mockDenialReasonsData,
  mockRecentClaims,
  mockUnpaidClaims,
  aiInsights
} from "@/data/mockData";
import heroImage from "@/assets/dashboard-hero.jpg";

const Index = () => {
  const [uploadedData, setUploadedData] = useState<any[]>([]);
  const [showUploader, setShowUploader] = useState(false);

  const handleDataUpload = (data: any[], headers: string[]) => {
    setUploadedData(data);
    setShowUploader(false);
  };

  const recentClaimsColumns = [
    { key: 'claimId', label: 'Claim ID' },
    { key: 'patientName', label: 'Patient' },
    { key: 'dateOfService', label: 'Date of Service' },
    { 
      key: 'amount', 
      label: 'Amount',
      render: (value: number) => `$${value.toLocaleString()}`
    },
    { key: 'payer', label: 'Payer' },
    { key: 'status', label: 'Status' },
    { key: 'provider', label: 'Provider' }
  ];

  const unpaidClaimsColumns = [
    { key: 'claimId', label: 'Claim ID' },
    { key: 'patientName', label: 'Patient' },
    { key: 'dateOfService', label: 'Date of Service' },
    { 
      key: 'amount', 
      label: 'Amount',
      render: (value: number) => `$${value.toLocaleString()}`
    },
    { key: 'payer', label: 'Payer' },
    { 
      key: 'daysOutstanding', 
      label: 'Days Outstanding',
      render: (value: number) => (
        <span className={value > 90 ? 'text-destructive font-medium' : 'text-warning'}>
          {value} days
        </span>
      )
    },
    { key: 'provider', label: 'Provider' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <div className="border-b border-border bg-card shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-card-foreground">
                MedVisor Dashboard
              </h1>
              <p className="text-muted-foreground">
                AI-Powered Medical Billing & Revenue Cycle Management
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={() => setShowUploader(true)}
                variant="medical"
              >
                <Upload className="w-4 h-4" />
                Upload CSV
              </Button>
              <Button variant="default">
                <Download className="w-4 h-4" />
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* CSV Uploader Modal */}
        {showUploader && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card rounded-lg p-6 max-w-2xl w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Upload Medical Billing Data</h2>
                <Button 
                  variant="ghost" 
                  onClick={() => setShowUploader(false)}
                >
                  ×
                </Button>
              </div>
              <CSVUploader
                onDataParsed={handleDataUpload}
                expectedHeaders={['Claim ID', 'Patient Name', 'Amount', 'Status']}
              />
            </div>
          </div>
        )}

        {/* Hero Section */}
        <div className="mb-8 relative overflow-hidden rounded-xl">
          <div className="absolute inset-0 bg-gradient-primary opacity-90"></div>
          <div 
            className="bg-cover bg-center h-48 flex items-center justify-center relative"
            style={{ backgroundImage: `url(${heroImage})` }}
          >
            <div className="text-center text-white relative z-10">
              <h2 className="text-3xl font-bold mb-2">
                Revenue Cycle Excellence
              </h2>
              <p className="text-lg opacity-90">
                Streamline your medical billing with AI-powered insights
              </p>
            </div>
          </div>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard
            title="Net Collection Rate"
            value={`${mockKPIData.ncr.value}%`}
            change={mockKPIData.ncr.change}
            icon={DollarSign}
            variant="success"
          />
          <KPICard
            title="Denial Rate"
            value={`${mockKPIData.denialRate.value}%`}
            change={mockKPIData.denialRate.change}
            icon={TrendingDown}
            variant="destructive"
          />
          <KPICard
            title="Gross Charges"
            value={`$${mockKPIData.grossCharges.value.toLocaleString()}`}
            change={mockKPIData.grossCharges.change}
            icon={CreditCard}
          />
          <KPICard
            title="A/R Days"
            value={mockKPIData.arDays.value}
            change={mockKPIData.arDays.change}
            icon={Calendar}
            variant="warning"
          />
        </div>

        {/* Second Row KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <KPICard
            title="Payments Received (30d)"
            value={`$${mockKPIData.paymentsReceived.value.toLocaleString()}`}
            change={mockKPIData.paymentsReceived.change}
            icon={CheckCircle}
            variant="success"
          />
          <KPICard
            title="First Pass Rate"
            value={`${mockKPIData.firstPassRate.value}%`}
            change={mockKPIData.firstPassRate.change}
            icon={FileText}
          />
          <KPICard
            title="Total Claims"
            value={mockKPIData.totalClaims.value.toLocaleString()}
            change={mockKPIData.totalClaims.change}
            icon={Clock}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <DenialTrendChart data={mockDenialTrendData} />
          <DenialReasonsChart data={mockDenialReasonsData} />
        </div>

        {/* AI Insights and Data Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-1">
            <AIInsightsPanel insights={aiInsights} />
          </div>
          <div className="lg:col-span-2">
            <DataTable
              title="Recent Claims"
              data={uploadedData.length > 0 ? uploadedData : mockRecentClaims}
              columns={recentClaimsColumns}
            />
          </div>
        </div>

        {/* Unpaid Claims Table */}
        <div className="mb-8">
          <DataTable
            title="Unpaid Claims > 60 Days"
            data={mockUnpaidClaims}
            columns={unpaidClaimsColumns}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
