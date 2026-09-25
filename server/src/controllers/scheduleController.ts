import { Request, Response } from 'express';
import { prisma } from '../config/db';

export const getSchedule = async (req: Request, res: Response): Promise<void> => {
  try {
    const items = await prisma.scheduleItem.findMany({
      orderBy: { order: 'asc' },
    });
    res.json({ success: true, count: items.length, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch schedule.', error });
  }
};

export const createScheduleItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, date, time, venue, round, order } = req.body;

    if (!title) {
      res.status(400).json({ success: false, message: 'Title is required for schedule item.' });
      return;
    }

    const item = await prisma.scheduleItem.create({
      data: {
        title: title.trim(),
        description: description?.trim() || '',
        date: date?.trim() || 'TBA by Organizers',
        time: time?.trim() || 'TBA',
        venue: venue?.trim() || 'TBA',
        round: round?.trim() || '',
        order: Number(order) || 0,
      },
    });

    res.status(201).json({ success: true, message: 'Schedule item created.', data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create schedule item.', error });
  }
};

export const updateScheduleItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, date, time, venue, round, order } = req.body;

    const updated = await prisma.scheduleItem.update({
      where: { id },
      data: {
        ...(title && { title: title.trim() }),
        ...(description !== undefined && { description: description?.trim() }),
        ...(date !== undefined && { date: date?.trim() }),
        ...(time !== undefined && { time: time?.trim() }),
        ...(venue !== undefined && { venue: venue?.trim() }),
        ...(round !== undefined && { round: round?.trim() }),
        ...(order !== undefined && { order: Number(order) }),
      },
    });

    res.json({ success: true, message: 'Schedule item updated.', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update schedule item.', error });
  }
};

export const deleteScheduleItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.scheduleItem.delete({ where: { id } });
    res.json({ success: true, message: 'Schedule item deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete schedule item.', error });
  }
};
