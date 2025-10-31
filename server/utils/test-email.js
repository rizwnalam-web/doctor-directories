import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const testEmailConfig = async () => {
    console.log('Testing email configuration...');

    // Verify environment variables
    console.log('Environment variables check:');
    console.log('EMAIL_HOST:', process.env.EMAIL_HOST ? '✓' : '✗');
    console.log('EMAIL_PORT:', process.env.EMAIL_PORT ? '✓' : '✗');
    console.log('EMAIL_USER:', process.env.EMAIL_USER ? '✓' : '✗');
    console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '✓' : '✗');

    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.EMAIL_PORT || '587'),
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            },
            tls: {
                rejectUnauthorized: true,
                minVersion: "TLSv1.2"
            }
        });

        console.log('\nTesting SMTP connection...');
        await transporter.verify();
        console.log('✓ SMTP connection successful');

        console.log('\nAttempting to send test email...');
        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: 'Test Email - Doctor Directories',
            text: 'This is a test email to verify the email configuration.',
            html: '<p>This is a test email to verify the email configuration.</p>'
        });

        console.log('✓ Test email sent successfully');
        console.log('Message ID:', info.messageId);
    } catch (error) {
        console.error('❌ Error testing email configuration:', error);
        process.exit(1);
    }
};

testEmailConfig().catch(console.error);