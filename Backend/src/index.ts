import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Organization routes
app.get('/api/organizations', async (req, res) => {
  try {
    const organizations = await prisma.organization.findMany({
      include: { users: true }
    });
    res.json(organizations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch organizations' });
  }
});

app.get('/api/organizations/:id', async (req, res) => {
  try {
    const organization = await prisma.organization.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { users: true }
    });
    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }
    res.json(organization);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch organization' });
  }
});

app.post('/api/organizations', async (req, res) => {
  try {
    const { name, slug, organizationMail, contact } = req.body;
    
    const organization = await prisma.organization.create({
      data: {
        name,
        slug,
        organizationMail,
        contact,
      },
    });
    
    res.status(201).json(organization);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create organization' });
  }
});

app.put('/api/organizations/:id', async (req, res) => {
  try {
    const { name, slug, organizationMail, contact } = req.body;
    
    const organization = await prisma.organization.update({
      where: { id: parseInt(req.params.id) },
      data: {
        name,
        slug,
        organizationMail,
        contact,
      },
    });
    
    res.json(organization);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update organization' });
  }
});

app.delete('/api/organizations/:id', async (req, res) => {
  try {
    await prisma.organization.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete organization' });
  }
});

// User routes
app.get('/api/organizations/:orgId/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { organizationId: parseInt(req.params.orgId) }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.post('/api/organizations/:orgId/users', async (req, res) => {
  try {
    const { name, role } = req.body;
    const organizationId = parseInt(req.params.orgId);
    
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId }
    });
    
    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }
    
    const email = `${name.toLowerCase().replace(' ', '.')}@${organization.slug}.com`;
    
    const user = await prisma.user.create({
      data: {
        name,
        email,
        role,
        organizationId,
      },
    });
    
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const { name, role } = req.body;
    
    const user = await prisma.user.update({
      where: { id: parseInt(req.params.id) },
      data: { name, role },
    });
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    await prisma.user.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});