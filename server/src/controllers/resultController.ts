import { Request, Response } from 'express';
import { prisma } from '../config/db';
import { EventType } from '@prisma/client';

export const getResults = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventType, all } = req.query;

    const whereClause: any = {};
    if (all !== 'true') {
      whereClause.published = true;
    }
    if (eventType && Object.values(EventType).includes(eventType as EventType)) {
      whereClause.eventType = eventType as EventType;
    }

    const results = await prisma.result.findMany({
      where: whereClause,
      include: {
        team: {
          include: {
            participants: true,
          },
        },
      },
      orderBy: [{ eventType: 'asc' }, { position: 'asc' }],
    });

    res.json({ success: true, count: results.length, data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch results.', error });
  }
};

export const createOrUpdateResult = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, eventType, category, teamId, position, prizeTitle, remarks, published } = req.body;

    if (!eventType || !teamId || position === undefined || !prizeTitle) {
      res.status(400).json({
        success: false,
        message: 'Event type, Team ID, Position, and Prize Title are required.',
      });
      return;
    }

    let result;
    if (id) {
      result = await prisma.result.update({
        where: { id },
        data: {
          eventType: eventType as EventType,
          category: category?.trim(),
          teamId,
          position: Number(position),
          prizeTitle: prizeTitle.trim(),
          remarks: remarks?.trim(),
          published: Boolean(published),
        },
      });
    } else {
      result = await prisma.result.create({
        data: {
          eventType: eventType as EventType,
          category: category?.trim(),
          teamId,
          position: Number(position),
          prizeTitle: prizeTitle.trim(),
          remarks: remarks?.trim(),
          published: Boolean(published),
        },
      });
    }

    res.json({ success: true, message: 'Result saved.', data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to save result.', error });
  }
};

export const deleteResult = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.result.delete({ where: { id } });
    res.json({ success: true, message: 'Result deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete result.', error });
  }
};
