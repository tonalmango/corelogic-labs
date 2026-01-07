# Email Setup Guide - Outlook SMTP

## Current Configuration
**Email Address**: team.corelogiclabs@outlook.com  
**SMTP Server**: smtp-mail.outlook.com  
**Port**: 587 (TLS)

## Setup Steps

### 1. Create App Password (Required for SMTP)
Since Outlook uses 2FA, you need an app-specific password:

1. Go to https://account.microsoft.com/security
2. Sign in with team.corelogiclabs@outlook.com
3. Navigate to **Security** → **Advanced security options**
4. Under **App passwords**, click **Create a new app password**
5. Copy the generated password (looks like: `abcd-efgh-ijkl-mnop`)

### 2. Update Environment Variables
In your Render dashboard:

1. Go to your backend service
2. Navigate to **Environment** tab
3. Update these variables:
   ```
   EMAIL_USER=team.corelogiclabs@outlook.com
   EMAIL_PASSWORD=<paste-app-password-here>
   ```
4. Save changes and redeploy

### 3. Local Development
Update your local `.env` file:
```env
EMAIL_USER=team.corelogiclabs@outlook.com
EMAIL_PASSWORD=your-app-password-here
```

## Email Features

The system sends emails in these scenarios:

### Quote Submissions
- **Customer**: Confirmation email with quote details
- **Admin (you)**: Notification with full quote information

### Contact Form
- **Customer**: Thank you message
- **Admin (you)**: New contact notification

### Quote Updates
- **Customer**: When status changes to "quoted" with pricing

## Testing

Test the email integration:
```bash
node -e "require('./backend/utils/mailer').sendMail({to:'your-personal-email@example.com',subject:'Test',html:'<b>Email works!</b>'}).then(()=>console.log('✅ Sent')).catch(e=>console.error('❌',e.message))"
```

## Troubleshooting

**Error: Invalid login**
- Check app password is correct (no spaces)
- Verify 2FA is enabled on Outlook account
- Regenerate app password if needed

**Emails not sending**
- Check Render environment variables are set
- Check server logs for errors
- Verify EMAIL_USER is not the default "yourbusiness@gmail.com"

**Emails in spam**
- Add email signature in Outlook settings
- Use professional language in email templates
- Consider adding SPF/DKIM records (requires custom domain)

## Files Modified
- `backend/utils/mailer.js` - Centralized email configuration
- `backend/controllers/quoteController.js` - Quote email notifications
- `backend/controllers/contactController.js` - Contact form emails
- `backend/.env` - Environment configuration

## Next Steps (Optional)
- Buy a custom domain (e.g., corelogiclabs.com)
- Set up custom email (info@corelogiclabs.com)
- Add email to Microsoft 365 with custom domain
- Configure SPF/DKIM for better deliverability
