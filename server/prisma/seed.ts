import { PrismaClient, Role, EventType, RegStatus, PaymentStatus, Priority } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting OLYMPUS Database Seed ---');

  // 1. Seed Initial Super Admin (omupotalkar25@coep.sveri.ac.in)
  const userSuperEmail = process.env.INITIAL_ADMIN_EMAIL || 'omupotalkar25@coep.sveri.ac.in';
  const initialAdminPass = process.env.INITIAL_ADMIN_PASSWORD || 'Sveri@123';
  const userSuperPassHash = await bcrypt.hash(initialAdminPass, 10);
  const userSuperAdmin = await prisma.user.upsert({
    where: { email: userSuperEmail },
    update: {
      role: Role.SUPER_ADMIN,
      isActive: true,
      passwordHash: userSuperPassHash,
    },
    create: {
      email: userSuperEmail,
      name: 'Omprakash Potalkar (Super Admin)',
      passwordHash: userSuperPassHash,
      role: Role.SUPER_ADMIN,
      isActive: true,
    },
  });
  console.log(`Verified Super Admin: ${userSuperAdmin.email} [${userSuperAdmin.role}]`);

  const superAdminEmail = 'admin@olympus.ece';
  const superAdminPassHash = await bcrypt.hash('OlympusAdmin@2026', 10);
  const superAdmin = await prisma.user.upsert({
    where: { email: superAdminEmail },
    update: { role: Role.SUPER_ADMIN },
    create: {
      email: superAdminEmail,
      name: 'Olympus Super Admin Command',
      passwordHash: superAdminPassHash,
      role: Role.SUPER_ADMIN,
    },
  });
  console.log(`Verified Super Admin: ${superAdmin.email} [${superAdmin.role}]`);

  const staffEmail = 'staff@olympus.ece';
  const staffPassHash = await bcrypt.hash('OlympusStaff@2026', 10);
  const staffAdmin = await prisma.user.upsert({
    where: { email: staffEmail },
    update: { role: Role.ADMIN },
    create: {
      email: staffEmail,
      name: 'Olympus Staff Verifier',
      passwordHash: staffPassHash,
      role: Role.ADMIN,
    },
  });
  console.log(`Verified Staff Admin: ${staffAdmin.email} [${staffAdmin.role}]`);

  // 1.5 Seed Two Independent Events with Distinct Payment Settings
  const event1 = await prisma.event.upsert({
    where: { code: 'FULL_STACK_AI' },
    update: {},
    create: {
      code: 'FULL_STACK_AI',
      name: 'FULL STACK DEVELOPMENT WITH AI',
      category: 'Full Stack Development with AI',
      registrationFee: 100,
      paymentMobile: '9876543210',
      upiId: 'olympus.fullstack@upi',
      qrCodeUrl: '/uploads/qr/qr-event-1.svg',
      paymentInstructions: 'Complete payment using the QR code, UPI ID, or mobile number for Arena 01. Then submit your UTR number and payment screenshot.',
      paymentEnabled: true,
      lastUpdatedBy: superAdminEmail,
    },
  });
  console.log(`Verified Event 1: ${event1.name} (Fee: ₹${event1.registrationFee}, UPI: ${event1.upiId})`);

  const event2 = await prisma.event.upsert({
    where: { code: 'DRONE_EVENT' },
    update: {},
    create: {
      code: 'DRONE_EVENT',
      name: "ENGINEER'S GOT TALENT",
      category: 'Drone Technology',
      registrationFee: 100,
      paymentMobile: '9123456789',
      upiId: 'olympus.drone@upi',
      qrCodeUrl: '/uploads/qr/qr-event-2.svg',
      paymentInstructions: "Complete payment using the Drone Technology QR code, UPI ID, or mobile number for Arena 02. Then submit your UTR number and payment screenshot.",
      paymentEnabled: true,
      lastUpdatedBy: superAdminEmail,
    },
  });
  console.log(`Verified Event 2: ${event2.name} (Fee: ₹${event2.registrationFee}, UPI: ${event2.upiId})`);

  // 2. Seed Announcements
  const countAnnouncements = await prisma.announcement.count();
  if (countAnnouncements === 0) {
    await prisma.announcement.createMany({
      data: [
        {
          title: 'OLYMPUS 2026 Registration is Now Open',
          content: 'Registrations are now officially live for Full Stack Development with AI and Engineer’s Got Talent (Drone Technology). All branches are eligible.',
          priority: Priority.HIGH,
          category: 'GENERAL',
          active: true,
        },
        {
          title: 'Full Stack with AI — Tool Guidelines',
          content: 'Participants may use AI tools, but must be able to thoroughly explain implementation, architectural decisions, and code during judge evaluation.',
          priority: Priority.NORMAL,
          category: 'FULL_STACK',
          active: true,
        },
        {
          title: 'Drone Technology Theme Brief',
          content: 'Submissions for Video Making and Poster Making must strictly align with the theme: Drone Technology. Original work only.',
          priority: Priority.NORMAL,
          category: 'DRONE',
          active: true,
        },
      ],
    });
    console.log('Seeded announcements.');
  }

  // 3. Seed Schedule Items (Truthful to Rulebook: Configurable without fabricating unauthorized times)
  const countSchedule = await prisma.scheduleItem.count();
  if (countSchedule === 0) {
    await prisma.scheduleItem.createMany({
      data: [
        {
          title: 'Reporting & Badge Verification',
          description: 'Team check-in, participant digital pass verification, and welcome briefing.',
          date: '02 October 2026',
          time: '09:00 AM – 10:00 AM',
          venue: "Idea Lab, SVERI's College of Engineering",
          round: 'CHECK-IN',
          order: 1,
        },
        {
          title: 'Arena 01 — Round 1: Frontend Development',
          description: 'UI/UX architecture, responsive layout implementation, and design system creation.',
          date: '02 October 2026',
          time: '10:00 AM – 12:30 PM',
          venue: "Idea Lab, SVERI's College of Engineering",
          round: 'ROUND 01',
          order: 2,
        },
        {
          title: 'Arena 02 — Drone Technology Showcases',
          description: 'Evaluation of Video Making and Poster Making submissions by technical panel.',
          date: '02 October 2026',
          time: '11:00 AM – 04:00 PM',
          venue: "Idea Lab, SVERI's College of Engineering",
          round: 'EXHIBITION',
          order: 3,
        },
        {
          title: 'Arena 01 — Round 2: Backend / API Integration',
          description: 'API development, data persistence, and AI model/pipeline integration.',
          date: '02 October 2026',
          time: '01:30 PM – 03:30 PM',
          venue: "Idea Lab, SVERI's College of Engineering",
          round: 'ROUND 02',
          order: 4,
        },
        {
          title: 'Arena 01 — Round 3: Deployment & Presentation',
          description: 'Live deployment demonstration, architecture presentation, and Q&A with the jury.',
          date: '02 October 2026',
          time: '03:45 PM – 05:00 PM',
          venue: "Idea Lab, SVERI's College of Engineering",
          round: 'ROUND 03',
          order: 5,
        },
        {
          title: 'Grand Valedictory & Award Ceremony',
          description: 'Announcement of winners and distribution of honors.',
          date: '02 October 2026',
          time: '05:15 PM – 06:00 PM',
          venue: "Idea Lab, SVERI's College of Engineering",
          round: 'FINALE',
          order: 6,
        },
      ],
    });
    console.log('Seeded schedule items.');
  }

  // 4. Seed a Sample Verified Registration
  const countTeams = await prisma.team.count();
  if (countTeams === 0) {
    const team = await prisma.team.create({
      data: {
        teamCode: 'TM-7721',
        name: 'Apex Circuits',
        eventType: EventType.FULL_STACK_AI,
        participants: {
          create: [
            {
              name: 'Arjun Rao',
              email: 'arjun.rao@college.edu',
              phone: '9876543210',
              branch: 'Electronics and Communication Engineering',
              college: 'National Institute of Technology',
              isLeader: true,
            },
            {
              name: 'Neha Sharma',
              email: 'neha.sharma@college.edu',
              phone: '9876543211',
              branch: 'Computer Science & Engineering',
              college: 'National Institute of Technology',
              isLeader: false,
            },
            {
              name: 'Kavya Verma',
              email: 'kavya.verma@college.edu',
              phone: '9876543212',
              branch: 'Electrical Engineering',
              college: 'National Institute of Technology',
              isLeader: false,
            },
          ],
        },
        registration: {
          create: {
            regCode: 'OLY-2026-8801',
            status: RegStatus.CONFIRMED,
            paymentStatus: PaymentStatus.COMPLETED,
            amount: 300,
          },
        },
      },
    });
    console.log(`Seeded demo team: ${team.name} (${team.teamCode}) with pass OLY-2026-8801`);
  }

  console.log('--- Database Seed Completed Successfully ---');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
