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
    console.log('MongoDB Connected for Master Seed');

    // Clear db
    await Service.deleteMany();
    await User.deleteMany();
    await Booking.deleteMany();

    // 1. Create 10 Services
    const serviceData = [
      { name: 'Classic Haircut', price: 500, duration: 30, category: 'Hair', description: 'Traditional scissor and clipper cut' },
      { name: 'Skin Fade', price: 800, duration: 45, category: 'Hair', description: 'High precision fade' },
      { name: 'Beard Trim', price: 300, duration: 15, category: 'Beard', description: 'Shape and trim your beard' },
      { name: 'Hot Towel Shave', price: 600, duration: 30, category: 'Beard', description: 'Traditional straight razor shave' },
      { name: 'Hair Coloring', price: 1500, duration: 60, category: 'Hair', description: 'Full color treatment' },
      { name: 'Kids Haircut', price: 400, duration: 25, category: 'Hair', description: 'For children under 12' },
      { name: 'Facial Scrub', price: 700, duration: 20, category: 'Wellness', description: 'Exfoliating skin treatment' },
      { name: 'Head Massage', price: 400, duration: 15, category: 'Wellness', description: 'Relaxing oil massage' },
      { name: 'Nose/Ear Waxing', price: 200, duration: 10, category: 'Other', description: 'Quick wax service' },
      { name: 'Full Grooming Package', price: 2500, duration: 120, category: 'Combo', description: 'Haircut, Shave, Facial, and Massage' }
    ];
    const services = await Service.insertMany(serviceData);
    console.log('10 Services seeded');

    const hashedPwd = await bcrypt.hash('password123', 10);

    // 2. Create 10 Barbers
    const barberNames = [
      'Ali Raza', 'Hassan Shah', 'Imran Khan', 'Arsalan Khan', 'Zubair Ahmed',
      'Hamza Ali', 'Bilal Sheikh', 'Usman Butt', 'Kamran Akmal', 'Saqlain Mushtaq'
    ];
    const locations = ['DHA Phase 5', 'Gulberg III', 'Johar Town', 'Model Town', 'Wapda Town', 'Cavalry Ground', 'Bahria Town', 'Defence Raya', 'Lake City', 'Askari 10'];
    
    const barberData = barberNames.map((name, index) => ({
      name,
      email: `${name.split(' ')[0].toLowerCase()}@test.com`,
      password: hashedPwd,
      phone: `0300${1000000 + index}`,
      role: 'barber',
      shopName: `${name.split(' ')[0]}'s Elite Cuts`,
      shopLocation: `${locations[index]}, Lahore`,
      specialization: index % 2 === 0 ? 'Hair Stylist' : 'Beard Expert',
      experience: 3 + index,
      rating: 4 + (index % 10) / 10,
      reviewCount: 50 + (index * 20),
      status: 'available',
      services: services.slice(0, 5).map(s => ({ service: s._id, customPrice: s.price + (index * 10) })),
      workingHours: '10:00 AM - 08:00 PM',
      daysAvailable: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    }));

    const barbers = await User.insertMany(barberData);
    console.log('10 Barbers seeded');

    // 3. Create 15 Customers
    const customerNames = [
      'Fahad Mustafa', 'Danish Taimoor', 'Test Customer', 'Ahsan Khan', 'Humayun Saeed',
      'Fawad Khan', 'Ahad Raza Mir', 'Bilal Abbas', 'Sheheryar Munawar', 'Feroze Khan',
      'Muneeb Butt', 'Affan Waheed', 'Imran Ashraf', 'Zahid Ahmed', 'Wahaj Ali'
    ];

    const customerData = customerNames.map((name, index) => ({
      name,
      email: index === 2 ? 'customer@test.com' : `${name.split(' ')[0].toLowerCase()}@customer.com`,
      phone: `0311${2000000 + index}`,
      password: hashedPwd,
      role: 'customer'
    }));

    const customers = await User.insertMany(customerData);
    console.log('15 Customers seeded');

    // 4. Create Sample Bookings (Some history and some upcoming)
    const bookingData = [];
    // Past bookings
    for (let i = 0; i < 20; i++) {
      const randomBarber = barbers[Math.floor(Math.random() * barbers.length)];
      const randomCustomer = customers[Math.floor(Math.random() * customers.length)];
      const randomService = services[Math.floor(Math.random() * services.length)];
      
      const bookingDate = new Date(Date.now() - (Math.random() * 10 * 24 * 60 * 60 * 1000));
      bookingDate.setHours(0, 0, 0, 0);
      
      bookingData.push({
        customer: randomCustomer._id,
        barber: randomBarber._id,
        service: randomService._id,
        date: bookingDate,
        startTime: '11:00 AM',
        endTime: '11:30 AM',
        status: 'completed',
        amount: randomService.price,
        notes: 'Great service'
      });
    }

    // Upcoming bookings
    for (let i = 0; i < 10; i++) {
      const randomBarber = barbers[Math.floor(Math.random() * barbers.length)];
      const randomCustomer = customers[Math.floor(Math.random() * customers.length)];
      const randomService = services[Math.floor(Math.random() * services.length)];

      const bookingDate = new Date(Date.now() + (Math.random() * 5 * 24 * 60 * 60 * 1000));
      bookingDate.setHours(0, 0, 0, 0);

      bookingData.push({
        customer: randomCustomer._id,
        barber: randomBarber._id,
        service: randomService._id,
        date: bookingDate,
        startTime: '02:00 PM',
        endTime: '02:30 PM',
        status: 'pending',
        amount: randomService.price
      });
    }

    await Booking.insertMany(bookingData);
    console.log('30 Sample Bookings seeded');

    console.log('\n' + '='.repeat(50));
    console.log('MASTER SEED COMPLETE');
    console.log('='.repeat(50));
    console.log('\n--- ALL PASSWORDS ARE: password123 ---\n');
    
    console.log('--- TOP 5 BARBER EMAILS ---');
    barbers.slice(0, 5).forEach(b => console.log(`${b.name.padEnd(20)} | ${b.email}`));
    
    console.log('\n--- TOP 5 CUSTOMER EMAILS ---');
    customers.slice(0, 5).forEach(c => console.log(`${c.name.padEnd(20)} | ${c.email}`));
    
    console.log('\nSpecial Test Accounts:');
    console.log('Barber:   ali@test.com');
    console.log('Customer: customer@test.com');
    console.log('='.repeat(50) + '\n');

    process.exit(0);
  } catch (err) {
    console.error('Seed Error:', err);
    process.exit(1);
  }
};

seedDB();
