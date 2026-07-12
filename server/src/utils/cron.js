const cron = require('node-cron');
const nodemailer = require('nodemailer');
const Driver = require('../models/Driver');

// Configure your email service (Using Mailtrap or Gmail app passwords works well for hackathons)
const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const startCronJobs = () => {
  // Runs every day at 00:00 (Midnight)
  cron.schedule('0 0 * * *', async () => {
    console.log('Running daily license expiration check...');
    
    try {
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

      // Find drivers whose license expires between today and 30 days from now
      const expiringDrivers = await Driver.find({
        licenseExpiryDate: { $lte: thirtyDaysFromNow, $gt: new Date() }
      });

      if (expiringDrivers.length > 0) {
        const driverNames = expiringDrivers.map(d => `${d.name} (${d.licenseNumber})`).join('\n');
        
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: 'safetyofficer@transitops.com', // In reality, fetch this from your User DB
          subject: ' ACTION REQUIRED: Expiring Driver Licenses',
          text: `The following drivers have licenses expiring in the next 30 days:\n\n${driverNames}`
        });
        
        console.log(`Alert sent for ${expiringDrivers.length} expiring licenses.`);
      }
    } catch (error) {
      console.error('Cron Job Error:', error);
    }
  });
};

module.exports = startCronJobs;