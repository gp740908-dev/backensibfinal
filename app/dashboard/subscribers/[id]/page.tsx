'use client';

// Redirect to list - Editing subscribers usually just means re-subscribing or deleting
import { redirect } from 'next/navigation';

export default function EditSubscriberPage() {
    redirect('/dashboard/subscribers');
}
