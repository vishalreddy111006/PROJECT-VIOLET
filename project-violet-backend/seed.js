require('dotenv').config();
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');

// Import your models based on your folder structure
const User = require('./src/models/User');
const Billboard = require('./src/models/Billboard');
const BookingRequest = require('./src/models/BookingRequest');
const Job = require('./src/models/Job');

const connectDB = async () => {
  try {
    // Notice the change here to MONGODB_URI
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for Seeding...');
  } catch (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    console.log('Clearing existing database collections...');
    await User.deleteMany();
    await Billboard.deleteMany();
    await BookingRequest.deleteMany();
    await Job.deleteMany();

    // -----------------------------------------------------
    // 1. SEED USERS
    // -----------------------------------------------------
    console.log('Generating Users...');
    const users = [];
    const roles = ['customer', 'admin', 'agent'];

    for (let i = 0; i < 30; i++) {
      const role = roles[i % 3];
      const user = new User({
        name: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email().toLowerCase(),
        phone: faker.phone.number({ style: 'national' }),
        password: 'password123',
        role: role,
        status: 'active',
        isVerified: true,
        verificationScore: faker.number.int({ min: 75, max: 100 }),
        // Agents get specific geospatial coordinates (roughly around India)
        ...(role === 'agent' && {
          location: {
            type: 'Point',
            coordinates: [
              faker.location.longitude({ max: 80, min: 72 }),
              faker.location.latitude({ max: 30, min: 10 })
            ]
          },
          availability: true,
          rating: faker.number.float({ min: 3, max: 5, multipleOf: 0.1 })
        })
      });
      users.push(user);
    }
    const savedUsers = await User.insertMany(users);
    console.log(`✅ Created ${savedUsers.length} users.`);

    const admins = savedUsers.filter(u => u.role === 'admin');
    const customers = savedUsers.filter(u => u.role === 'customer');
    const agents = savedUsers.filter(u => u.role === 'agent');

    // -----------------------------------------------------
    // 2. SEED BILLBOARDS
    // -----------------------------------------------------
    console.log('Generating Billboards...');
    const billboards = [];
    for (let i = 0; i < 50; i++) {
      const randomAdmin = faker.helpers.arrayElement(admins);
      billboards.push({
        ownerId: randomAdmin._id,
        title: faker.company.catchPhrase(),
        description: faker.lorem.paragraph(),
        location: {
          type: 'Point',
          coordinates: [
            faker.location.longitude({ max: 80, min: 72 }), 
            faker.location.latitude({ max: 30, min: 10 })
          ],
          address: faker.location.streetAddress(),
          city: faker.location.city(),
          state: faker.location.state(),
          zipCode: faker.location.zipCode()
        },
        specifications: {
          width: faker.number.int({ min: 10, max: 60 }),
          height: faker.number.int({ min: 10, max: 40 }),
          type: faker.helpers.arrayElement(['digital', 'static', 'led', 'backlit'])
        },
        pricing: {
          pricePerDay: faker.number.int({ min: 500, max: 5000 }),
          currency: 'INR'
        },
        availability: { isAvailable: true },
        images: [{ url: faker.image.urlLoremFlickr({ category: 'city' }), isPrimary: true }],
        verification: { status: 'approved', score: faker.number.int({ min: 75, max: 100 }) },
        visibility: { trafficDensity: faker.helpers.arrayElement(['low', 'medium', 'high']) },
        status: 'active'
      });
    }
    const savedBillboards = await Billboard.insertMany(billboards);
    console.log(`✅ Created ${savedBillboards.length} billboards.`);

    // -----------------------------------------------------
    // 3. SEED BOOKING REQUESTS
    // -----------------------------------------------------
    console.log('Generating Bookings...');
    const bookings = [];
    for (let i = 0; i < 40; i++) {
      const randomCustomer = faker.helpers.arrayElement(customers);
      const randomBillboard = faker.helpers.arrayElement(savedBillboards);
      
      const startDate = faker.date.soon({ days: 10 });
      const endDate = faker.date.future({ refDate: startDate, years: 0.1 });
      const diffDays = Math.ceil(Math.abs(endDate - startDate) / (1000 * 60 * 60 * 24));

      bookings.push({
        customerId: randomCustomer._id,
        billboardId: randomBillboard._id,
        ownerId: randomBillboard.ownerId,
        bookingDetails: {
          startDate: startDate,
          endDate: endDate,
          duration: diffDays,
          adContent: {
            title: faker.commerce.productName(),
            description: faker.commerce.productDescription()
          }
        },
        pricing: {
          basePrice: randomBillboard.pricing.pricePerDay,
          totalPrice: randomBillboard.pricing.pricePerDay * diffDays,
          currency: 'INR'
        },
        status: faker.helpers.arrayElement(['pending', 'accepted', 'completed'])
      });
    }
    const savedBookings = await BookingRequest.insertMany(bookings);
    console.log(`✅ Created ${savedBookings.length} booking requests.`);

    // -----------------------------------------------------
    // 4. SEED JOBS (Field Maintenance)
    // -----------------------------------------------------
    console.log('Generating Jobs...');
    const jobs = [];
    
    // Only create jobs for accepted or completed bookings
    const approvedBookings = savedBookings.filter(b => b.status === 'accepted' || b.status === 'completed');

    for (const booking of approvedBookings) {
      // Find the associated billboard to get its exact GPS coordinates
      const billboard = savedBillboards.find(b => b._id.toString() === booking.billboardId.toString());
      const randomAgent = faker.helpers.arrayElement(agents);
      
      const isCompleted = booking.status === 'completed';

      jobs.push({
        bookingRequestId: booking._id,
        billboardId: booking.billboardId,
        customerId: booking.customerId,
        assignedAgentId: randomAgent._id,
        jobType: 'installation',
        location: {
          type: 'Point',
          coordinates: billboard.location.coordinates, // Matches the billboard
          address: billboard.location.address
        },
        scheduledDate: booking.bookingDetails.startDate,
        status: isCompleted ? 'completed' : faker.helpers.arrayElement(['assigned', 'in-progress']),
        payment: {
          amount: faker.number.int({ min: 500, max: 2000 }),
          status: isCompleted ? 'paid' : 'pending'
        },
        ...(isCompleted && {
          completion: {
            completedAt: booking.bookingDetails.startDate,
            proofImages: [{ url: faker.image.urlLoremFlickr({ category: 'construction' }) }],
            verificationStatus: 'verified'
          }
        })
      });
    }
    const savedJobs = await Job.insertMany(jobs);
    console.log(`✅ Created ${savedJobs.length} jobs.`);

    console.log('🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

connectDB().then(seedData);