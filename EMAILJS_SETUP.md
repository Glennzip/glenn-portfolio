# 📧 EmailJS Setup Guide
## Making the Contact Form Send Real Emails to You

---

## What You Need
- A free EmailJS account (200 emails/month free)
- Your Gmail or any email you want to receive messages on
- About 5–10 minutes

---

## Step 1 — Create an EmailJS Account

1. Go to **https://www.emailjs.com/**
2. Click **Sign Up** → create a free account
3. Verify your email

---

## Step 2 — Add an Email Service (connect your Gmail)

1. In the EmailJS dashboard, go to **Email Services** (left sidebar)
2. Click **Add New Service**
3. Choose **Gmail** (or your preferred email provider)
4. Click **Connect Account** → sign in to your Gmail
5. Give it a name like `portfolio_service`
6. Click **Create Service**
7. ✅ Copy the **Service ID** — looks like: `service_xxxxxxx`

---

## Step 3 — Create an Email Template

1. Go to **Email Templates** (left sidebar)
2. Click **Create New Template**
3. Fill in the template fields:

**Subject:**
```
New Portfolio Message: {{subject}}
```

**Body (HTML or Text):**
```
You have a new message from your portfolio!

Name:    {{from_name}}
Email:   {{from_email}}
Subject: {{subject}}

Message:
{{message}}

---
Reply directly to this email to respond to {{from_name}}.
```

**To Email:** `your real email address` (where you want to receive messages)

**Reply To:** `{{reply_to}}`

4. Click **Save**
5. ✅ Copy the **Template ID** — looks like: `template_xxxxxxx`

---

## Step 4 — Get Your Public Key

1. In EmailJS, go to **Account** → **API Keys** (top right menu)
2. ✅ Copy your **Public Key** — looks like: `aBcDeFgHiJkLmNoP`

---

## Step 5 — Plug the 3 IDs into Your Portfolio

Open the file:
```
Portfolio/js/main.js
```

Find this section near the top (around line 106):
```javascript
const EMAILJS_CONFIG = {
  publicKey:   'YOUR_PUBLIC_KEY',    // ← replace this
  serviceId:   'YOUR_SERVICE_ID',    // ← replace this
  templateId:  'YOUR_TEMPLATE_ID',   // ← replace this
};
```

Replace each placeholder with your real IDs:
```javascript
const EMAILJS_CONFIG = {
  publicKey:   'aBcDeFgHiJkLmNoP',       // your real public key
  serviceId:   'service_xxxxxxx',          // your real service ID
  templateId:  'template_xxxxxxx',         // your real template ID
};
```

Save the file.

---

## Step 6 — Test It

1. Open `index.html` in your browser
2. Go to the **Contact** section
3. Fill in the form and click **Send Message**
4. You should see ✅ "Message sent!" on screen
5. Check your Gmail inbox — the email should arrive within seconds

---

## Troubleshooting

| Problem | Fix |
|---|---|
| "EmailJS not configured yet" | You still have placeholder IDs — replace them in Step 5 |
| "Failed to send (Invalid public key)" | Check your Public Key is copied correctly |
| "Failed to send (The service is not found)" | Check your Service ID matches exactly |
| Email lands in spam | Mark it as not spam; add EmailJS as a trusted sender |
| No email received | Check your template's "To Email" field is set to your real email |

---

## Free Plan Limits

| Limit | Amount |
|---|---|
| Emails per month | **200** (free) |
| Email size | Up to 50 KB |
| Templates | Up to 2 |

200 emails/month is more than enough for a portfolio contact form.

---

## Security Note

Your **Public Key** is safe to include in frontend JavaScript.
EmailJS is designed this way — the Public Key only lets your
code send emails through your own configured templates.
It cannot be used to access your email account.

---

✅ Once set up, every message a client sends through your contact
form will arrive in your inbox as a real email, with their name,
email address, and message — and you can reply directly to them.
