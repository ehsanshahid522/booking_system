import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import Service from './src/models/Service.js';
import User from './src/models/User.js';
import Booking from './src/models/Booking.js';

dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Seed');

    // Clear db
    await Service.deleteMany();
    await User.deleteMany();
    await Booking.deleteMany();

    // Create 3 services
    const services = await Service.insertMany([
      { name: 'Premium Haircut', price: 600, duration: 30, category: 'Hair', description: 'Standard haircut' },
      { name: 'Royal Beard Trim', price: 400, duration: 20, category: 'Beard', description: 'Beard trim and shape' },
      { name: 'Relaxing Facial', price: 1000, duration: 45, category: 'Wellness', description: 'Deep cleansing facial' }
    ]);
    console.log('Services seeded');

    const hashedPwd = await bcrypt.hash('password123', 10);

    // Create 3 barbers (original test barbers)
    const barbers = await User.insertMany([
      {
        name: 'Ali Raza',
        email: 'ali@test.com',
        password: hashedPwd,
        phone: '03001234567',
        role: 'barber',
        shopName: 'Ali\'s Premium Cuts',
        shopLocation: 'DHA Phase 5, Lahore',
        specialization: 'Hair Stylist',
        experience: 5,
        rating: 4.8,
        reviewCount: 120,
        status: 'available',
        services: services.map(s => ({ service: s._id, customPrice: s.price + 100 })),
        workingHours: '10:00 AM - 08:00 PM',
        daysAvailable: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      },
      {
        name: 'Hassan Shah',
        email: 'hassan@test.com',
        password: hashedPwd,
        phone: '03009876543',
        role: 'barber',
        shopName: 'Royal Beard Lounge',
        shopLocation: 'Gulberg III, Lahore',
        specialization: 'Beard Specialist',
        experience: 8,
        rating: 4.9,
        reviewCount: 300,
        status: 'available',
        services: services.map(s => ({ service: s._id, customPrice: s.price })),
        workingHours: '12:00 PM - 09:00 PM',
        daysAvailable: ['Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      {
        name: 'Imran Khan',
        email: 'imran@test.com',
        password: hashedPwd,
        phone: '03001112233',
        role: 'barber',
        shopName: 'The Grooming Studio',
        shopLocation: 'Johar Town, Lahore',
        specialization: 'Skin & Grooming',
        experience: 3,
        rating: 4.6,
        reviewCount: 85,
        status: 'available',
        services: [
          { service: services[0]._id, customPrice: 500 }, 
          { service: services[2]._id, customPrice: 1200 }
        ],
        workingHours: '09:00 AM - 06:00 PM',
        daysAvailable: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
      },
      // --- NEW TEST BARBERS ---
      {
        name: 'Arsalan Khan',
        email: 'arsalan@test.com',
        password: hashedPwd,
        phone: '03211234567',
        role: 'barber',
        shopName: 'Arsalan Cuts',
        shopLocation: 'Gulberg, Lahore',
        specialization: 'Classic Cuts',
        experience: 4,
        rating: 4.7,
        reviewCount: 95,
        status: 'available',
        services: services.map(s => ({ service: s._id, customPrice: s.price + 200 })),
        workingHours: '10:00 AM - 07:00 PM',
        daysAvailable: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      },
      {
        name: 'Zubair Ahmed',
        email: 'zubair@test.com',
        password: hashedPwd,
        phone: '03329876543',
        role: 'barber',
        shopName: 'Zubair Salon',
        shopLocation: 'DHA, Lahore',
        specialization: 'Modern Styles',
        experience: 6,
        rating: 4.5,
        reviewCount: 150,
        status: 'available',
        services: services.map(s => ({ service: s._id, customPrice: s.price + 50 })),
        workingHours: '11:00 AM - 08:00 PM',
        daysAvailable: ['Mon', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      {
        name: 'Hamza Ali',
        email: 'hamza@test.com',
        password: hashedPwd,
        phone: '03451112233',
        role: 'barber',
        shopName: 'Hamza Barbers',
        shopLocation: 'Model Town, Lahore',
        specialization: 'Fade & Beard Expert',
        experience: 7,
        rating: 4.9,
        reviewCount: 210,
        status: 'available',
        services: [
          { service: services[0]._id, customPrice: 1200 },
          { service: services[1]._id, customPrice: 600 },
          { service: services[2]._id, customPrice: 1500 }
        ],
        workingHours: '09:00 AM - 09:00 PM',
        daysAvailable: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      }
    ]);
    console.log('6 Barbers seeded (3 original + 3 new test barbers)');

    // Create 3 Customers
    const customers = await User.insertMany([
      {
        name: 'Fahad Mustafa',
        email: 'fahad@customer.com',
        phone: '03112223344',
        password: hashedPwd,
        role: 'customer'
      },
      {
        name: 'Danish Taimoor',
        email: 'danish@customer.com',
        phone: '03223334455',
        password: hashedPwd,
        role: 'customer'
      },
      {
        name: 'Test Customer',
        email: 'customer@test.com',
        phone: '03334445566',
        password: hashedPwd,
        role: 'customer'
      }
    ]);
    console.log('3 Customers seeded');

    console.log('\n=== SEED COMPLETE ===');
    console.log('--- BARBERS ---');
    console.log('Ali Raza         | ali@test.com      | password123');
    console.log('Hassan Shah      | hassan@test.com   | password123');
    console.log('Imran Khan       | imran@test.com    | password123');
    console.log('Arsalan Khan     | arsalan@test.com  | password123');
    console.log('Zubair Ahmed     | zubair@test.com   | password123');
    console.log('Hamza Ali        | hamza@test.com    | password123');
    console.log('\n--- CUSTOMERS ---');
    console.log('Fahad Mustafa    | fahad@customer.com    | password123');
    console.log('Danish Taimoor   | danish@customer.com   | password123');
    console.log('Test Customer    | customer@test.com     | password123');
    console.log('=====================\n');

    process.exit(0);
  } catch (err) {
    console.error('Seed Error:', err);
    process.exit(1);
  }
};

seedDB();
