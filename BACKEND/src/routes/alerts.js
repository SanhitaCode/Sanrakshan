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

// Admin check middleware
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Create alert (admin only)
router.post('/', authenticate, isAdmin, async (req, res) => {
  try {
    const { title, description, location, severity } = req.body;
    const alert = await prisma.alert.create({
      data: {
        title,
        description,
        location,
        severity,
        approved: false
      }
    });
    res.status(201).json(alert);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all approved alerts (public)
router.get('/', async (req, res) => {
  try {
    const alerts = await prisma.alert.findMany({
      where: { approved: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get pending alerts (admin only)
router.get('/pending', authenticate, isAdmin, async (req, res) => {
  try {
    const alerts = await prisma.alert.findMany({
      where: { approved: false },
      orderBy: { createdAt: 'desc' }
    });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Approve alert (admin only)
router.patch('/:id/approve', authenticate, isAdmin, async (req, res) => {
  try {
    const alert = await prisma.alert.update({
      where: { id: parseInt(req.params.id) },
      data: { approved: true }
    });
    res.json(alert);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;