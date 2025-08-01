// Mock data for the medical billing dashboard

export const mockKPIData = {
  ncr: { value: 94.2, change: { value: 2.3, type: 'increase' as const } },
  denialRate: { value: 8.7, change: { value: 1.2, type: 'decrease' as const } },
  grossCharges: { value: 145000, change: { value: 5.8, type: 'increase' as const } },
  paymentsReceived: { value: 132000, change: { value: 3.4, type: 'increase' as const } },
  firstPassRate: { value: 91.3, change: { value: 4.1, type: 'increase' as const } },
  arDays: { value: 32, change: { value: 2.1, type: 'decrease' as const } },
  totalClaims: { value: 1247, change: { value: 8.9, type: 'increase' as const } }
};

export const mockDenialTrendData = [
  { month: 'Jan', denialRate: 12.5, totalClaims: 1100 },
  { month: 'Feb', denialRate: 11.2, totalClaims: 1150 },
  { month: 'Mar', denialRate: 10.8, totalClaims: 1200 },
  { month: 'Apr', denialRate: 9.5, totalClaims: 1180 },
  { month: 'May', denialRate: 8.9, totalClaims: 1220 },
  { month: 'Jun', denialRate: 8.7, totalClaims: 1247 }
];

export const mockDenialReasonsData = [
  { reason: 'Missing Documentation', count: 45, percentage: 32 },
  { reason: 'Prior Authorization', count: 38, percentage: 27 },
  { reason: 'Coding Error', count: 28, percentage: 20 },
  { reason: 'Eligibility Issue', count: 18, percentage: 13 },
  { reason: 'Duplicate Claim', count: 11, percentage: 8 }
];

export const mockRecentClaims = [
  {
    claim_id: 'CLM-2024-001',
    patientName: 'John Smith',
    dateOfService: '2024-01-15',
    billedamount: 2450.00,
    payer: 'Blue Cross',
    status: 'Paid',
    provider: 'Dr. Johnson'
  },
  {
    claim_id: 'CLM-2024-002',
    patientName: 'Mary Wilson',
    dateOfService: '2024-01-14',
    billedamount: 1850.00,
    payer: 'Aetna',
    status: 'Denied',
    provider: 'Dr. Smith'
  },
  {
    claim_id: 'CLM-2024-003',
    patientName: 'Robert Davis',
    dateOfService: '2024-01-13',
    billedamount: 3200.00,
    payer: 'Medicare',
    status: 'Pending',
    provider: 'Dr. Johnson'
  },
  {
    claim_id: 'CLM-2024-004',
    patientName: 'Lisa Brown',
    dateOfService: '2024-01-12',
    billedamount: 1650.00,
    payer: 'Cigna',
    status: 'Submitted',
    provider: 'Dr. Williams'
  },
  {
    claim_id: 'CLM-2024-005',
    patientName: 'David Miller',
    dateOfService: '2024-01-11',
    billedamount: 2900.00,
    payer: 'United Health',
    status: 'Paid',
    provider: 'Dr. Smith'
  }
];

export const mockUnpaidClaims = [
  {
    claim_id: 'CLM-2023-156',
    patientName: 'Sarah Johnson',
    dateOfService: '2023-11-20',
    billedamount: 4200.00,
    payer: 'Blue Cross',
    daysOutstanding: 95,
    provider: 'Dr. Wilson'
  },
  {
    claim_id: 'CLM-2023-142',
    patientName: 'Michael Chen',
    dateOfService: '2023-11-15',
    billedamount: 3800.00,
    payer: 'Aetna',
    daysOutstanding: 87,
    provider: 'Dr. Johnson'
  },
  {
    claim_id: 'CLM-2023-134',
    patientName: 'Emily Davis',
    dateOfService: '2023-11-10',
    billedamount: 2100.00,
    payer: 'Medicare',
    daysOutstanding: 78,
    provider: 'Dr. Smith'
  }
];

export const aiInsights = [
  {
    type: 'anomaly' as const,
    title: 'Denial Rate Spike Detected',
    description: 'Denials increased 27% this week compared to last week',
    action: 'Review recent submissions for common issues',
    severity: 'high' as const
  },
  {
    type: 'opportunity' as const,
    title: 'Recovery Opportunity',
    description: 'You can recover $23,000 by appealing denied claims with code 99213',
    action: 'Download denied claims report',
    severity: 'medium' as const
  },
  {
    type: 'alert' as const,
    title: 'Missing Documentation',
    description: '5 claims are missing required documentation',
    action: 'Contact providers for missing documents',
    severity: 'high' as const
  }
];
