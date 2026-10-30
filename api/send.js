const nodemailer = require('nodemailer');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const { message, subject, name, to } = req.body || {};
  if (!message || !String(message).trim()) {
    return res.status(400).json({ ok: false, error: 'Message is required' });
  }

  const user = process.env.GMAIL_USER || 'jnvdhrub@gmail.com';
  const pass = process.env.GMAIL_APP_PASSWORD;
  const recipient = process.env.GMAIL_TO || to || 'jnvdhrub@gmail.com';

  if (!pass) {
    return res.status(501).json({
      ok: false,
      error: 'GMAIL_APP_PASSWORD environment variable is not set in Vercel'
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass }
    });

    await transporter.sendMail({
      from: `"Birthday Page (${name || 'Reply'})" <${user}>`,
      to: recipient,
      subject: subject || `A birthday reply from ${name || 'ghosty'}`,
      text: String(message).trim()
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
};
    
