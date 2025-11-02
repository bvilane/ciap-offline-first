import { getDB } from './db.js';

(async () => {
  const db = await getDB();

  await db.run(`DELETE FROM notices`);
  await db.run(`DELETE FROM jobs`);
  await db.run(`DELETE FROM skills`);
  await db.run(`DELETE FROM directory`);

  // Notices
  await db.run(`INSERT INTO notices (community, title, body, createdAt)
                VALUES ('Acornhoek','Water Maintenance – Ward 8','Low pressure expected 10:00–13:00. Use water sparingly.',?)`, Date.now()-3600e3);
  await db.run(`INSERT INTO notices (community, title, body, createdAt)
                VALUES ('Acornhoek','Clinic Outreach','Free screenings at Community Hall, Sat 09:00–12:00.',?)`, Date.now()-7200e3);

  // Jobs
  await db.run(`INSERT INTO jobs (community, title, summary, company, location, type, applyUrl, postedAt)
                VALUES ('Acornhoek','Receptionist – Local Clinic','Front desk, patient queries, scheduling.','Acornhoek Clinic','Acornhoek','Full-time','',?)`, Date.now());
  await db.run(`INSERT INTO jobs (community, title, summary, company, location, type, applyUrl, postedAt)
                VALUES ('Acornhoek','Remote Customer Support (Entry)','Chat/email support. Training provided.','Remote Inc.','Remote','Remote','https://example.com/apply',?)`, Date.now());

  // Skills
  await db.run(`INSERT INTO skills (community, title, provider, summary, url, startsAt)
                VALUES ('Acornhoek','Basics of Digital Marketing','Community Hub','Free weekend workshop. Limited seats.','',?)`, Date.now()+7*24*3600e3);
  await db.run(`INSERT INTO skills (community, title, provider, summary, url, startsAt)
                VALUES ('Acornhoek','Intro to Freelancing','Remote Academy','Self-paced video course for beginners.','https://example.com/course',NULL)`);

  // Directory
  await db.run(`INSERT INTO directory (community, name, category, phone, hours, address)
                VALUES ('Acornhoek','Acornhoek Clinic','Clinic','+27 11 000 0001','Mon–Fri 08:00–16:00','Main Rd, Acornhoek')`);
  await db.run(`INSERT INTO directory (community, name, category, phone, hours, address)
                VALUES ('Acornhoek','Ward 8 Primary School','School','+27 11 000 0002','Mon–Fri 07:30–14:00','School St, Acornhoek')`);
  await db.run(`INSERT INTO directory (community, name, category, phone, hours, address)
                VALUES ('Acornhoek','Municipal Office','Municipal','+27 11 000 0003','Mon–Fri 08:00–16:00','Civic Center')`);

  console.log('Seeded.');
  process.exit(0);
})();
