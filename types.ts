
export enum ReportStatus {
  Pending = 'Pending',
  InProgress = 'In Progress',
  Resolved = 'Resolved',
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Report {
  id: string;
  imageUrl: string;
  timestamp: Date;
  coordinates: Coordinates | null;
  address: string;
  status: ReportStatus;
  reporter?: string; // Optional field
}

export enum Page {
    Report = 'Report',
    Dashboard = 'Dashboard',
    About = 'About'
}
