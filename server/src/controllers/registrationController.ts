import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { prisma } from '../config/db';
import { EventType, RegStatus, PaymentStatus } from '@prisma/client';

const UPLOADS_DIR = path.join(__dirname, '../../uploads');
const SCREENSHOT_DIR = path.join(UPLOADS_DIR, 'screenshots');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

export const registerTeam = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventType, teamName, leader, members, utrNumber, paymentScreenshot } = req.body;

    // Validate eventType
    if (!eventType || !Object.values(EventType).includes(eventType)) {
      res.status(400).json({
        success: false,
        message: 'Invalid or missing event type. Must be FULL_STACK_AI, DRONE_VIDEO, or DRONE_POSTER.',
      });
      return;
    }

    // Resolve Event 1 or Event 2 based on chosen eventType
    const eventCode = eventType === 'FULL_STACK_AI' ? 'FULL_STACK_AI' : 'DRONE_EVENT';
    const targetEvent = await prisma.event.findUnique({
      where: { code: eventCode },
    });

    if (!targetEvent) {
      res.status(500).json({
        success: false,
        message: 'Event configuration not found in database. Please contact event administrators.',
      });
      return;
    }

    // Check paymentEnabled
    if (!targetEvent.paymentEnabled) {
      res.status(400).json({
        success: false,
        message: 'Online payment is temporarily unavailable for this event. Please contact the organizers.',
      });
      return;
    }

    // Validate team name
    if (!teamName || typeof teamName !== 'string' || teamName.trim().length < 2) {
      res.status(400).json({ success: false, message: 'Valid Team Name is required (minimum 2 characters).' });
      return;
    }

    // Validate team leader
    if (!leader || !leader.name || !leader.email || !leader.phone || !leader.branch || !leader.college) {
      res.status(400).json({
        success: false,
        message: 'Complete Team Leader details (Name, Email, Phone, Branch, College) are required.',
      });
      return;
    }

    // Validate members list (Total team size must be 2-4 members)
    if (!Array.isArray(members) || members.length < 1 || members.length > 3) {
      res.status(400).json({
        success: false,
        message: 'Team size must be between 2 and 4 members (1 leader + 1 to 3 additional members).',
      });
      return;
    }

    // Validate each member has required details
    for (let i = 0; i < members.length; i++) {
      const m = members[i];
      if (!m.name || !m.email || !m.phone || !m.branch || !m.college) {
        res.status(400).json({
          success: false,
          message: `Member ${i + 2} has incomplete details. Name, Email, Phone, Branch, and College are required.`,
        });
        return;
      }
    }

    // Validate UTR / Transaction ID
    if (!utrNumber || typeof utrNumber !== 'string' || utrNumber.trim().length < 4) {
      res.status(400).json({
        success: false,
        message: 'Please provide a valid UTR / Transaction Reference ID (minimum 4 characters).',
      });
      return;
    }

    // Validate Payment Screenshot
    if (!paymentScreenshot || typeof paymentScreenshot !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Payment verification screenshot is mandatory. Please upload your payment receipt screenshot.',
      });
      return;
    }

    // Check duplicate team name in same event
    const existingTeam = await prisma.team.findFirst({
      where: {
        name: { equals: teamName.trim(), mode: 'insensitive' },
        eventType: eventType as EventType,
      },
    });

    if (existingTeam) {
      res.status(400).json({
        success: false,
        message: 'A team with this name has already registered for this event. Please choose a unique team name.',
      });
      return;
    }

    // Generate unique codes
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const regCode = `OLY-2026-${randomSuffix}`;
    const teamCode = `TM-${randomSuffix}`;

    const totalParticipants = 1 + members.length;
    const totalAmount = totalParticipants * targetEvent.registrationFee;

    // Save screenshot if base64
    let screenshotUrl = paymentScreenshot;
    if (paymentScreenshot.startsWith('data:image/')) {
      try {
        const matches = paymentScreenshot.match(/^data:image\/([A-Za-z-+]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          let ext = matches[1].toLowerCase();
          if (ext === 'jpeg') ext = 'jpg';
          const buffer = Buffer.from(matches[2], 'base64');
          const filename = `shot-${teamCode.toLowerCase()}-${Date.now()}.${ext}`;
          const filePath = path.join(SCREENSHOT_DIR, filename);
          fs.writeFileSync(filePath, buffer);
          screenshotUrl = `/uploads/screenshots/${filename}`;
        }
      } catch (err) {
        console.warn('Could not save screenshot to file, storing data string instead:', err);
      }
    }

    // Create team, participants and registration with immutable payment snapshot
    const result = await prisma.$transaction(async (tx) => {
      const newTeam = await tx.team.create({
        data: {
          name: teamName.trim(),
          teamCode,
          eventType: eventType as EventType,
          eventId: targetEvent.id,
          participants: {
            create: [
              {
                name: leader.name.trim(),
                email: leader.email.trim().toLowerCase(),
                phone: leader.phone.trim(),
                branch: leader.branch.trim(),
                college: leader.college.trim(),
                isLeader: true,
              },
              ...members.map((m: any) => ({
                name: m.name.trim(),
                email: m.email.trim().toLowerCase(),
                phone: m.phone.trim(),
                branch: m.branch.trim(),
                college: m.college.trim(),
                isLeader: false,
              })),
            ],
          },
          registration: {
            create: {
              regCode,
              eventId: targetEvent.id,
              status: RegStatus.CONFIRMED,
              paymentStatus: PaymentStatus.PENDING, // Verified by admin
              amount: totalAmount,
              // Historical Payment Snapshot:
              registrationFeeAtPayment: targetEvent.registrationFee,
              paymentMobileAtPayment: targetEvent.paymentMobile,
              upiIdAtPayment: targetEvent.upiId,
              qrCodeAtPayment: targetEvent.qrCodeUrl,
              utrNumber: utrNumber.trim(),
              paymentScreenshotUrl: screenshotUrl,
            },
          },
        },
        include: {
          participants: true,
          registration: {
            include: {
              event: true,
            },
          },
        },
      });

      return newTeam;
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful! Your OLYMPUS participant pass has been generated.',
      data: {
        registrationId: result.registration?.regCode,
        teamCode: result.teamCode,
        teamName: result.name,
        eventType: result.eventType,
        eventId: targetEvent.id,
        eventName: targetEvent.name,
        amount: result.registration?.amount,
        status: result.registration?.status,
        paymentStatus: result.registration?.paymentStatus,
        utrNumber: result.registration?.utrNumber,
        participantsCount: result.participants.length,
        participants: result.participants,
        createdAt: result.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process registration. Please try again.',
      error: error.message,
    });
  }
};

