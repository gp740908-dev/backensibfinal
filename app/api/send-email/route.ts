import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import {
    generateBookingConfirmationEmail,
    generateInquiryReceivedEmail,
    EMAIL_SUBJECTS
} from '../../../lib/email-templates';

const resend = new Resend(process.env.RESEND_API_KEY);

// From email - use your verified domain in Resend
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'StayinUBUD <noreply@stayinubud.com>';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { type, to, data } = body;

        if (!to || !type) {
            return NextResponse.json(
                { error: 'Missing required fields: to, type' },
                { status: 400 }
            );
        }

        let html: string;
        let subject: string;

        switch (type) {
            case 'booking_confirmation':
                html = generateBookingConfirmationEmail({
                    guestName: data.guestName || 'Guest',
                    villaName: data.villaName || 'StayinUBUD Villa',
                    checkIn: data.checkIn || 'TBD',
                    checkOut: data.checkOut || 'TBD',
                    guests: data.guests,
                    totalPrice: data.totalPrice,
                    bookingId: data.bookingId
                });
                subject = EMAIL_SUBJECTS.bookingConfirmation;
                break;

            case 'inquiry_received':
                html = generateInquiryReceivedEmail({
                    guestName: data.guestName || 'Guest',
                    message: data.message,
                    villaName: data.villaName
                });
                subject = EMAIL_SUBJECTS.inquiryReceived;
                break;

            default:
                return NextResponse.json(
                    { error: 'Invalid email type' },
                    { status: 400 }
                );
        }

        const { data: emailData, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: [to],
            subject: subject,
            html: html
        });

        if (error) {
            console.error('Resend error:', error);
            return NextResponse.json(
                { error: 'Failed to send email', details: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            messageId: emailData?.id
        });

    } catch (error: any) {
        console.error('Email API error:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}
