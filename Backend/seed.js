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
    console.log('MongoDB Connected for Ehsan Salon Master Seed');

    // Clear db
    await Service.deleteMany();
    await User.deleteMany();
    await Booking.deleteMany();

    // 1. Create Services with UK £ Pricing
    const serviceData = [
      { name: 'Classic Haircut', price: 25, duration: 30, category: 'Hair', description: 'Precision scissor & clipper cut with hot towel finish' },
      { name: 'Skin Fade', price: 30, duration: 45, category: 'Hair', description: 'High precision skin fade with detailed edging' },
      { name: 'Beard Trim & Shape', price: 15, duration: 20, category: 'Beard', description: 'Beard sculpting, line-up, and beard oil application' },
      { name: 'Hot Towel Shave', price: 22, duration: 30, category: 'Beard', description: 'Traditional straight razor shave with essential oils' },
      { name: 'Hair Color & Highlights', price: 45, duration: 60, category: 'Hair', description: 'Full gray coverage or modern highlight treatment' },
      { name: 'Junior Haircut (Under 12)', price: 18, duration: 25, category: 'Hair', description: 'Gentle cut and style for kids' },
      { name: 'Charcoal Facial Scrub', price: 25, duration: 20, category: 'Wellness', description: 'Deep cleansing exfoliating facial scrub' },
      { name: 'Scalp & Head Massage', price: 15, duration: 15, category: 'Wellness', description: 'Relaxing hot oil scalp massage' },
      { name: 'Nose & Ear Waxing', price: 10, duration: 10, category: 'Other', description: 'Quick precision wax removal' },
      { name: 'VIP Full Grooming Package', price: 65, duration: 90, category: 'Combo', description: 'Haircut, Hot Towel Shave, Facial, and Head Massage' }
    ];
    const services = await Service.insertMany(serviceData);
    console.log('10 UK Services seeded');

    const hashedPwd = await bcrypt.hash('password123', 10);

    // 2. Create Single Primary Salon Barber Account ("Ehsan Salon")
    const primaryBarber = await User.create({
      name: 'Ehsan Salon',
      email: 'ehsan@salon.co.uk',
      password: hashedPwd,
      phone: '+44 7700 900077',
      role: 'barber',
      shopName: 'Ehsan Salon',
      shopLocation: '142 Oxford Street, London, W1D 1LU, UK',
      bio: 'Premier barbershop in central London offering traditional craftsmanship, modern fades, and luxury grooming experiences.',
      specialization: 'Master Barber & Luxury Grooming',
      experience: 9,
      rating: 4.9,
      reviewCount: 148,
      status: 'available',
      workingHours: '09:00 AM - 08:00 PM',
      breakTime: '01:00 PM - 02:00 PM',
      daysAvailable: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      services: services.map(s => ({ service: s._id, customPrice: s.price, isActive: true }))
    });

    // Also create alias logins (ali@test.com & barber@test.com) for smooth login compatibility
    await User.create({
      name: 'Ehsan Salon (Admin)',
      email: 'barber@test.com',
      password: hashedPwd,
      phone: '+44 7700 900077',
      role: 'barber',
      shopName: 'Ehsan Salon',
      shopLocation: '142 Oxford Street, London, W1D 1LU, UK',
      bio: 'Premier barbershop in central London offering traditional craftsmanship and modern styling.',
      specialization: 'Master Barber',
      experience: 9,
      rating: 4.9,
      reviewCount: 148,
      status: 'available',
      workingHours: '09:00 AM - 08:00 PM',
      daysAvailable: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      services: services.map(s => ({ service: s._id, customPrice: s.price, isActive: true }))
    });

    await User.create({
      name: 'Ehsan Salon (Ali)',
      email: 'ali@test.com',
      password: hashedPwd,
      phone: '+44 7700 900078',
      role: 'barber',
      shopName: 'Ehsan Salon',
      shopLocation: '142 Oxford Street, London, W1D 1LU, UK',
      specialization: 'Beard Specialist',
      experience: 6,
      rating: 4.8,
      reviewCount: 94,
      status: 'available',
      workingHours: '09:00 AM - 08:00 PM',
      daysAvailable: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      services: services.map(s => ({ service: s._id, customPrice: s.price, isActive: true }))
    });

    console.log('Primary Salon Barber seeded: Ehsan Salon (ehsan@salon.co.uk)');

    // 3. Create Sample UK Customers
    const customerNames = [
      'Oliver Smith', 'Jack Williams', 'Test Customer', 'Harry Brown', 'George Taylor',
      'James Wilson', 'William Davies', 'Noah Evans', 'Liam Thomas', 'Alexander Roberts',
      'Ethan Johnson', 'Mason Lewis', 'Jacob Walker', 'Oscar Robinson', 'Charlie Wood'
    ];

    const customerData = customerNames.map((name, index) => ({
      name,
      email: index === 2 ? 'customer@test.com' : `${name.split(' ')[0].toLowerCase()}@ukmail.co.uk`,
      phone: `+44 7911 ${100000 + index}`,
      password: hashedPwd,
      role: 'customer'
    }));

    const customers = await User.insertMany(customerData);
    console.log('15 Customers seeded');

    // 4. Create Sample Bookings bound to Ehsan Salon
    const bookingData = [];
    const timeSlots = ['09:30 AM', '10:30 AM', '11:30 AM', '02:30 PM', '03:30 PM', '04:30 PM', '05:30 PM', '06:30 PM'];

    // Past bookings
    for (let i = 0; i < 15; i++) {
      const randomCustomer = customers[Math.floor(Math.random() * customers.length)];
      const randomService = services[Math.floor(Math.random() * services.length)];
      const randomSlot = timeSlots[Math.floor(Math.random() * timeSlots.length)];
      
      const bookingDate = new Date(Date.now() - (Math.random() * 10 * 24 * 60 * 60 * 1000));
      bookingDate.setHours(0, 0, 0, 0);
      
      bookingData.push({
        customer: randomCustomer._id,
        barber: primaryBarber._id,
        service: randomService._id,
        date: bookingDate,
        startTime: randomSlot,
        endTime: '12:00 PM',
        status: 'completed',
        amount: randomService.price,
        notes: 'Excellent cut as always!'
      });
    }

    // Today & Upcoming bookings
    for (let i = 0; i < 8; i++) {
      const randomCustomer = customers[Math.floor(Math.random() * customers.length)];
      const randomService = services[Math.floor(Math.random() * services.length)];
      const randomSlot = timeSlots[i % timeSlots.length];

      const isToday = i < 4;
      const bookingDate = isToday 
        ? new Date() 
        : new Date(Date.now() + ((i - 3) * 24 * 60 * 60 * 1000));
      bookingDate.setHours(0, 0, 0, 0);

      bookingData.push({
        customer: randomCustomer._id,
        barber: primaryBarber._id,
        service: randomService._id,
        date: bookingDate,
        startTime: randomSlot,
        endTime: '01:00 PM',
        status: i % 2 === 0 ? 'confirmed' : 'pending',
        amount: randomService.price,
        notes: 'Customer requested sharp fade'
      });
    }

    await Booking.insertMany(bookingData);
    console.log('23 Sample Bookings seeded for Ehsan Salon');

    console.log('\n' + '='.repeat(50));
    console.log('EHSAN SALON MASTER SEED COMPLETE');
    console.log('='.repeat(50));
    console.log('\n--- ALL PASSWORDS ARE: password123 ---\n');
    console.log('Salon Admin Logins:');
    console.log('Primary:  ehsan@salon.co.uk');
    console.log('Test 1:   barber@test.com');
    console.log('Test 2:   ali@test.com');
    console.log('\nCustomer Login:');
    console.log('Customer: customer@test.com');
    console.log('='.repeat(50) + '\n');

    process.exit(0);
  } catch (err) {
    console.error('Seed Error:', err);
    process.exit(1);
  }
};

seedDB();
