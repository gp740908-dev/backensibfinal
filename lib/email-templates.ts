// Premium Email Templates for StayinUBUD
// Design: Awwwards-winning, minimalist luxury, Aman Resorts style

const BRAND_COLORS = {
    forest: '#1C3D2A',
    gold: '#C4A35A',
    warmWhite: '#FAF8F5',
    text: '#2D2D2D',
    lightText: '#6B6B6B',
    border: '#E8E4DF'
};

const emailWrapper = (content: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>StayinUBUD</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: ${BRAND_COLORS.warmWhite}; color: ${BRAND_COLORS.text};">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: ${BRAND_COLORS.warmWhite};">
        <tr>
            <td style="padding: 40px 20px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; max-width: 600px;">
                    
                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px 48px; text-align: center;">
                            <h1 style="margin: 0; font-size: 28px; font-weight: 300; letter-spacing: 0.1em; color: ${BRAND_COLORS.forest};">
                                Stayin<span style="font-style: italic; color: ${BRAND_COLORS.gold};">UBUD</span>
                            </h1>
                            <p style="margin: 8px 0 0 0; font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; color: ${BRAND_COLORS.lightText};">
                                Bali Luxury Villas
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Main Content Card -->
                    <tr>
                        <td>
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.04);">
                                <tr>
                                    <td style="padding: 48px;">
                                        ${content}
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 40px 48px; text-align: center;">
                            <p style="margin: 0 0 16px 0; font-size: 12px; color: ${BRAND_COLORS.lightText};">
                                Need assistance? Reach us anytime.
                            </p>
                            <a href="mailto:hello@stayinubud.com" style="display: inline-block; padding: 12px 32px; font-size: 12px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; text-decoration: none; color: ${BRAND_COLORS.forest}; border: 1px solid ${BRAND_COLORS.border}; border-radius: 24px;">
                                Contact Us
                            </a>
                            <p style="margin: 32px 0 0 0; font-size: 11px; color: ${BRAND_COLORS.lightText}; line-height: 1.6;">
                                StayinUBUD • Ubud, Bali, Indonesia<br>
                                <a href="https://stayinubud.com" style="color: ${BRAND_COLORS.gold}; text-decoration: none;">stayinubud.com</a>
                            </p>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;

interface BookingEmailData {
    guestName: string;
    villaName: string;
    checkIn: string;
    checkOut: string;
    guests?: number;
    totalPrice?: string;
    bookingId?: string;
}

interface InquiryEmailData {
    guestName: string;
    message?: string;
    villaName?: string;
}

