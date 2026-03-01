/**
 * Utility to trigger on-demand ISR revalidation on the frontend site
 * after admin panel updates data.
 *
 * This calls the frontend's /api/revalidate endpoint to purge cached pages,
 * so changes appear immediately without waiting for the revalidate timer.
 */

const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://sibfinal.vercel.app';
const REVALIDATE_TOKEN = process.env.REVALIDATE_SECRET || 'stayinubud-revalidate-2024';

export async function revalidateFrontend(paths: string[]): Promise<boolean> {
    try {
        const res = await fetch(`${FRONTEND_URL}/api/revalidate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-revalidate-token': REVALIDATE_TOKEN,
            },
            body: JSON.stringify({ paths }),
        });

        if (!res.ok) {
            console.warn('[Revalidate] Failed:', res.status, await res.text());
            return false;
        }

        console.log('[Revalidate] Success:', paths);
        return true;
    } catch (err) {
        // Silently fail — revalidation is best-effort, never blocks admin UX
        console.warn('[Revalidate] Network error (non-blocking):', err);
        return false;
    }
}

// ─── Convenience Helpers ────────────────────────────────────────────────

/** Call after creating/updating/deleting a villa */
export function revalidateVilla(villaId?: string) {
    const paths = ['/', '/villas'];
    if (villaId) paths.push(`/villas/${villaId}`);
    return revalidateFrontend(paths);
}

/** Call after creating/updating/deleting an experience */
export function revalidateExperience() {
    return revalidateFrontend(['/', '/experiences']);
}

/** Call after creating/updating/deleting a journal post */
export function revalidateJournal(slug?: string) {
    const paths = ['/journal'];
    if (slug) paths.push(`/journal/${slug}`);
    return revalidateFrontend(paths);
}

/** Call after creating/updating/deleting a review */
export function revalidateReview() {
    return revalidateFrontend(['/']);
}

/** Call after booking status changes */
export function revalidateBooking(villaId?: string) {
    const paths = ['/availability'];
    if (villaId) paths.push(`/villas/${villaId}`);
    return revalidateFrontend(paths);
}
