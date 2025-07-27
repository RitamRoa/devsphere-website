# Santhe Sticker Creator

## Overview

The Santhe page is a custom sticker creation feature that allows users to:

- Upload an image
- Add a caption
- Apply various filters
- Receive the generated sticker via email

## Features

### Image Upload

- Supports common image formats (JPEG, PNG, GIF, etc.)
- Real-time preview of uploaded image

### Filters Available

1. **None** - Original image
2. **Sepia** - Vintage brown tone
3. **Grayscale** - Black and white
4. **Blur** - Soft blur effect
5. **Bright** - Increased brightness
6. **High Contrast** - Enhanced contrast
7. **Vintage** - Combined sepia, contrast, and brightness
8. **Cool Blue** - Blue tint with enhanced saturation

### Form Validation

- Email validation
- Caption length limits (1-100 characters)
- Required image upload
- Filter selection validation

### Email Delivery

- HTML email with sticker details
- High-quality PNG attachment
- Professional email template

## Setup Instructions

### 1. Install Dependencies

```bash
npm install @types/file-saver file-saver html2canvas multer @types/multer nodemailer @types/nodemailer sharp
```

### 2. Environment Configuration

Create a `.env.local` file in the project root:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### 3. Gmail Setup (Recommended)

1. Enable 2-factor authentication on your Gmail account
2. Generate an "App Password":
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
3. Use the generated password in `EMAIL_PASSWORD`

### 4. Alternative Email Services

You can modify the transporter configuration in `/app/api/santhe/send-sticker/route.ts`:

#### Outlook/Hotmail

```javascript
const transporter = nodemailer.createTransport({
  service: "hotmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});
```

#### Custom SMTP

```javascript
const transporter = nodemailer.createTransport({
  host: "your-smtp-server.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});
```

## File Structure

```
app/
├── santhe/
│   └── page.tsx                 # Main Santhe page component
└── api/
    └── santhe/
        └── send-sticker/
            └── route.ts         # Email sending API endpoint

components/
└── layout/
    └── navbar.tsx              # Updated with Santhe link
```

## Technical Details

### Sticker Generation

- Uses `html2canvas` to capture the preview as an image
- Generates high-quality PNG (scale: 2)
- Fixed dimensions: 400x400px
- White background with purple border

### Security Considerations

- Server-side validation of all inputs
- Email sanitization
- File size limits (handled by browser)
- Environment variables for sensitive data

### Error Handling

- Form validation with user-friendly messages
- API error responses
- Loading states during submission
- Success/failure feedback

## Usage

1. Navigate to `/santhe`
2. Upload an image
3. Enter a caption (1-100 characters)
4. Select a filter
5. Enter email address
6. Click "Send Sticker to Email"
7. Check email for the generated sticker

## Customization

### Adding New Filters

Edit the `filters` array in `/app/santhe/page.tsx`:

```javascript
const filters = [
  // ... existing filters
  {
    value: "new-filter",
    label: "New Filter",
    style: { filter: "your-css-filter-here" },
  },
];
```

### Styling the Sticker

Modify the sticker container in the `stickerRef` div to change:

- Background colors
- Border styles
- Layout
- Typography

### Email Template

Customize the email HTML in `/app/api/santhe/send-sticker/route.ts` in the `mailOptions.html` field.

## Troubleshooting

### Common Issues

1. **Email not sending**

   - Check environment variables
   - Verify Gmail app password
   - Check console for errors

2. **Image not uploading**

   - Ensure file is a valid image format
   - Check file size (browser limitations)

3. **Preview not showing**

   - Verify image upload completed
   - Check browser console for errors

4. **Sticker generation fails**
   - Ensure `html2canvas` is properly imported
   - Check for DOM rendering issues

### Development Mode

For development, you can temporarily log the email content instead of sending:

```javascript
// In route.ts, replace the sendMail call with:
console.log("Email would be sent:", mailOptions);
return NextResponse.json({
  success: true,
  message: "Development mode - check console",
});
```

## Future Enhancements

- More filter options
- Custom text styling
- Multiple image uploads
- Social media sharing
- User accounts and history
- Bulk sticker generation
