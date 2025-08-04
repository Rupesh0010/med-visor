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

  const calculateKPIsFromData = (data: any[]) => {
    if (data.length === 0) return mockKPIData;

    // Get current date and 30 days ago
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    // Filter data for current period (last 30 days) and previous period (30-60 days ago)
    const currentPeriodData = data.filter(claim => {
      const claimDate = new Date(claim.dateOfService);
      return claimDate >= thirtyDaysAgo && claimDate <= now;
    });

    const previousPeriodData = data.filter(claim => {
      const claimDate = new Date(claim.dateOfService);
      return claimDate >= sixtyDaysAgo && claimDate < thirtyDaysAgo;
    });

    // Calculate metrics for current period
    const totalClaims = currentPeriodData.length;
    const paidClaims = currentPeriodData.filter(claim => claim.status === 'Paid');
    const deniedClaims = currentPeriodData.filter(claim => claim.status === 'Denied');
    const grossCharges = currentPeriodData.reduce((sum, claim) => sum + (parseFloat(claim.billedamount) || 0), 0);
    const paymentsReceived = paidClaims.reduce((sum, claim) => sum + (parseFloat(claim.billedamount) || 0), 0);
    const unpaidClaims = data.filter(claim => claim.daysOutstanding && claim.daysOutstanding > 0);
    const avgARDays = unpaidClaims.length > 0 ? 
      unpaidClaims.reduce((sum, claim) => sum + (parseInt(claim.daysOutstanding) || 0), 0) / unpaidClaims.length : 0;

    // Calculate metrics for previous period
    const prevTotalClaims = previousPeriodData.length;
    const prevPaidClaims = previousPeriodData.filter(claim => claim.status === 'Paid');
    const prevDeniedClaims = previousPeriodData.filter(claim => claim.status === 'Denied');
    const prevGrossCharges = previousPeriodData.reduce((sum, claim) => sum + (parseFloat(claim.billedamount) || 0), 0);
    const prevPaymentsReceived = prevPaidClaims.reduce((sum, claim) => sum + (parseFloat(claim.billedamount) || 0), 0);

    // Helper function to calculate percentage change
    const calculateChange = (current: number, previous: number) => {
      if (previous === 0) return { value: 0, type: 'increase' as const };
      const change = ((current - previous) / previous) * 100;
      return {
        value: Math.round(Math.abs(change) * 10) / 10,
        type: change >= 0 ? 'increase' as const : 'decrease' as const
      };
    };

    // Calculate current values
    const currentNCR = grossCharges > 0 ? (paymentsReceived / grossCharges) * 100 : 0;
    const currentDenialRate = totalClaims > 0 ? (deniedClaims.length / totalClaims) * 100 : 0;
    const currentFirstPassRate = totalClaims > 0 ? (paidClaims.length / totalClaims) * 100 : 0;

    // Calculate previous values
    const prevNCR = prevGrossCharges > 0 ? (prevPaymentsReceived / prevGrossCharges) * 100 : 0;
    const prevDenialRate = prevTotalClaims > 0 ? (prevDeniedClaims.length / prevTotalClaims) * 100 : 0;
    const prevFirstPassRate = prevTotalClaims > 0 ? (prevPaidClaims.length / prevTotalClaims) * 100 : 0;

    return {
      ncr: { 
        value: Math.round(currentNCR * 10) / 10, 
        change: calculateChange(currentNCR, prevNCR)
      },
      denialRate: { 
        value: Math.round(currentDenialRate * 10) / 10, 
        change: calculateChange(currentDenialRate, prevDenialRate)
      },
      grossCharges: { 
        value: Math.round(grossCharges), 
        change: calculateChange(grossCharges, prevGrossCharges)
      },
      paymentsReceived: { 
        value: Math.round(paymentsReceived), 
        change: calculateChange(paymentsReceived, prevPaymentsReceived)
      },
      firstPassRate: { 
        value: Math.round(currentFirstPassRate * 10) / 10, 
        change: calculateChange(currentFirstPassRate, prevFirstPassRate)
      },
      arDays: { 
        value: Math.round(avgARDays), 
        change: { value: 0, type: 'increase' as const } // A/R days need historical data to calculate properly
      },
      totalClaims: { 
        value: totalClaims, 
        change: calculateChange(totalClaims, prevTotalClaims)
      }
    };
  };

  const calculateDenialTrendFromData = (data: any[]) => {
    if (data.length === 0) return mockDenialTrendData;

    const monthlyData: Record<string, { totalClaims: number; deniedClaims: number }> = {};
    
    data.forEach(claim => {
      const date = new Date(claim.dateOfService);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short' });
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { totalClaims: 0, deniedClaims: 0 };
      }
      
      monthlyData[monthKey].totalClaims++;
      if (claim.status === 'Denied') {
        monthlyData[monthKey].deniedClaims++;
      }
    });

    return Object.entries(monthlyData).map(([month, stats]) => ({
      month,
      denialRate: stats.totalClaims > 0 ? Math.round((stats.deniedClaims / stats.totalClaims) * 100 * 10) / 10 : 0,
      totalClaims: stats.totalClaims
    }));
  };

  const calculateDenialReasonsFromData = (data: any[]) => {
    if (data.length === 0) return mockDenialReasonsData;

    const deniedClaims = data.filter(claim => claim.status === 'Denied');
    if (deniedClaims.length === 0) return mockDenialReasonsData;

    const reasonCounts: Record<string, number> = {};
    deniedClaims.forEach(claim => {
      const reason = claim.denialReason || 'Unknown Reason';
      reasonCounts[reason] = (reasonCounts[reason] || 0) + 1;
    });

    const totalDenials = deniedClaims.length;
    return Object.entries(reasonCounts)
      .map(([reason, count]) => ({
        reason,
        count,
        percentage: Math.round((count / totalDenials) * 100)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  const handleDataUpload = (data: any[], headers: string[]) => {
    console.log('Uploaded data:', data);
    console.log('Headers:', headers);
    setUploadedData(data);
    setShowUploader(false);
  };

  // Calculate dynamic data based on uploaded CSV or use mock data
  const kpiData = uploadedData.length > 0 ? calculateKPIsFromData(uploadedData) : mockKPIData;
  const denialTrendData = uploadedData.length > 0 ? calculateDenialTrendFromData(uploadedData) : mockDenialTrendData;
  const denialReasonsData = uploadedData.length > 0 ? calculateDenialReasonsFromData(uploadedData) : mockDenialReasonsData;
  const recentClaimsData = uploadedData.length > 0 ? uploadedData : mockRecentClaims;

  const recentClaimsColumns = [
    { key: 'claim_id', label: 'Claim ID' },
    { key: 'patientName', label: 'Patient' },
    { key: 'dateOfService', label: 'Date of Service' },
    { 
      key: 'billedamount', 
      label: 'Amount',
      render: (value: number) => value != null ? `$${value.toLocaleString()}` : '$0'
    },
    { key: 'payer', label: 'Payer' },
    { key: 'status', label: 'Status' },
    { key: 'provider', label: 'Provider' }
  ];

  const unpaidClaimsColumns = [
    { key: 'claim_id', label: 'Claim ID' },
    { key: 'patientName', label: 'Patient' },
    { key: 'dateOfService', label: 'Date of Service' },
    { 
      key: 'billedamount', 
      label: 'Amount',
      render: (value: number) => value != null ? `$${value.toLocaleString()}` : '$0'
    },
    { key: 'payer', label: 'Payer' },
    { 
      key: 'daysOutstanding', 
      label: 'Days Outstanding',
      render: (value: number) => value != null ? (
        <span className={value > 90 ? 'text-destructive font-medium' : 'text-warning'}>
          {value} days
        </span>
      ) : (
        <span>0 days</span>
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
                expectedHeaders={['claim_id', 'patientName', 'billedamount', 'status', 'payer', 'provider', 'dateOfService']}
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
            value={`${kpiData.ncr.value}%`}
            change={kpiData.ncr.change}
            icon={DollarSign}
            variant="success"
          />
          <KPICard
            title="Denial Rate"
            value={`${kpiData.denialRate.value}%`}
            change={kpiData.denialRate.change}
            icon={TrendingDown}
            variant="destructive"
          />
          <KPICard
            title="Gross Charges"
            value={`$${kpiData.grossCharges.value.toLocaleString()}`}
            change={kpiData.grossCharges.change}
            icon={CreditCard}
          />
          <KPICard
            title="A/R Days"
            value={kpiData.arDays.value}
            change={kpiData.arDays.change}
            icon={Calendar}
            variant="warning"
          />
        </div>

        {/* Second Row KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <KPICard
            title="Payments Received (30d)"
            value={`$${kpiData.paymentsReceived.value.toLocaleString()}`}
            change={kpiData.paymentsReceived.change}
            icon={CheckCircle}
            variant="success"
          />
          <KPICard
            title="First Pass Rate"
            value={`${kpiData.firstPassRate.value}%`}
            change={kpiData.firstPassRate.change}
            icon={FileText}
          />
          <KPICard
            title="Total Claims"
            value={kpiData.totalClaims.value.toLocaleString()}
            change={kpiData.totalClaims.change}
            icon={Clock}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <DenialTrendChart data={denialTrendData} />
          <DenialReasonsChart data={denialReasonsData} />
        </div>

        {/* AI Insights and Data Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-1">
            <AIInsightsPanel insights={aiInsights} />
          </div>
          <div className="lg:col-span-2">
            <DataTable
              title="Recent Claims"
              data={recentClaimsData}
              columns={recentClaimsColumns}
            />
          </div>
        </div>

        {/* Unpaid Claims Table */}
        <div className="mb-8">
          <DataTable
            title="Unpaid Claims > 60 Days"
            data={uploadedData.length > 0 ? uploadedData.filter((claim: any) => claim.daysOutstanding > 60) : mockUnpaidClaims}
            columns={unpaidClaimsColumns}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;