// Email sending utility for client-side usage

interface SendEmailOptions {
    to: string;
    type: 'booking_confirmation' | 'inquiry_received';
    data: {
        guestName?: string;
        villaName?: string;
        checkIn?: string;
        checkOut?: string;
        guests?: number;
        totalPrice?: string;
        message?: string;
    };
}

export async function sendEmail(options: SendEmailOptions): Promise<{ success: boolean; error?: string }> {
    try {
        const response = await fetch('/api/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(options),
        });

        const result = await response.json();

        if (!response.ok) {
            console.error('Email send failed:', result);
            return { success: false, error: result.error || 'Failed to send email' };
        }

        return { success: true };
    } catch (error: any) {
        console.error('Email send error:', error);
        return { success: false, error: error.message || 'Network error' };
    }
}

// Helper to send booking confirmation
export async function sendBookingConfirmation(
    email: string,
    guestName: string,
    villaName: string,
    checkIn: string,
    checkOut: string,
    guests?: number,
    totalPrice?: string
) {
    return sendEmail({
        to: email,
        type: 'booking_confirmation',
        data: { guestName, villaName, checkIn, checkOut, guests, totalPrice }
    });
}

// Helper to send inquiry received notification
export async function sendInquiryReceived(
    email: string,
    guestName: string,
    villaName?: string
) {
    return sendEmail({
        to: email,
        type: 'inquiry_received',
        data: { guestName, villaName }
    });
}
