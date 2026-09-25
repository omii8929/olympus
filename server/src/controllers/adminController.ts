import { Request, Response } from 'express';
import { prisma } from '../config/db';
import { EventType } from '@prisma/client';

export const getAdminStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalTeams = await prisma.team.count();
    const totalParticipants = await prisma.participant.count();
    const fullStackTeams = await prisma.team.count({
      where: { eventType: EventType.FULL_STACK_AI },
    });
    const droneVideoTeams = await prisma.team.count({
      where: { eventType: EventType.DRONE_VIDEO },
    });
    const dronePosterTeams = await prisma.team.count({
      where: { eventType: EventType.DRONE_POSTER },
    });
    const droneTotalTeams = droneVideoTeams + dronePosterTeams;

    const totalSubmissions = await prisma.submission.count();
    const totalAnnouncements = await prisma.announcement.count();

    // Financial calculations: ₹100 / participant
    const revenue = totalParticipants * 100;

    res.json({
      success: true,
      data: {
        totalTeams,
        totalParticipants,
        fullStackTeams,
        droneTotalTeams,
        droneVideoTeams,
        dronePosterTeams,
        totalSubmissions,
        totalAnnouncements,
        revenue,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve stats.', error });
  }
};

export const getAdminRegistrations = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, eventType } = req.query;

    const whereClause: any = {};

    if (eventType && Object.values(EventType).includes(eventType as EventType)) {
      whereClause.eventType = eventType as EventType;
    }

    if (search && typeof search === 'string' && search.trim().length > 0) {
      const q = search.trim();
      whereClause.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { teamCode: { contains: q, mode: 'insensitive' } },
        { registration: { regCode: { contains: q, mode: 'insensitive' } } },
        {
          participants: {
            some: {
              OR: [
                { name: { contains: q, mode: 'insensitive' } },
                { email: { contains: q, mode: 'insensitive' } },
                { college: { contains: q, mode: 'insensitive' } },
                { phone: { contains: q, mode: 'insensitive' } },
              ],
            },
          },
        },
      ];
    }

    const teams = await prisma.team.findMany({
      where: whereClause,
      include: {
        event: true,
        participants: {
          orderBy: { isLeader: 'desc' },
        },
        registration: {
          include: {
            event: true,
          },
        },
        submission: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, count: teams.length, data: teams });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve registrations.', error });
  }
};

export const updateRegistrationPaymentStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { paymentStatus, status, notes } = req.body;

    const registration = await prisma.registration.update({
      where: { id },
      data: {
        ...(paymentStatus && { paymentStatus }),
        ...(status && { status }),
        ...(notes !== undefined && { notes }),
      },
      include: {
        team: true,
        event: true,
      },
    });

    res.json({ success: true, message: 'Registration payment status updated successfully.', data: registration });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to update payment status.', error: error.message });
  }
};

export const exportRegistrationsCSV = async (req: Request, res: Response): Promise<void> => {
  try {
    const teams = await prisma.team.findMany({
      include: {
        participants: {
          orderBy: { isLeader: 'desc' },
        },
        registration: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Generate CSV lines
    const headers = [
      'Registration ID',
      'Team Code',
      'Team Name',
      'Event Type',
      'Status',
      'Fee (INR)',
      'Leader Name',
      'Leader Email',
      'Leader Phone',
      'Leader Branch',
      'Leader College',
      'Total Members',
      'All Members (Name [Branch, College])',
      'Registration Timestamp',
    ];

    const rows = teams.map((t) => {
      const leader = t.participants.find((p) => p.isLeader) || t.participants[0];
      const allMembersStr = t.participants
        .map((p) => `${p.name} (${p.branch}, ${p.college}) [${p.email}]`)
        .join('; ');

      return [
        `"${t.registration?.regCode || ''}"`,
        `"${t.teamCode}"`,
        `"${t.name.replace(/"/g, '""')}"`,
        `"${t.eventType}"`,
        `"${t.registration?.status || ''}"`,
        `"${t.registration?.amount || 0}"`,
        `"${leader?.name || ''}"`,
        `"${leader?.email || ''}"`,
        `"${leader?.phone || ''}"`,
        `"${leader?.branch || ''}"`,
        `"${leader?.college?.replace(/"/g, '""') || ''}"`,
        `"${t.participants.length}"`,
        `"${allMembersStr.replace(/"/g, '""')}"`,
        `"${t.createdAt.toISOString()}"`,
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="olympus_registrations_2026.csv"');
    res.status(200).send(csvContent);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to export CSV.', error });
  }
};
