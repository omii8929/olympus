export type EventTypeCode = 'FULL_STACK_AI' | 'DRONE_VIDEO' | 'DRONE_POSTER';

export interface Participant {
  id?: string;
  name: string;
  email: string;
  phone: string;
  branch: string;
  college: string;
  isLeader?: boolean;
}

export interface TeamRegistrationPayload {
  eventType: EventTypeCode;
  teamName: string;
  leader: Participant;
  members: Participant[];
  utrNumber: string;
  paymentScreenshot: string;
}

export interface EventPaymentConfig {
  id: string;
  code: string;
  name: string;
  category?: string;
  registrationFee: number;
  paymentMobile: string;
  upiId: string;
  qrCodeUrl: string | null;
  paymentInstructions: string;
  paymentEnabled: boolean;
  lastUpdatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    teams: number;
    registrations: number;
    auditLogs: number;
  };
}

export interface EventPaymentAudit {
  id: string;
  eventId: string;
  event?: {
    id: string;
    code: string;
    name: string;
  };
  adminId?: string;
  adminEmail: string;
  changedField: string;
  previousValue?: string;
  newValue?: string;
  createdAt: string;
}

export interface RegistrationResponseData {
  registrationId: string;
  teamCode: string;
  teamName: string;
  eventType: EventTypeCode;
  eventId?: string;
  eventName?: string;
  amount: number;
  status: string;
  paymentStatus?: string;
  utrNumber?: string;
  participantsCount: number;
  participants: Participant[];
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'HIGH' | 'NORMAL' | 'LOW';
  category: string;
  active: boolean;
  publishedAt: string;
  createdAt: string;
}

export interface ScheduleItem {
  id: string;
  title: string;
  description?: string;
  date?: string;
  time?: string;
  venue?: string;
  round?: string;
  order: number;
}

export interface SubmissionData {
  id?: string;
  teamId?: string;
  projectTitle: string;
  repoUrl?: string;
  liveDemoUrl?: string;
  videoUrl?: string;
  fileUrl?: string;
  notes?: string;
  submittedAt?: string;
}

export interface TeamDetails {
  id: string;
  teamCode: string;
  name: string;
  eventType: EventTypeCode;
  eventId?: string;
  event?: EventPaymentConfig;
  participants: Participant[];
  registration?: {
    id: string;
    regCode: string;
    status: string;
    paymentStatus: string;
    amount: number;
    registrationFeeAtPayment?: number;
    paymentMobileAtPayment?: string;
    upiIdAtPayment?: string;
    qrCodeAtPayment?: string;
    utrNumber?: string;
    paymentScreenshotUrl?: string;
    event?: EventPaymentConfig;
    createdAt: string;
  };
  submission?: SubmissionData;
  createdAt: string;
}

export interface ResultItem {
  id: string;
  eventType: EventTypeCode;
  category?: string;
  teamId: string;
  team?: {
    name: string;
    teamCode: string;
    participants: Participant[];
  };
  position: number;
  prizeTitle: string;
  remarks?: string;
  published: boolean;
}

export interface AdminStats {
  totalTeams: number;
  totalParticipants: number;
  fullStackTeams: number;
  droneTotalTeams: number;
  droneVideoTeams: number;
  dronePosterTeams: number;
  totalSubmissions: number;
  totalAnnouncements: number;
  revenue: number;
}

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'PARTICIPANT';
}
