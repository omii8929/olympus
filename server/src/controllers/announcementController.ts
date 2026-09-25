import { Request, Response } from 'express';
import { prisma } from '../config/db';
import { Priority } from '@prisma/client';

export const getAnnouncements = async (req: Request, res: Response): Promise<void> => {
  try {
    const { activeOnly } = req.query;
    const whereClause = activeOnly === 'false' ? {} : { active: true };

    const announcements = await prisma.announcement.findMany({
      where: whereClause,
      orderBy: [{ priority: 'asc' }, { publishedAt: 'desc' }],
    });

    res.json({ success: true, count: announcements.length, data: announcements });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch announcements.', error });
  }
};

export const createAnnouncement = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, content, priority, category } = req.body;

    if (!title || !content) {
      res.status(400).json({ success: false, message: 'Title and content are required.' });
      return;
    }

    const announcement = await prisma.announcement.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        priority: (priority as Priority) || Priority.NORMAL,
        category: category?.trim().toUpperCase() || 'GENERAL',
        active: true,
      },
    });

    res.status(201).json({ success: true, message: 'Announcement published successfully.', data: announcement });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create announcement.', error });
  }
};

export const updateAnnouncement = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, content, priority, category, active } = req.body;

    const updated = await prisma.announcement.update({
      where: { id },
      data: {
        ...(title && { title: title.trim() }),
        ...(content && { content: content.trim() }),
        ...(priority && { priority: priority as Priority }),
        ...(category && { category: category.trim().toUpperCase() }),
        ...(typeof active === 'boolean' && { active }),
      },
    });

    res.json({ success: true, message: 'Announcement updated.', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update announcement.', error });
  }
};

export const deleteAnnouncement = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.announcement.delete({ where: { id } });
    res.json({ success: true, message: 'Announcement deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete announcement.', error });
  }
};
