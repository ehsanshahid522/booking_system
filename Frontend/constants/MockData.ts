export type BarberStatus = 'available' | 'busy' | 'off_duty';
export type BookingStatus = 'pending' | 'confirmed' | 'rejected' | 'completed' | 'cancelled' | 'rescheduled' | 'no_show';
export type PaymentMethod = 'cash' | 'card' | 'online';
export type PaymentStatus = 'paid' | 'pending' | 'refunded';
export type UserRole = 'customer' | 'barber' | 'admin';
export type NotificationChannel = 'in_app' | 'sms' | 'email';
export type MessageType = 'text' | 'image' | 'booking_note';

// ─── SERVICES ────────────────────────────────────────────────────────────────
export const SERVICES = [
  { id: 's1', name: 'Haircut', price: 800, duration: 30, category: 'Hair', description: 'Classic & modern haircut styles', icon: '✂️' },
  { id: 's2', name: 'Beard Trim', price: 500, duration: 20, category: 'Beard', description: 'Shape & style your beard perfectly', icon: '🪒' },
  { id: 's3', name: 'Hair Wash', price: 300, duration: 15, category: 'Hair', description: 'Deep cleanse with premium shampoo', icon: '🚿' },
  { id: 's4', name: 'Facial', price: 1200, duration: 45, category: 'Skin', description: 'Rejuvenating facial treatment', icon: '💆' },
  { id: 's5', name: 'Hair Styling', price: 600, duration: 25, category: 'Hair', description: 'Event-ready expert styling', icon: '💈' },
  { id: 's6', name: 'Kids Haircut', price: 600, duration: 25, category: 'Hair', description: 'Fun & gentle cuts for kids', icon: '👦' },
  { id: 's7', name: 'Head Massage', price: 400, duration: 20, category: 'Wellness', description: 'Relaxing scalp & temple massage', icon: '🙆' },
  { id: 's8', name: 'Hair Color', price: 2000, duration: 60, category: 'Hair', description: 'Full color treatment & highlights', icon: '🎨' },
  { id: 's9', name: 'Hair + Beard Combo', price: 1200, duration: 45, category: 'Combo', description: 'Complete grooming package', icon: '⭐' },
  { id: 's10', name: 'Shave', price: 400, duration: 20, category: 'Beard', description: 'Classic hot towel straight razor shave', icon: '🪥' },
];

