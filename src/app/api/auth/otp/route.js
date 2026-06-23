import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { saveOtp } from '@/lib/db';

export async function POST(request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Generate 6-digit verification code
    const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
    saveOtp(email, generatedCode);

    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_PASS;

    // Check if Gmail SMTP credentials are configured
    if (gmailUser && gmailPass) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: gmailUser,
            pass: gmailPass,
          },
        });

        const htmlContent = `
          <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; background-color: #0a0a0f; color: #f0f0f5; padding: 40px 20px; text-align: center; border-radius: 16px; max-width: 500px; margin: 0 auto; border: 1px solid rgba(255, 255, 255, 0.08); box-shadow: 0 16px 50px rgba(0, 0, 0, 0.4);">
            <div style="margin-bottom: 24px;">
              <span style="font-size: 28px; font-weight: 800; background: linear-gradient(135deg, #7c5cfc 0%, #5ea1ff 50%, #39d0d8 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; color: #7c5cfc;">Axiom News</span>
            </div>
            <hr style="border: 0; height: 1px; background: rgba(255, 255, 255, 0.08); margin: 24px 0;" />
            <h2 style="font-family: Georgia, serif; font-size: 22px; margin-bottom: 12px; color: #ffffff;">Verify Your Account</h2>
            <p style="font-size: 14px; color: #9d9db5; line-height: 1.6; margin-bottom: 30px;">Use the following one-time password (OTP) to log in to Axiom News. This code is valid for 10 minutes.</p>
            <div style="background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 16px 24px; display: inline-block; margin-bottom: 30px;">
              <span style="font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #5ea1ff; font-family: monospace;">${generatedCode}</span>
            </div>
            <p style="font-size: 12px; color: #6b6b83; line-height: 1.5;">If you did not request this login code, please ignore this message or contact support.</p>
            <hr style="border: 0; height: 1px; background: rgba(255, 255, 255, 0.08); margin: 30px 0;" />
            <p style="font-size: 11px; color: #6b6b83;">© ${new Date().getFullYear()} Axiom News. Portfolio Aggregator.</p>
          </div>
        `;

        await transporter.sendMail({
          from: `"Axiom News" <${gmailUser}>`,
          to: email,
          subject: '🔐 Axiom News - Login Verification Code',
          text: `Axiom News: Your login verification code is ${generatedCode}`,
          html: htmlContent,
        });

        return NextResponse.json({ success: true, sent: true });
      } catch (err) {
        console.error('SMTP send failed, falling back to simulated toast:', err);
        // Fallback to simulated toast in case Gmail credentials fail runtime checks
        return NextResponse.json({ success: true, sent: false, code: generatedCode });
      }
    }

    // Graceful fallback for local development without environment credentials
    return NextResponse.json({ success: true, sent: false, code: generatedCode });
  } catch (error) {
    console.error('OTP request error:', error);
    return NextResponse.json({ error: 'Server error generating OTP' }, { status: 500 });
  }
}
