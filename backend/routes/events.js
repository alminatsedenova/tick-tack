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
  const { title, description, startTime, endTime } = req.body;
  const event = await prisma.event.create({
    data: { title, description, startTime, endTime }
  });
  res.json(event);
});

// Update event
router.put('/:id', async (req, res) => {
  const { title, description, startTime, endTime } = req.body;
  const event = await prisma.event.update({
    where: { id: Number(req.params.id) },
    data: { title, description, startTime, endTime }
  });
  res.json(event);
});

// Delete event
router.delete('/:id', async (req, res) => {
  await prisma.event.delete({ where: { id: Number(req.params.id) } });
  res.json({ message: 'Event deleted' });
});

module.exports = router;