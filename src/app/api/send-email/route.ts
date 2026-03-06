import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, orderId, total } = await req.json();

    const { data, error } = await resend.emails.send({
      from: 'AHMAR LUXE <onboarding@resend.dev>',
      to: [email],
      subject: `Order Confirmation: ${orderId}`,
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; color: #1a1a1a; border: 1px solid #f0f0f0;">
          <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="font-size: 28px; font-weight: 300; letter-spacing: 4px; margin: 0; text-transform: uppercase;">AHMAR LUXE</h1>
            <p style="font-size: 12px; color: #888; margin-top: 10px; letter-spacing: 1px;">Official Order Confirmation</p>
          </div>
          
          <div style="margin-bottom: 30px;">
            <h2 style="font-size: 18px; font-weight: 500; margin-bottom: 15px;">Thank you for your purchase.</h2>
            <p style="font-size: 14px; line-height: 1.6; color: #444;">
              We are pleased to confirm that your order <strong>${orderId}</strong> has been successfully placed. Our team is now preparing your items for shipment.
            </p>
          </div>

          <div style="background-color: #fafafa; padding: 25px; border-radius: 4px; margin-bottom: 30px;">
            <p style="font-size: 13px; margin: 5px 0;"><strong>Order ID:</strong> ${orderId}</p>
            <p style="font-size: 13px; margin: 5px 0;"><strong>Payment Status:</strong> Paid</p>
            <p style="font-size: 13px; margin: 5px 0;"><strong>Total Amount:</strong> PKR ${total}</p>
          </div>

          <p style="font-size: 14px; line-height: 1.6; color: #444;">
            You will receive another update with a tracking number once your luxury pieces are dispatched.
          </p>

          <div style="margin-top: 50px; border-top: 1px solid #eee; padding-top: 30px; text-align: center;">
            <p style="font-size: 11px; color: #aaa; letter-spacing: 1px; text-transform: uppercase;">
              This is an automated message from AHMAR LUXE Support.
            </p>
            <p style="font-size: 11px; color: #aaa; margin-top: 10px;">
              © 2026 AHMAR LUXE Private Limited.
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}