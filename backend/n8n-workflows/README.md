# n8n Workflow Integration for Villas Boats

This directory contains n8n workflow configurations for automating booking inquiry notifications and customer communications.

## 📋 Available Workflows

### 1. Booking Inquiry - New (`booking-inquiry-new.json`)
Triggers when a new booking inquiry is submitted through the public booking form.

**Actions:**
- Sends confirmation email to customer with inquiry details
- Sends notification email to admin team
- Sends WhatsApp notification to admin (requires WhatsApp Business API)

**Webhook URL:** `http://your-n8n-instance:5678/webhook/booking-inquiry-new`

### 2. Booking Inquiry - Follow-up (`booking-inquiry-followup.json`)
Triggers to follow up with customers who haven't completed their booking.

**Actions:**
- Sends reminder email to customer
- Optionally sends WhatsApp follow-up message
- Can be triggered manually or scheduled

**Webhook URL:** `http://your-n8n-instance:5678/webhook/booking-inquiry-followup`

### 3. Booking Status Update (`booking-status-update.json`)
Triggers when a booking status changes (confirmed, cancelled, completed).

**Actions:**
- Sends appropriate status update email to customer
- Notifies admin team of status change
- Handles different statuses with customized messaging

**Webhook URL:** `http://your-n8n-instance:5678/webhook/booking-status-update`

## 🚀 Setup Instructions

### Prerequisites
- n8n instance running (self-hosted or cloud)
- SMTP email account configured in n8n
- WhatsApp Business API account (optional, for WhatsApp notifications)

### Step 1: Import Workflows

1. Open your n8n instance
2. Click on **Workflows** in the sidebar
3. Click **Import from File**
4. Import each JSON file:
   - `booking-inquiry-new.json`
   - `booking-inquiry-followup.json`
   - `booking-status-update.json`

### Step 2: Configure Email Credentials

1. Go to **Credentials** in n8n
2. Add a new **SMTP** credential:
   - **Host:** Your SMTP server (e.g., `smtp.gmail.com`)
   - **Port:** Usually 587 for TLS or 465 for SSL
   - **User:** Your email address (e.g., `noreply@villasboats.com`)
   - **Password:** Your email password or app-specific password
   - **Secure Connection:** Enable TLS/SSL

3. Update each workflow to use your SMTP credentials:
   - Open each workflow
   - Click on each **Email** node
   - Select your configured SMTP credential

### Step 3: Customize Email Templates

Each email node contains HTML templates. Customize them with your:
- Company branding and colors
- Logo images
- Contact information
- Website URLs
- Legal disclaimers

### Step 4: Configure WhatsApp (Optional)

If you want WhatsApp notifications:

1. Set up WhatsApp Business API account
2. Update the **WhatsApp to Admin** nodes in workflows
3. Replace the HTTP Request URLs with your WhatsApp API endpoint
4. Configure authentication headers for your WhatsApp API

**Alternative:** Use services like Twilio, MessageBird, or Meta's WhatsApp Business Platform.

### Step 5: Update Backend Configuration

Update your `backend/src/main/resources/application.yml`:

```yaml
n8n:
  webhook:
    base-url: http://your-n8n-instance:5678/webhook
    enabled: true
    timeout-ms: 5000
```

Or set environment variables:
```bash
export N8N_WEBHOOK_BASE_URL="http://your-n8n-instance:5678/webhook"
export N8N_WEBHOOK_ENABLED=true
export N8N_WEBHOOK_TIMEOUT=5000
```

### Step 6: Activate Workflows

1. Open each imported workflow in n8n
2. Click the **Activate** toggle in the top right
3. Verify webhook URLs are correct
4. Test each workflow (see Testing section below)

## 🧪 Testing Workflows

### Test Booking Inquiry - New