// ─── BARBERS ──────────────────────────────────────────────────────────────────
export const BARBERS = [
  {
    id: 'b1', name: 'Ahmed Ali', initials: 'AA', color: '#C9A84C',
    experience: 5, specialization: 'Haircut Specialist',
    rating: 4.8, reviewCount: 124, status: 'available' as BarberStatus,
    bio: 'Expert in modern & classic haircut styles. 5+ years of experience in top salons.',
    workingHours: '10:00 AM – 8:00 PM', breakTime: '2:00 PM – 3:00 PM',
    daysAvailable: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    services: ['s1', 's2', 's3', 's5', 's9'],
    price: 'Rs. 500 – 2000',
  },
  {
    id: 'b2', name: 'Bilal Hassan', initials: 'BH', color: '#E53935',
    experience: 8, specialization: 'Beard Specialist',
    rating: 4.9, reviewCount: 203, status: 'busy' as BarberStatus,
    bio: 'Master barber specializing in beard shaping, hot towel shaves, and grooming.',
    workingHours: '9:00 AM – 7:00 PM', breakTime: '1:00 PM – 2:00 PM',
    daysAvailable: ['Mon', 'Tue', 'Wed', 'Fri', 'Sat', 'Sun'],
    services: ['s1', 's2', 's10', 's9'],
    price: 'Rs. 400 – 1500',
  },
  {
    id: 'b3', name: 'Usman Khan', initials: 'UK', color: '#1E88E5',
    experience: 3, specialization: 'All-Rounder',
    rating: 4.5, reviewCount: 87, status: 'available' as BarberStatus,
    bio: 'Versatile barber skilled in hair, beard, and skin care treatments.',
    workingHours: '11:00 AM – 9:00 PM', breakTime: '3:00 PM – 4:00 PM',
    daysAvailable: ['Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    services: ['s1', 's2', 's3', 's4', 's7'],
    price: 'Rs. 300 – 1200',
  },
  {
    id: 'b4', name: 'Farhan Raza', initials: 'FR', color: '#8E24AA',
    experience: 6, specialization: 'Hair Styling Expert',
    rating: 4.7, reviewCount: 156, status: 'off_duty' as BarberStatus,
    bio: 'Creative hair stylist specializing in color treatments, highlights and modern styles.',
    workingHours: '10:00 AM – 8:00 PM', breakTime: '2:30 PM – 3:30 PM',
    daysAvailable: ['Mon', 'Wed', 'Thu', 'Fri', 'Sat'],
    services: ['s1', 's5', 's8'],
    price: 'Rs. 600 – 3000',
  },
  {
    id: 'b5', name: 'Zubair Ahmed', initials: 'ZA', color: '#00897B',
    experience: 4, specialization: 'Kids Specialist',
    rating: 4.6, reviewCount: 98, status: 'available' as BarberStatus,
    bio: 'Gentle and patient barber who specializes in kids\' haircuts and styling.',
    workingHours: '10:00 AM – 6:00 PM', breakTime: '1:00 PM – 1:30 PM',
    daysAvailable: ['Mon', 'Tue', 'Wed', 'Thu', 'Sat', 'Sun'],
    services: ['s1', 's6', 's3'],
    price: 'Rs. 300 – 1000',
  },
];

// ─── TIME SLOTS ───────────────────────────────────────────────────────────────
export const TIME_SLOTS = [
  '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM',
  '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
  '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM',
  '07:00 PM', '07:30 PM',
];

export const BOOKED_SLOTS = ['11:00 AM', '12:00 PM', '04:00 PM', '05:30 PM'];

// ─── BOOKINGS ─────────────────────────────────────────────────────────────────
export const BOOKINGS = [
  {
    id: 'bk1', customerId: 'c1', barberId: 'b1', serviceId: 's1',
    barberName: 'Ahmed Ali', barberInitials: 'AA', barberColor: '#C9A84C',
    serviceName: 'Haircut', date: '2026-03-14', startTime: '10:30 AM', endTime: '11:00 AM',
    status: 'confirmed' as BookingStatus, notes: 'Fade on the sides please',
    paymentStatus: 'paid' as PaymentStatus, paymentMethod: 'online' as PaymentMethod,
    amount: 800, createdAt: '2026-03-12',
  },
  {
    id: 'bk2', customerId: 'c1', barberId: 'b2', serviceId: 's2',
    barberName: 'Bilal Hassan', barberInitials: 'BH', barberColor: '#E53935',
    serviceName: 'Beard Trim', date: '2026-03-18', startTime: '03:30 PM', endTime: '03:50 PM',
    status: 'pending' as BookingStatus, notes: '',
    paymentStatus: 'pending' as PaymentStatus, paymentMethod: 'cash' as PaymentMethod,
    amount: 500, createdAt: '2026-03-12',
  },
  {
    id: 'bk3', customerId: 'c1', barberId: 'b1', serviceId: 's9',
    barberName: 'Ahmed Ali', barberInitials: 'AA', barberColor: '#C9A84C',
    serviceName: 'Hair + Beard Combo', date: '2026-02-28', startTime: '11:00 AM', endTime: '11:45 AM',
    status: 'completed' as BookingStatus, notes: 'Regular style',
    paymentStatus: 'paid' as PaymentStatus, paymentMethod: 'online' as PaymentMethod,
    amount: 1200, createdAt: '2026-02-25',
  },
  {
    id: 'bk4', customerId: 'c1', barberId: 'b4', serviceId: 's8',
    barberName: 'Farhan Raza', barberInitials: 'FR', barberColor: '#8E24AA',
    serviceName: 'Hair Color', date: '2026-02-20', startTime: '12:00 PM', endTime: '01:00 PM',
    status: 'cancelled' as BookingStatus, notes: 'Decided to cancel',
    paymentStatus: 'refunded' as PaymentStatus, paymentMethod: 'card' as PaymentMethod,
    amount: 2000, createdAt: '2026-02-18',
  },
];

// ─── TODAY SCHEDULE (for Barber) ─────────────────────────────────────────────
export const TODAY_SCHEDULE = [
  {
    id: 'ts1', time: '10:30 AM', endTime: '11:00 AM',
    customerName: 'Ali Raza', customerInitials: 'AR', customerColor: '#1E88E5',
    service: 'Haircut', status: 'completed' as BookingStatus, amount: 800,
  },
  {
    id: 'ts2', time: '11:30 AM', endTime: '12:00 PM',
    customerName: 'Hassan Saeed', customerInitials: 'HS', customerColor: '#43A047',
    service: 'Beard Trim', status: 'completed' as BookingStatus, amount: 500,
  },
  {
    id: 'ts3', time: '03:00 PM', endTime: '03:45 PM',
    customerName: 'Kamran Malik', customerInitials: 'KM', customerColor: '#FF7043',
    service: 'Hair + Beard Combo', status: 'confirmed' as BookingStatus, amount: 1200,
  },
  {
    id: 'ts4', time: '04:00 PM', endTime: '04:30 PM',
    customerName: 'Tariq Ahmed', customerInitials: 'TA', customerColor: '#AB47BC',
    service: 'Haircut', status: 'confirmed' as BookingStatus, amount: 800,
  },
  {
    id: 'ts5', time: '05:30 PM', endTime: '05:50 PM',
    customerName: 'Imran Khan', customerInitials: 'IK', customerColor: '#26C6DA',
    service: 'Beard Trim', status: 'pending' as BookingStatus, amount: 500,
  },
];

// ─── BOOKING REQUESTS (for Barber) ───────────────────────────────────────────
export const BOOKING_REQUESTS = [
  {
    id: 'br1', customerName: 'Imran Khan', customerInitials: 'IK', customerColor: '#26C6DA',
    service: 'Beard Trim', date: '2026-03-13', time: '05:30 PM', amount: 500, notes: '',
  },
  {
    id: 'br2', customerName: 'Saad Butt', customerInitials: 'SB', customerColor: '#FF7043',
    service: 'Haircut', date: '2026-03-15', time: '10:00 AM', amount: 800, notes: 'High fade please',
  },
  {
    id: 'br3', customerName: 'Waqas Ali', customerInitials: 'WA', customerColor: '#66BB6A',
    service: 'Hair + Beard Combo', date: '2026-03-16', time: '03:30 PM', amount: 1200, notes: 'Same style as last time',
  },
];

// ─── MESSAGES ─────────────────────────────────────────────────────────────────
export const CHAT_CONVERSATIONS = [
  {
    id: 'chat1', bookingId: 'bk1',
    otherUser: { name: 'Ahmed Ali', initials: 'AA', color: '#C9A84C', role: 'barber' },
    lastMessage: 'Your appointment is confirmed for tomorrow at 10:30 AM!',
    lastTime: '10:32 AM', unreadCount: 1, bookingRef: 'Booking #BK001 – Haircut',
  },
  {
    id: 'chat2', bookingId: 'bk2',
    otherUser: { name: 'Bilal Hassan', initials: 'BH', color: '#E53935', role: 'barber' },
    lastMessage: 'I will be there on time. Looking forward!',
    lastTime: 'Yesterday', unreadCount: 0, bookingRef: 'Booking #BK002 – Beard Trim',
  },
];

export const CHAT_MESSAGES = [
  { id: 'm1', senderId: 'b1', text: 'Hello! Your booking for Haircut on Mar 14 is confirmed.', time: '10:30 AM', isRead: true },
  { id: 'm2', senderId: 'c1', text: 'Great! Please do a fade on the sides.', time: '10:31 AM', isRead: true },
  { id: 'm3', senderId: 'b1', text: 'Sure! I will take care of that. See you at 10:30 AM!', time: '10:32 AM', isRead: false },
];

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────
export const NOTIFICATIONS = [
  { id: 'n1', title: 'Booking Confirmed! ✅', body: 'Your Haircut with Ahmed Ali on Mar 14 at 10:30 AM is confirmed.', type: 'booking', isRead: false, time: '5 min ago' },
  { id: 'n2', title: 'Appointment Reminder ⏰', body: 'Your appointment is tomorrow at 10:30 AM. Don\'t be late!', type: 'reminder', isRead: false, time: '1 hour ago' },
  { id: 'n3', title: 'Special Offer 🎉', body: 'Get 20% off on all beard services this Friday only!', type: 'promo', isRead: true, time: '2 days ago' },
  { id: 'n4', title: 'Review Your Last Visit ⭐', body: 'How was your experience with Bilal Hassan? Leave a review!', type: 'review', isRead: true, time: '3 days ago' },
  { id: 'n5', title: 'New Barber Joined! 💈', body: 'Zubair Ahmed has joined BarberPro. Book your first appointment!', type: 'system', isRead: true, time: '1 week ago' },
];

// ─── PAYMENTS ─────────────────────────────────────────────────────────────────
export const PAYMENTS = [
  { id: 'p1', bookingId: 'bk1', service: 'Haircut', barber: 'Ahmed Ali', amount: 800, method: 'Online', status: 'paid', date: '2026-03-12' },
  { id: 'p2', bookingId: 'bk3', service: 'Hair + Beard Combo', barber: 'Ahmed Ali', amount: 1200, method: 'Online', status: 'paid', date: '2026-02-28' },
  { id: 'p3', bookingId: 'bk4', service: 'Hair Color', barber: 'Farhan Raza', amount: 2000, method: 'Card', status: 'refunded', date: '2026-02-20' },
];

// ─── ADMIN STATS ──────────────────────────────────────────────────────────────
export const ADMIN_STATS = {
  totalBookings: 348,
  todayAppointments: 12,
  completedToday: 7,
  pendingToday: 5,
  totalRevenue: 284500,
  monthRevenue: 38200,
  activeBarbers: 5,
  totalCustomers: 187,
  cancelRate: '8%',
  avgRating: 4.7,
};

export const ADMIN_BOOKINGS = [
  { id: 'ab1', customer: 'Ali Raza', barber: 'Ahmed Ali', service: 'Haircut', date: '2026-03-14', time: '10:30 AM', status: 'confirmed' as BookingStatus, amount: 800 },
  { id: 'ab2', customer: 'Hassan Saeed', barber: 'Bilal Hassan', service: 'Beard Trim', date: '2026-03-14', time: '11:30 AM', status: 'completed' as BookingStatus, amount: 500 },
  { id: 'ab3', customer: 'Kamran Malik', barber: 'Usman Khan', service: 'Facial', date: '2026-03-14', time: '12:00 PM', status: 'pending' as BookingStatus, amount: 1200 },
  { id: 'ab4', customer: 'Tariq Ahmed', barber: 'Farhan Raza', service: 'Hair Color', date: '2026-03-13', time: '03:00 PM', status: 'cancelled' as BookingStatus, amount: 2000 },
  { id: 'ab5', customer: 'Imran Khan', barber: 'Zubair Ahmed', service: 'Kids Haircut', date: '2026-03-13', time: '04:30 PM', status: 'completed' as BookingStatus, amount: 600 },
];

// ─── CUSTOMERS LIST (for Admin) ───────────────────────────────────────────────
export const CUSTOMERS_LIST = [
  { id: 'c1', name: 'Ali Raza', initials: 'AR', color: '#1E88E5', phone: '+92 300 1234567', email: 'customer@test.com', totalBookings: 12, lastVisit: '2026-03-12', totalSpent: 14400, favoriteBarber: 'Ahmed Ali' },
  { id: 'c2', name: 'Hassan Saeed', initials: 'HS', color: '#43A047', phone: '+92 311 2345678', email: 'hassan@test.com', totalBookings: 8, lastVisit: '2026-03-11', totalSpent: 9600, favoriteBarber: 'Bilal Hassan' },
  { id: 'c3', name: 'Kamran Malik', initials: 'KM', color: '#FF7043', phone: '+92 321 3456789', email: 'kamran@test.com', totalBookings: 5, lastVisit: '2026-03-10', totalSpent: 6000, favoriteBarber: 'Usman Khan' },
];

export const WEEK_REVENUE = [
  { day: 'Mon', amount: 5400 },
  { day: 'Tue', amount: 7200 },
  { day: 'Wed', amount: 4800 },
  { day: 'Thu', amount: 9100 },
  { day: 'Fri', amount: 11200 },
  { day: 'Sat', amount: 8600 },
  { day: 'Sun', amount: 3200 },
];
