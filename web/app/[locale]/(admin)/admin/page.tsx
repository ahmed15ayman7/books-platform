"use client";

import { loadAdminSession } from '@/lib/admin/permissions-client';
import { redirect, useParams } from 'next/navigation';

export default function AdminPage() {
    const params = useParams();
    const locale = (params.locale as string) ?? "ar";
    const session = loadAdminSession();
    if (session?.isSuperAdmin) {
        return redirect(`/${locale}/admin/dashboard`);
    }
    return redirect(`/${locale}/admin/login`);
}