export function generateBookingConfirmationEmail(data: BookingEmailData): string {
    const content = `
        <!-- Greeting -->
        <p style="margin: 0 0 24px 0; font-size: 14px; color: ${BRAND_COLORS.lightText}; text-transform: uppercase; letter-spacing: 0.15em;">
            Booking Confirmation
        </p>
        
        <h2 style="margin: 0 0 16px 0; font-size: 28px; font-weight: 300; color: ${BRAND_COLORS.forest};">
            Dear ${data.guestName},
        </h2>
        
        <p style="margin: 0 0 32px 0; font-size: 16px; line-height: 1.7; color: ${BRAND_COLORS.text};">
            Thank you for choosing StayinUBUD. We are delighted to confirm your reservation and look forward to welcoming you to Bali.
        </p>
        
        <!-- Booking Details Card -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: ${BRAND_COLORS.warmWhite}; border-radius: 12px; margin-bottom: 32px;">
            <tr>
                <td style="padding: 32px;">
                    <p style="margin: 0 0 20px 0; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: ${BRAND_COLORS.gold}; font-weight: 600;">
                        Your Reservation
                    </p>
                    
                    <!-- Villa Name -->
                    <h3 style="margin: 0 0 24px 0; font-size: 22px; font-weight: 400; color: ${BRAND_COLORS.forest};">
                        ${data.villaName}
                    </h3>
                    
                    <!-- Details Grid -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                            <td style="padding: 12px 0; border-bottom: 1px solid ${BRAND_COLORS.border};">
                                <span style="font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: ${BRAND_COLORS.lightText};">Check-in</span>
                                <p style="margin: 4px 0 0 0; font-size: 16px; color: ${BRAND_COLORS.text};">${data.checkIn}</p>
                            </td>
                            <td style="padding: 12px 0; border-bottom: 1px solid ${BRAND_COLORS.border};">
                                <span style="font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: ${BRAND_COLORS.lightText};">Check-out</span>
                                <p style="margin: 4px 0 0 0; font-size: 16px; color: ${BRAND_COLORS.text};">${data.checkOut}</p>
                            </td>
                        </tr>
                        ${data.guests ? `
                        <tr>
                            <td style="padding: 12px 0;" colspan="2">
                                <span style="font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: ${BRAND_COLORS.lightText};">Guests</span>
                                <p style="margin: 4px 0 0 0; font-size: 16px; color: ${BRAND_COLORS.text};">${data.guests} guests</p>
                            </td>
                        </tr>
                        ` : ''}
                    </table>
                    
                    ${data.totalPrice ? `
                    <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid ${BRAND_COLORS.border};">
                        <p style="margin: 0; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: ${BRAND_COLORS.lightText};">Total</p>
                        <p style="margin: 4px 0 0 0; font-size: 24px; font-weight: 300; color: ${BRAND_COLORS.forest};">${data.totalPrice}</p>
                    </div>
                    ` : ''}
                </td>
            </tr>
        </table>
        
        <!-- Next Steps -->
        <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.7; color: ${BRAND_COLORS.text};">
            Our team will review your booking and reach out within 24 hours to finalize the details and payment arrangements.
        </p>
        
        <p style="margin: 0; font-size: 15px; line-height: 1.7; color: ${BRAND_COLORS.text};">
            With warm regards,<br>
            <span style="color: ${BRAND_COLORS.forest}; font-weight: 500;">The StayinUBUD Team</span>
        </p>
    `;

    return emailWrapper(content);
}

export function generateInquiryReceivedEmail(data: InquiryEmailData): string {
    const content = `
        <!-- Greeting -->
        <p style="margin: 0 0 24px 0; font-size: 14px; color: ${BRAND_COLORS.lightText}; text-transform: uppercase; letter-spacing: 0.15em;">
            Message Received
        </p>
        
        <h2 style="margin: 0 0 16px 0; font-size: 28px; font-weight: 300; color: ${BRAND_COLORS.forest};">
            Dear ${data.guestName},
        </h2>
        
        <p style="margin: 0 0 32px 0; font-size: 16px; line-height: 1.7; color: ${BRAND_COLORS.text};">
            Thank you for reaching out to StayinUBUD. We have received your inquiry and our team is reviewing your message.
        </p>
        
        ${data.villaName ? `
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: ${BRAND_COLORS.warmWhite}; border-radius: 12px; margin-bottom: 32px;">
            <tr>
                <td style="padding: 24px;">
                    <p style="margin: 0 0 8px 0; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: ${BRAND_COLORS.gold}; font-weight: 600;">
                        Inquiry About
                    </p>
                    <p style="margin: 0; font-size: 18px; color: ${BRAND_COLORS.forest};">
                        ${data.villaName}
                    </p>
                </td>
            </tr>
        </table>
        ` : ''}
        
        <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.7; color: ${BRAND_COLORS.text};">
            We typically respond within 24 hours. In the meantime, feel free to explore our collection of handpicked villas in Ubud.
        </p>
        
        <!-- CTA Button -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 32px 0;">
            <tr>
                <td style="background-color: ${BRAND_COLORS.forest}; border-radius: 8px;">
                    <a href="https://stayinubud.com/villas" style="display: inline-block; padding: 16px 40px; font-size: 13px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; text-decoration: none; color: #ffffff;">
                        Explore Villas
                    </a>
                </td>
            </tr>
        </table>
        
        <p style="margin: 0; font-size: 15px; line-height: 1.7; color: ${BRAND_COLORS.text};">
            With warm regards,<br>
            <span style="color: ${BRAND_COLORS.forest}; font-weight: 500;">The StayinUBUD Team</span>
        </p>
    `;

    return emailWrapper(content);
}

// Email subject lines
export const EMAIL_SUBJECTS = {
    bookingConfirmation: 'Your Reservation at StayinUBUD',
    inquiryReceived: 'We\'ve Received Your Inquiry – StayinUBUD'
};
