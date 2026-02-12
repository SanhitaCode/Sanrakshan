const express = require('express');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// Middleware to verify JWT
const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Trigger SOS
router.post('/trigger', authenticate, async (req, res) => {
  try {
    const { location } = req.body;
    const sos = await prisma.sOS.create({
      data: {
        userId: req.user.userId,
        location: location || 'Unknown',
        status: 'ACTIVE'
      }
    });

    // Emit via Socket.IO if needed
    const io = req.app.get('io');
    io.emit('new-sos', sos);

    res.status(201).json({
      message: 'SOS alert triggered',
      sos
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's SOS history
router.get('/history', authenticate, async (req, res) => {
  try {
    const sosList = await prisma.sOS.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(sosList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Get all SOS alerts (uncomment when admin role ready)
// router.get('/all', authenticate, async (req, res) => {
//   if (req.user.role !== 'ADMIN') {
//     return res.status(403).json({ error: 'Forbidden' });
//   }
//   const allSos = await prisma.sOS.findMany({
//     include: { user: { select: { name: true, email: true } } },
//     orderBy: { createdAt: 'desc' }
//   });
//   res.json(allSos);
// });

module.exports = router;