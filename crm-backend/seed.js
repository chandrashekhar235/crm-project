require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');

const User = require('./models/User');
const Client = require('./models/Client');
const Property = require('./models/Property');
const Lead = require('./models/leads');
const Deal = require('./models/Deal');

const seedDB = async () => {
  await connectDB();

  console.log("Clearing DB...");
  await User.deleteMany({});
  await Client.deleteMany({});
  await Property.deleteMany({});
  await Lead.deleteMany({});
  await Deal.deleteMany({});

  console.log("Seeding Admin User...");
  const admin = await User.create({
    name: 'Agent Carter',
    email: 'admin@elevate.com',
    password: 'password123',
    role: 'Admin'
  });

  console.log("Seeding Clients...");
  const clients = await Client.insertMany([
    { name: 'Bruce Wayne', email: 'bruce@wayne.com', phone: '555-0101' },
    { name: 'Tony Stark', email: 'tony@stark.com', phone: '555-0102' },
    { name: 'Diana Prince', email: 'diana@themyscira.com', phone: '555-0103' }
  ]);

  console.log("Seeding Leads...");
  const leads = await Lead.insertMany([
    { name: 'Clark Kent', email: 'clark@dailyplanet.com', phone: '555-0001', budget: 500000, status: 'New' },
    { name: 'Peter Parker', email: 'peter@dailybugle.com', phone: '555-0002', budget: 250000, status: 'Contacted' },
    { name: 'Sarah Miller', email: 'sarah@miller.com', phone: '555-0003', budget: 1200000, status: 'Qualified' }
  ]);

  console.log("Seeding Properties...");
  const properties = await Property.insertMany([
    {
      title: 'Luxury Villa in Beverly Hills',
      description: 'Stunning villa with an infinity pool.',
      price: 2500000,
      type: 'Residential',
      location: 'Beverly Hills, CA',
      status: 'Available',
      agentId: admin._id,
      images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80']
    },
    {
      title: 'Modern Downtown Apartment',
      description: 'Sleek loft in the heart of downtown.',
      price: 850000,
      type: 'Residential',
      location: 'Downtown LA, CA',
      status: 'Sold',
      agentId: admin._id,
      images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80']
    },
    {
      title: 'Commercial Office Space',
      description: 'Prime commercial real estate.',
      price: 4200000,
      type: 'Commercial',
      location: 'San Francisco, CA',
      status: 'Available',
      agentId: admin._id,
      images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80']
    }
  ]);

  console.log("Seeding Deals...");
  // Make closed details with older timestamps so charts look amazing
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 2);
  
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  await Deal.create([
    {
      title: 'Bruce Wayne Mansion Expansion',
      amount: 1500000,
      stage: 'Closed',
      clientId: clients[0]._id,
      agentId: admin._id,
    },
    {
      title: 'Tony Stark Tower Lease',
      amount: 3200000,
      stage: 'Closed',
      clientId: clients[1]._id,
      agentId: admin._id,
    },
    {
      title: 'Island Villa Purchase',
      amount: 950000,
      stage: 'Negotiation',
      clientId: clients[2]._id,
      agentId: admin._id,
    }
  ]);

  // Adjust timestamps directly on mongoose models
  const closedDeals = await Deal.find({ stage: 'Closed' });
  if(closedDeals.length > 0) {
    closedDeals[0].updatedAt = threeMonthsAgo;
    await closedDeals[0].save();
  }
  if(closedDeals.length > 1) {
    closedDeals[1].updatedAt = oneMonthAgo;
    await closedDeals[1].save();
  }

  console.log("Seeding Completed Successfully.");
  process.exit(0);
};

seedDB().catch(console.error);
