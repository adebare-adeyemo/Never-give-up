import nodemailer from 'nodemailer';

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export async function POST(req) {
  try {
    const body = await req.json();

    const requiredFields = ['name', 'phone', 'email'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return Response.json({ success: false, message: `Please provide your ${field}.` }, { status: 400 });
      }
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 465),
      secure: String(process.env.SMTP_PORT || '465') === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const recipient = process.env.SMTP_TO || 'booking@nvgcleaningservices.co.uk';
    const from = process.env.SMTP_FROM || process.env.SMTP_USER;

    await transporter.sendMail({
      from: `NVG Website <${from}>`,
      to: recipient,
      replyTo: body.email,
      subject: `New NVG Booking Request - ${escapeHtml(body.service || 'Cleaning Service')}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
          <h2>New Booking Request</h2>
          <p><strong>Name:</strong> ${escapeHtml(body.name)}</p>
          <p><strong>Phone:</strong> ${escapeHtml(body.phone)}</p>
          <p><strong>Email:</strong> ${escapeHtml(body.email)}</p>
          <p><strong>Address:</strong> ${escapeHtml(body.address)}</p>
          <p><strong>Service:</strong> ${escapeHtml(body.service)}</p>
          <p><strong>Preferred date:</strong> ${escapeHtml(body.date)}</p>
          <p><strong>Preferred time:</strong> ${escapeHtml(body.time)}</p>
          <p><strong>Property size:</strong> ${escapeHtml(body.propertySize)}</p>
          <p><strong>Additional notes:</strong><br/>${escapeHtml(body.notes).replaceAll('\n', '<br/>')}</p>
        </div>
      `,
      text: `
New Booking Request

Name: ${body.name}
Phone: ${body.phone}
Email: ${body.email}
Address: ${body.address || ''}
Service: ${body.service || ''}
Preferred date: ${body.date || ''}
Preferred time: ${body.time || ''}
Property size: ${body.propertySize || ''}
Additional notes: ${body.notes || ''}
      `,
    });

    return Response.json({ success: true, message: 'Booking request sent.' });
  } catch (error) {
    console.error('Booking form email error:', error);
    return Response.json(
      { success: false, message: 'Your request could not be sent. Please call or WhatsApp NVG Cleaning Services.' },
      { status: 500 }
    );
  }
}
