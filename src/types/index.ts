export type UserRole = 'admin' | 'client';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface ThreatReport {
  id: string;
  title: string;
  description: string;
  location: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'investigating' | 'resolved';
  reportedBy: string;
  reportedAt: string;
}

export interface RaidBooking {
  id: string;
  location: string;
  scheduledDate: string;
  purpose: string;
  status: 'pending' | 'approved' | 'completed' | 'cancelled';
  requestedBy: string;
  requestedAt: string;
}

export interface DrugMonitoring {
  id: string;
  substance: string;
  location: string;
  quantity: string;
  status: 'reported' | 'seized' | 'under_investigation';
  reportedAt: string;
}
