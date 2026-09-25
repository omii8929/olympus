import { Request, Response } from 'express';
import { prisma } from '../config/db';
import { EventType } from '@prisma/client';
import path from 'path';
import fs from 'fs';

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

export const deleteRegistration = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ success: false, message: 'Registration or Team ID is required.' });
      return;
    }

    // 1. Try finding registration by id, regCode, or teamId
    const registration = await prisma.registration.findFirst({
      where: {
        OR: [
          { id },
          { regCode: id },
          { teamId: id },
        ],
      },
      include: {
        team: true,
      },
    });

    if (registration) {
      // Clean up uploaded screenshot file if it exists locally
      if (registration.paymentScreenshotUrl && registration.paymentScreenshotUrl.startsWith('/uploads/screenshots/')) {
        const filePath = path.join(__dirname, '../../', registration.paymentScreenshotUrl);
        if (fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
          } catch (e) {
            console.warn('Failed to delete screenshot file:', e);
          }
        }
      }

      // Deleting team cascades to participants, submissions, results, and registration
      if (registration.teamId) {
        await prisma.team.delete({
          where: { id: registration.teamId },
        });
      } else {
        await prisma.registration.delete({
          where: { id: registration.id },
        });
      }

      res.json({
        success: true,
        message: `Registration ${registration.regCode} for team "${registration.team?.name || 'N/A'}" has been permanently removed.`,
      });
      return;
    }

    // 2. If not found via registration, check if it's a team id or teamCode
    const team = await prisma.team.findFirst({
      where: {
        OR: [
          { id },
          { teamCode: id },
        ],
      },
      include: {
        registration: true,
      },
    });

    if (team) {
      if (team.registration?.paymentScreenshotUrl && team.registration.paymentScreenshotUrl.startsWith('/uploads/screenshots/')) {
        const filePath = path.join(__dirname, '../../', team.registration.paymentScreenshotUrl);
        if (fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
          } catch (e) {
            console.warn('Failed to delete screenshot file:', e);
          }
        }
      }

      await prisma.team.delete({
        where: { id: team.id },
      });

      res.json({
        success: true,
        message: `Team "${team.name}" and its registration records have been permanently removed.`,
      });
      return;
    }

    res.status(404).json({ success: false, message: 'Registration record not found.' });
  } catch (error: any) {
    console.error('Error deleting registration:', error);
    res.status(500).json({ success: false, message: 'Failed to delete registration.', error: error.message || error });
  }
};

