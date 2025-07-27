// Test script to check RVU email configuration
// Run this separately to test email settings

const nodemailer = require('nodemailer');

async function testEmailConfig() {
  const configs = [
    {
      name: 'Office 365 (Most Common)',
      config: {
        host: 'smtp.office365.com',
        port: 587,
        secure: false,
        auth: {
          user: 'club_devsphere@rvu.edu.in',
          pass: '&782_#90',
        },
        tls: { rejectUnauthorized: false }
      }
    },
    {
      name: 'Gmail (if RVU uses Google Workspace)',
      config: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: 'club_devsphere@rvu.edu.in',
          pass: '&782_#90',
        },
        tls: { rejectUnauthorized: false }
      }
    },
    {
      name: 'RVU Direct SMTP',
      config: {
        host: 'mail.rvu.edu.in',
        port: 587,
        secure: false,
        auth: {
          user: 'club_devsphere@rvu.edu.in',
          pass: '&782_#90',
        },
        tls: { rejectUnauthorized: false }
      }
    }
  ];

  for (const { name, config } of configs) {
    try {
      console.log(`\nTesting ${name}...`);
      const transporter = nodemailer.createTransporter(config);
      await transporter.verify();
      console.log(`✅ ${name} - Connection successful!`);
      
      // Try sending a test email
      const testEmail = {
        from: config.auth.user,
        to: config.auth.user, // Send to self for testing
        subject: 'Test Email from Santhe',
        text: 'This is a test email to verify the configuration.'
      };
      
      await transporter.sendMail(testEmail);
      console.log(`✅ ${name} - Test email sent successfully!`);
      break;
      
    } catch (error) {
      console.log(`❌ ${name} - Failed:`, error.message);
    }
  }
}

testEmailConfig();
