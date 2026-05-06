const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all events
router.get('/', async (req, res) => {
  const events = await prisma.event.findMany();
  res.json(events);
});

// Create event
router.post('/', async (req, res) => {
  try {
    const { title, description, startTime, endTime } = req.body;
    const event = await prisma.event.create({
      data: {
        title,
        description,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString()
      }
    });
    res.json(event);
  } catch (error) {
    console.error('POST /events error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update event
router.put('/:id', async (req, res) => {
  try {
    const { title, description, startTime, endTime } = req.body;
    const event = await prisma.event.update({
      where: { id: Number(req.params.id) },
      data: {
        title,
        description,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString()
      }
    });
    res.json(event);
  } catch (error) {
    console.error('PUT /events error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete event
router.delete('/:id', async (req, res) => {
  await prisma.event.delete({ where: { id: Number(req.params.id) } });
  res.json({ message: 'Event deleted' });
});

module.exports = router;