export const getRegistrationByCode = async (req: Request, res: Response): Promise<void> => {
  try {
    const code = req.params.code?.trim().toUpperCase();

    if (!code) {
      res.status(400).json({ success: false, message: 'Registration code or Team code is required.' });
      return;
    }

    const team = await prisma.team.findFirst({
      where: {
        OR: [
          { teamCode: code },
          { registration: { regCode: code } },
        ],
      },
      include: {
        event: true,
        participants: true,
        registration: {
          include: {
            event: true,
          },
        },
        submission: true,
      },
    });

    if (!team) {
      res.status(404).json({ success: false, message: 'Registration not found for the provided code.' });
      return;
    }

    res.json({
      success: true,
      data: {
        registrationId: team.registration?.regCode,
        teamCode: team.teamCode,
        teamName: team.name,
        eventType: team.eventType,
        eventId: team.eventId,
        eventName: team.event?.name,
        status: team.registration?.status,
        paymentStatus: team.registration?.paymentStatus,
        amount: team.registration?.amount,
        registrationFeeAtPayment: team.registration?.registrationFeeAtPayment,
        paymentMobileAtPayment: team.registration?.paymentMobileAtPayment,
        upiIdAtPayment: team.registration?.upiIdAtPayment,
        qrCodeAtPayment: team.registration?.qrCodeAtPayment,
        utrNumber: team.registration?.utrNumber,
        paymentScreenshotUrl: team.registration?.paymentScreenshotUrl,
        participants: team.participants,
        submission: team.submission,
        registeredAt: team.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving registration.', error });
  }
};