Using curl:
```bash
curl -X POST http://localhost:5678/webhook/booking-inquiry-new \
  -H "Content-Type: application/json" \
  -d '{
    "booking_reference": "BK123456789",
    "customer_name": "John Doe",
    "customer_email": "john@example.com",
    "customer_phone": "+351912345678",
    "boat_name": "Luxury Yacht 45ft",
    "start_datetime": "2025-02-15 10:00",
    "end_datetime": "2025-02-17 18:00",
    "guest_count": 6,
    "needs_captain": true,
    "total_price": "1200.00",
    "currency": "EUR",
    "customer_notes": "Special request for champagne on board",
    "whatsapp_number": "+351915500020"
  }'
```

### Test Booking Status Update

```bash
curl -X POST http://localhost:5678/webhook/booking-status-update \
  -H "Content-Type: application/json" \
  -d '{
    "booking_reference": "BK123456789",
    "customer_name": "John Doe",
    "customer_email": "john@example.com",
    "boat_name": "Luxury Yacht 45ft",
    "start_datetime": "2025-02-15 10:00",
    "end_datetime": "2025-02-17 18:00",
    "guest_count": 6,
    "needs_captain": true,
    "total_price": "1200.00",
    "currency": "EUR",
    "status": "CONFIRMED",
    "whatsapp_number": "+351915500020"
  }'
```

## 📊 Webhook Payload Structure

### Booking Inquiry Payload
```json
{
  "booking_reference": "BK123456789",
  "customer_name": "John Doe",
  "customer_email": "john@example.com",
  "customer_phone": "+351912345678",
  "boat_name": "Luxury Yacht 45ft",
  "start_datetime": "2025-02-15 10:00",
  "end_datetime": "2025-02-17 18:00",
  "guest_count": 6,
  "needs_captain": true,
  "total_price": "1200.00",
  "currency": "EUR",
  "customer_notes": "Optional customer notes",
  "whatsapp_number": "+351915500020"
}
```

### Status Update Payload
```json
{
  "booking_reference": "BK123456789",
  "customer_name": "John Doe",
  "customer_email": "john@example.com",
  "boat_name": "Luxury Yacht 45ft",
  "start_datetime": "2025-02-15 10:00",
  "end_datetime": "2025-02-17 18:00",
  "guest_count": 6,
  "needs_captain": true,
  "total_price": "1200.00",
  "currency": "EUR",
  "status": "CONFIRMED|CANCELLED|COMPLETED",
  "cancellation_reason": "Optional reason if cancelled",
  "whatsapp_number": "+351915500020"
}
```

## 🔧 Troubleshooting

### Emails not sending
- Verify SMTP credentials are correct
- Check SMTP server allows connections from your n8n instance
- Review email node execution logs in n8n
- Test SMTP connection with a simple email client

### Webhooks not triggering
- Verify workflows are activated in n8n
- Check backend webhook base URL configuration
- Review backend logs for webhook emission errors
- Ensure n8n instance is accessible from backend

### WhatsApp not working
- Verify WhatsApp Business API is properly configured
- Check API credentials and permissions
- Review WhatsApp Business API documentation
- Consider using alternative messaging services (Twilio, etc.)

## 🎨 Customization Tips

### Email Design
- Use inline CSS for better email client compatibility
- Test emails in multiple email clients (Gmail, Outlook, Apple Mail)
- Keep images hosted on reliable CDN
- Include plain text fallback for better deliverability

### Workflow Enhancements
- Add SMS notifications using Twilio or similar
- Integrate with CRM systems (Salesforce, HubSpot)
- Add Slack/Discord notifications for team
- Implement automated follow-up schedules
- Add booking reminder workflows (24h, 48h before trip)

### Monitoring
- Enable workflow execution history in n8n
- Set up error notifications
- Monitor webhook success/failure rates
- Track email open and click rates

## 📞 Support

For issues with:
- **n8n workflows:** Check n8n documentation at https://docs.n8n.io
- **Backend integration:** Review backend WebhookService logs
- **Email delivery:** Check SMTP server logs and email headers

## 🔐 Security Notes

- **Never commit credentials** to version control
- Use environment variables for sensitive configuration
- Enable HTTPS for production webhook URLs
- Implement webhook signature verification (optional but recommended)
- Restrict n8n access to authorized team members only

## 📝 License

These workflows are part of the Villas Boats project and subject to the same license terms.
