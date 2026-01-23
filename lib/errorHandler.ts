export class AppError extends Error {
    constructor(message: string, public code?: string, public details?: any) {
        super(message);
        this.name = 'AppError';
    }
}

export function handleSupabaseError(error: any, context?: string): string {
    console.error(`Error in ${context || 'operation'}:`, error);

    // Network Errors
    if (error?.message === 'Failed to fetch' || error?.status === 0) {
        return 'Network error: Please check your internet connection.';
    }

    // Supabase RLS Policy Errors (often returned as 401 or empty data handled by caller)
    if (error?.code === '42501' || error?.message?.includes('permission denied')) {
        return 'Permission denied: You do not have access to perform this action.';
    }

    // Duplicate Key
    if (error?.code === '23505') {
        return 'This record already exists (duplicate entry).';
    }

    // Custom App Errors (thrown manually)
    if (error instanceof AppError) {
        return error.message;
    }

    // Generic Fallback
    return error?.message || 'An unexpected error occurred. Please try again.';
}

export function validateResult<T>(data: T | null, error: any, context: string): T {
    if (error) throw error;

    // For single result queries, data shouldn't be null
    if (data === null) {
        throw new AppError('Record not found', 'NOT_FOUND');
    }

    // For update/delete returning arrays
    if (Array.isArray(data) && data.length === 0) {
        throw new AppError('Action failed: No changes were saved. Check permissions.', 'RLS_BLOCK');
    }

    return data;
}
