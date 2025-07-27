import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { email, caption, filter, borderStyle, stickerSize, fontFamily, fontSize, textColor, stickerImage } = await request.json();

    // Validate required fields
    if (!email || !caption || !stickerImage) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Gmail Configuration
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Convert base64 image to buffer
    const base64Data = stickerImage.replace(/^data:image\/png;base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Custom Santhe Sticker is Ready! 🎨',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #8B5CF6;">Your Custom Santhe Sticker</h2>
          <p>Hi there! 👋</p>
          <p>Your custom sticker with the caption "<strong>${caption}</strong>" and "${filter}" filter is ready!</p>
          <p>You can find your sticker attached to this email. Feel free to use it anywhere you'd like!</p>
          
          <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Sticker Details:</h3>
            <ul>
              <li><strong>Caption:</strong> ${caption}</li>
              <li><strong>Filter Applied:</strong> ${filter || 'None'}</li>
              <li><strong>Border Color:</strong> ${borderStyle || 'Purple'}</li>
              <li><strong>Font:</strong> ${fontFamily || 'Arial'}</li>
              <li><strong>Text Size:</strong> ${fontSize || 'Medium'}</li>
              <li><strong>Text Color:</strong> ${textColor || 'Black'}</li>
              <li><strong>Sticker Size:</strong> ${stickerSize || 'Medium'}</li>
              <li><strong>Format:</strong> PNG (High Quality)</li>
            </ul>
          </div>
          
          <p>Thanks for using Santhe Sticker Creator!</p>
          <p style="color: #6B7280; font-size: 14px;">
            Best regards,<br>
            The DevSphere Team<br>
            RV University
          </p>
        </div>
      `,
      attachments: [
        {
          filename: `santhe-sticker-${Date.now()}.png`,
          content: imageBuffer,
          contentType: 'image/png',
        },
      ],
    };

    // Send email with detailed logging
    console.log('Attempting to send email from:', process.env.EMAIL_USER);
    console.log('To:', email);
    
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');

    return NextResponse.json({ 
      success: true, 
      message: 'Sticker sent successfully!' 
    });

  } catch (error) {
    console.error('Error sending email:', error);
    
    // Return more detailed error information for debugging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { 
        error: 'Failed to send sticker', 
        details: errorMessage,
        suggestion: 'The email credentials may need to be configured differently for RVU\'s email system'
      },
      { status: 500 }
    );
  }
}
