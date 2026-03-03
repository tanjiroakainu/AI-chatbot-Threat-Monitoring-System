import type { ThreatReport, RaidBooking, DrugMonitoring } from '../types';

let threatId = 4;
let raidId = 3;
let drugId = 3;

export const threatReports: ThreatReport[] = [
  { id: '1', title: 'Suspicious activity near warehouse', description: 'Unusual vehicles and people at night.', location: 'Industrial Zone A', severity: 'high', status: 'investigating', reportedBy: 'client@example.com', reportedAt: '2025-02-28T10:00:00Z' },
  { id: '2', title: 'Anonymous tip - drug deal', description: 'Tip received about possible deal at park.', location: 'Central Park', severity: 'critical', status: 'pending', reportedBy: 'client@example.com', reportedAt: '2025-03-01T08:30:00Z' },
  { id: '3', title: 'Break-in attempt', description: 'Attempted break-in at storage facility.', location: 'Storage Unit 45', severity: 'medium', status: 'resolved', reportedBy: 'client@example.com', reportedAt: '2025-02-27T22:00:00Z' },
];

export const raidBookings: RaidBooking[] = [
  { id: '1', location: 'Warehouse 7', scheduledDate: '2025-03-05', purpose: 'Drug raid', status: 'approved', requestedBy: 'client@example.com', requestedAt: '2025-02-28T09:00:00Z' },
  { id: '2', location: 'Residential Block B', scheduledDate: '2025-03-10', purpose: 'Search warrant', status: 'pending', requestedBy: 'client@example.com', requestedAt: '2025-03-01T11:00:00Z' },
];

export const drugMonitoring: DrugMonitoring[] = [
  { id: '1', substance: 'Suspected narcotics', location: 'Warehouse 7', quantity: 'Unknown', status: 'under_investigation', reportedAt: '2025-02-28T12:00:00Z' },
  { id: '2', substance: 'Controlled substance', location: 'Central Park', quantity: 'Small quantity', status: 'seized', reportedAt: '2025-03-01T09:00:00Z' },
];

export function addThreatReport(report: Omit<ThreatReport, 'id' | 'reportedAt'>): ThreatReport {
  const newReport: ThreatReport = {
    ...report,
    id: String(++threatId),
    reportedAt: new Date().toISOString(),
  };
  threatReports.push(newReport);
  return newReport;
}

export function addRaidBooking(booking: Omit<RaidBooking, 'id' | 'requestedAt'>): RaidBooking {
  const newBooking: RaidBooking = {
    ...booking,
    id: String(++raidId),
    requestedAt: new Date().toISOString(),
  };
  raidBookings.push(newBooking);
  return newBooking;
}

export function addDrugRecord(record: Omit<DrugMonitoring, 'id' | 'reportedAt'>): DrugMonitoring {
  const newRecord: DrugMonitoring = {
    ...record,
    id: String(++drugId),
    reportedAt: new Date().toISOString(),
  };
  drugMonitoring.push(newRecord);
  return newRecord;
}

export function updateThreatStatus(id: string, status: ThreatReport['status']) {
  const r = threatReports.find((x) => x.id === id);
  if (r) r.status = status;
}

export function updateRaidStatus(id: string, status: RaidBooking['status']) {
  const r = raidBookings.find((x) => x.id === id);
  if (r) r.status = status;
}

export function updateDrugStatus(id: string, status: DrugMonitoring['status']) {
  const r = drugMonitoring.find((x) => x.id === id);
  if (r) r.status = status;
}

export function updateDrugRecord(
  id: string,
  data: Partial<Pick<DrugMonitoring, 'substance' | 'location' | 'quantity' | 'status'>>
) {
  const r = drugMonitoring.find((x) => x.id === id);
  if (r) {
    if (data.substance != null) r.substance = data.substance;
    if (data.location != null) r.location = data.location;
    if (data.quantity != null) r.quantity = data.quantity;
    if (data.status != null) r.status = data.status;
  }
}

export function deleteDrugRecord(id: string) {
  const i = drugMonitoring.findIndex((x) => x.id === id);
  if (i !== -1) drugMonitoring.splice(i, 1);
}
