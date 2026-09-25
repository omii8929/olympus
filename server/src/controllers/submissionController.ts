import { Request, Response } from 'express';
import { prisma } from '../config/db';

export const submitProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { teamCode, regCode, projectTitle, repoUrl, liveDemoUrl, videoUrl, fileUrl, notes } = req.body;

    if (!teamCode && !regCode) {
      res.status(400).json({ success: false, message: 'Team Code or Registration Code is required.' });
      return;
    }

    if (!projectTitle || projectTitle.trim().length < 2) {
      res.status(400).json({ success: false, message: 'Valid Project Title is required.' });
      return;
    }

    const team = await prisma.team.findFirst({
      where: {
        OR: [
          ...(teamCode ? [{ teamCode: teamCode.trim().toUpperCase() }] : []),
          ...(regCode ? [{ registration: { regCode: regCode.trim().toUpperCase() } }] : []),
        ],
      },
    });

    if (!team) {
      res.status(404).json({ success: false, message: 'Team not found for the provided code.' });
      return;
    }

    const submission = await prisma.submission.upsert({
      where: { teamId: team.id },
      create: {
        teamId: team.id,
        projectTitle: projectTitle.trim(),
        repoUrl: repoUrl?.trim() || null,
        liveDemoUrl: liveDemoUrl?.trim() || null,
        videoUrl: videoUrl?.trim() || null,
        fileUrl: fileUrl?.trim() || null,
        notes: notes?.trim() || null,
      },
      update: {
        projectTitle: projectTitle.trim(),
        repoUrl: repoUrl?.trim() || null,
        liveDemoUrl: liveDemoUrl?.trim() || null,
        videoUrl: videoUrl?.trim() || null,
        fileUrl: fileUrl?.trim() || null,
        notes: notes?.trim() || null,
        updatedAt: new Date(),
      },
    });

    res.json({
      success: true,
      message: 'Project submission successfully recorded.',
      data: submission,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to record submission.', error });
  }
};

export const getAllSubmissions = async (req: Request, res: Response): Promise<void> => {
  try {
    const submissions = await prisma.submission.findMany({
      include: {
        team: {
          include: {
            participants: true,
            registration: true,
          },
        },
      },
      orderBy: { submittedAt: 'desc' },
    });

    res.json({ success: true, count: submissions.length, data: submissions });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve submissions.', error });
  }
};
