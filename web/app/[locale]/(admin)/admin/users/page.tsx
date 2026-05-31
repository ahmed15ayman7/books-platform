"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Plus, Pencil, Shield, UserX, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminAuthHeaders } from "@/lib/admin/auth-client";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminSearch, AdminStatusBadge } from "@/components/admin/admin-table";
import { useAdminViewMode } from "@/lib/admin/use-admin-view-mode";
import { AdminListToolbar, AdminSortSelect } from "@/components/admin/admin-list-controls";
import {
  AdminGridCard,
  AdminGridCardBody,
  AdminGridCardFooter,
} from "@/components/admin/admin-data-grid";
import { AdminListView } from "@/components/admin/admin-list-view";
import { sortClientList } from "@/lib/admin/client-list-sort";
import {
  adminCreatedAtColumn,
  adminUpdatedAtColumn,
} from "@/components/admin/admin-timestamps";
import {
  PERMISSION_GROUPS,
  type Permission,
} from "@/lib/auth/permissions";
import { can, loadAdminSession } from "@/lib/admin/permissions-client";
import { usePasskeyGate } from "@/lib/admin/use-passkey-gate";
import { PasskeyGateDialog } from "@/components/admin/passkey-gate-dialog";
import { adminFieldClass } from "@/components/admin/admin-form-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { PERMISSIONS } from "@/lib/auth/permissions";

interface AdminUserRow {
  id: string;
  email: string;
  fullName: string;
  isSuperAdmin: boolean;
  permissions: Permission[] | unknown;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface FormState {
  email: string;
  password: string;
  fullName: string;
  isSuperAdmin: boolean;
  isActive: boolean;
  permissions: Permission[];
}

const emptyForm: FormState = {
  email: "",
  password: "",
  fullName: "",
  isSuperAdmin: false,
  isActive: true,
  permissions: [],
};

export default function AdminUsersPage() {
  const params = useParams();
  const locale = (params.locale as string) ?? "ar";
  const session = loadAdminSession();
  const isSuper = session?.isSuperAdmin ?? false;
  const { runWithPasskey, busy: passkeyBusy, error: passkeyError } = usePasskeyGate();
  const [passkeyOpen, setPasskeyOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => Promise<void>) | null>(null);

  const { viewMode, setViewMode } = useAdminViewMode("users");
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("createdAt:desc");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/admin/users", {
        headers: adminAuthHeaders(),
      });
      const data = (await res.json()) as { success: boolean; data?: AdminUserRow[] };
      if (data.success && data.data) setUsers(data.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const displayedUsers = useMemo(() => {
    const filtered = search.trim()
      ? users.filter(
          (u) =>
            u.fullName.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase()),
        )
      : users;
    return sortClientList(
      filtered,
      sort,
      {
        fullName: (u) => u.fullName,
        email: (u) => u.email,
        createdAt: (u) => u.createdAt,
        updatedAt: (u) => u.updatedAt,
      },
      "createdAt",
    );
  }, [users, search, sort]);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setShowForm(true);
  }

  function openEdit(row: AdminUserRow) {
    setEditingId(row.id);
    setForm({
      email: row.email,
      password: "",
      fullName: row.fullName,
      isSuperAdmin: row.isSuperAdmin,
      isActive: row.isActive,
      permissions: Array.isArray(row.permissions)
        ? (row.permissions as Permission[])
        : [],
    });
    setError("");
    setShowForm(true);
  }

  function togglePermission(perm: Permission) {
    setForm((f) => ({
      ...f,
      permissions: f.permissions.includes(perm)
        ? f.permissions.filter((p) => p !== perm)
        : [...f.permissions, perm],
    }));
  }

  function toggleGroup(groupPerms: Permission[]) {
    const allSelected = groupPerms.every((p) => form.permissions.includes(p));
    setForm((f) => ({
      ...f,
      permissions: allSelected
        ? f.permissions.filter((p) => !groupPerms.includes(p))
        : [...new Set([...f.permissions, ...groupPerms])],
    }));
  }

  function runSensitive(action: () => Promise<void>) {
    setPendingAction(() => action);
    setPasskeyOpen(true);
  }

  async function handlePasskeyContinue() {
    if (!pendingAction) return;
    await runWithPasskey(async () => {
      setPasskeyOpen(false);
      await pendingAction();
      setPendingAction(null);
    });
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    runSensitive(async () => {
    setSaving(true);
    try {
      if (editingId) {
        const body: Record<string, unknown> = {
          fullName: form.fullName,
          permissions: form.permissions,
          isActive: form.isActive,
        };
        if (form.password.trim()) body.password = form.password;
        if (isSuper) body.isSuperAdmin = form.isSuperAdmin;

        const res = await fetch(`/api/v1/admin/users/${editingId}`, {
          method: "PATCH",
          headers: { ...adminAuthHeaders(), "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = (await res.json()) as { success: boolean; error?: { message: string } };
        if (!res.ok || !data.success) {
          setError(data.error?.message ?? "فشل التحديث");
          return;
        }
      } else {
        const res = await fetch("/api/v1/admin/users", {
          method: "POST",
          headers: { ...adminAuthHeaders(), "Content-Type": "application/json" },
          body: JSON.stringify({
            email: form.email,
            password: form.password,
            fullName: form.fullName,
            permissions: form.permissions,
            isSuperAdmin: isSuper ? form.isSuperAdmin : false,
          }),
        });
        const data = (await res.json()) as { success: boolean; error?: { message: string } };
        if (!res.ok || !data.success) {
          setError(data.error?.message ?? "فشل الإنشاء");
          return;
        }
      }
      setShowForm(false);
      void loadUsers();
    } catch {
      setError("حدث خطأ في الاتصال");
    } finally {
      setSaving(false);
    }
    });
  }

  async function deactivateUser(id: string, name: string) {
    if (!confirm(`تعطيل حساب «${name}»؟`)) return;
    runSensitive(async () => {
      const res = await fetch(`/api/v1/admin/users/${id}`, {
        method: "DELETE",
        headers: adminAuthHeaders(),
      });
      const data = (await res.json()) as { success: boolean };
      if (data.success) void loadUsers();
    });
  }

  if (!can(PERMISSIONS.users.view)) {
    return (
      <div className="p-8 text-[var(--admin-text)]">
        <p className="text-[var(--admin-text-muted)]">ليس لديك صلاحية عرض مديري النظام.</p>
      </div>
    );
  }

  const rowActions = (row: AdminUserRow) => (
    <div className="flex items-center gap-1">
      <Link href={`/${locale}/admin/users/${row.id}`}>
        <Button size="icon" variant="ghost" className="h-8 w-8" aria-label="سجل الدخول">
          <History className="h-4 w-4" />
        </Button>
      </Link>
      {can(PERMISSIONS.users.update) && (
        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEdit(row)} aria-label="تعديل">
          <Pencil className="h-4 w-4" />
        </Button>
      )}
      {can(PERMISSIONS.users.delete) && row.isActive && row.id !== session?.id && (
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-red-400 hover:text-red-300"
          onClick={() => void deactivateUser(row.id, row.fullName)}
          aria-label="تعطيل"
        >
          <UserX className="h-4 w-4" />
        </Button>
      )}
    </div>
  );

  const renderCard = (row: AdminUserRow) => (
    <AdminGridCard>
      <AdminGridCardBody>
        <div className="flex items-start gap-2">
          <h3 className="font-semibold text-[var(--admin-text)]">{row.fullName}</h3>
          {row.isSuperAdmin && (
            <span className="rounded bg-[var(--brand-red-soft)] px-1.5 py-0.5 text-[10px] text-[var(--brand-red)]">
              رئيسي
            </span>
          )}
        </div>
        <p className="text-xs text-[var(--admin-text-subtle)]" dir="ltr">
          {row.email}
        </p>
        <AdminStatusBadge
          status={row.isActive ? "published" : "draft"}
          customLabel={row.isActive ? "نشط" : "معطّل"}
        />
      </AdminGridCardBody>
      <AdminGridCardFooter>{rowActions(row)}</AdminGridCardFooter>
    </AdminGridCard>
  );

  const columns = [
    {
      key: "fullName",
      label: "الاسم",
      render: (row: AdminUserRow) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">{row.fullName}</span>
          {row.isSuperAdmin && (
            <span className="rounded bg-[var(--brand-red-soft)] px-1.5 py-0.5 text-[10px] text-[var(--brand-red)]">
              رئيسي
            </span>
          )}
        </div>
      ),
    },
    {
      key: "email",
      label: "البريد",
      className: "text-[var(--admin-text-muted)]",
      render: (row: AdminUserRow) => <span dir="ltr">{row.email}</span>,
    },
    {
      key: "status",
      label: "الحالة",
      render: (row: AdminUserRow) => (
        <AdminStatusBadge status={row.isActive ? "published" : "draft"} customLabel={row.isActive ? "نشط" : "معطّل"} />
      ),
    },
    adminCreatedAtColumn<AdminUserRow>(),
    adminUpdatedAtColumn<AdminUserRow>(),
    { key: "actions", label: "", headerClassName: "w-28", render: rowActions },
  ];

  return (
    <div className="text-[var(--admin-text)]">
      <AdminPageHeader
        title="مديرو النظام"
        subtitle="إنشاء حسابات وتحديد صلاحيات كل مدير"
        actions={
          <div className="flex items-center gap-2">
            <AdminSearch value={search} onChange={setSearch} placeholder="بحث..." />
            {can(PERMISSIONS.users.create) && (
              <Button size="sm" className="gap-1.5" onClick={openCreate}>
                <Plus className="h-4 w-4" />
                مدير جديد
              </Button>
            )}
          </div>
        }
      />

      {showForm && (
        <div className="mb-6 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
            <Shield className="h-5 w-5 text-[var(--brand-red)]" />
            {editingId ? "تعديل مدير" : "مدير جديد"}
          </h2>
          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              {!editingId && (
                <div>
                  <Label className="mb-1 text-xs text-[var(--admin-text-muted)]">البريد *</Label>
                  <Input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={adminFieldClass}
                    dir="ltr"
                  />
                </div>
              )}
              <div>
                <Label className="mb-1 text-xs text-[var(--admin-text-muted)]">
                  {editingId ? "كلمة مرور جديدة (اختياري)" : "كلمة المرور *"}
                </Label>
                <Input
                  type="password"
                  required={!editingId}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className={adminFieldClass}
                />
              </div>
              <div className="sm:col-span-2">
                <Label className="mb-1 text-xs text-[var(--admin-text-muted)]">الاسم الكامل *</Label>
                <Input
                  type="text"
                  required
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className={adminFieldClass}
                />
              </div>
            </div>

            {isSuper && (
              <div className="flex items-center gap-2 text-sm">
                <Checkbox
                  id="isSuperAdmin"
                  checked={form.isSuperAdmin}
                  onCheckedChange={(checked) =>
                    setForm({
                      ...form,
                      isSuperAdmin: checked === true,
                      permissions: checked === true ? [] : form.permissions,
                    })
                  }
                  className="border-[var(--admin-input-border)] data-[state=checked]:bg-[var(--brand-red)]"
                />
                <Label htmlFor="isSuperAdmin" className="cursor-pointer font-normal text-[var(--admin-text)]">
                  مدير رئيسي (كل الصلاحيات)
                </Label>
              </div>
            )}

            {editingId && (
              <div className="flex items-center gap-2 text-sm">
                <Checkbox
                  id="isActive"
                  checked={form.isActive}
                  onCheckedChange={(checked) =>
                    setForm({ ...form, isActive: checked === true })
                  }
                  className="border-[var(--admin-input-border)] data-[state=checked]:bg-[var(--brand-red)]"
                />
                <Label htmlFor="isActive" className="cursor-pointer font-normal text-[var(--admin-text)]">
                  الحساب نشط
                </Label>
              </div>
            )}

            {!form.isSuperAdmin && (
              <div className="space-y-4 max-h-[420px] overflow-y-auto rounded-lg border border-[var(--admin-border)] p-4">
                <p className="text-sm font-semibold text-[var(--admin-text-muted)]">الصلاحيات</p>
                {PERMISSION_GROUPS.map((group) => {
                  const keys = group.permissions.map((p) => p.key);
                  const allOn = keys.every((k) => form.permissions.includes(k));
                  return (
                    <div key={group.id} className="border-b border-[var(--admin-border)] pb-3 last:border-0">
                      <div className="mb-2 flex cursor-pointer items-center gap-2 text-sm font-medium">
                        <Checkbox
                          id={`group-${group.id}`}
                          checked={allOn}
                          onCheckedChange={() => toggleGroup(keys)}
                          className="border-[var(--admin-input-border)] data-[state=checked]:bg-[var(--brand-red)]"
                        />
                        <Label htmlFor={`group-${group.id}`} className="cursor-pointer font-medium text-[var(--admin-text)]">
                          {group.labelAr}
                        </Label>
                      </div>
                      <div className="mr-6 flex flex-wrap gap-3">
                        {group.permissions.map((p) => (
                          <div key={p.key} className="flex cursor-pointer items-center gap-1.5 text-xs text-[var(--admin-text-muted)]">
                            <Checkbox
                              id={`perm-${p.key}`}
                              checked={form.permissions.includes(p.key)}
                              onCheckedChange={() => togglePermission(p.key)}
                              className="border-[var(--admin-input-border)] data-[state=checked]:bg-[var(--brand-red)]"
                            />
                            <Label htmlFor={`perm-${p.key}`} className="cursor-pointer font-normal">
                              {p.labelAr}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {error && <p className="text-sm text-red-400">{error}</p>}

            <div className="flex gap-2">
              <Button type="submit" loading={saving}>
                {editingId ? "حفظ" : "إنشاء"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                إلغاء
              </Button>
            </div>
          </form>
        </div>
      )}

      <AdminListToolbar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        sort={
          <AdminSortSelect
            value={sort}
            onChange={setSort}
            options={[
              { value: "createdAt:desc", label: "الأحدث" },
              { value: "fullName:asc", label: "الاسم أ–ي" },
              { value: "updatedAt:desc", label: "آخر تحديث" },
            ]}
          />
        }
      />

      <AdminListView
        viewMode={viewMode}
        columns={columns}
        data={displayedUsers}
        loading={loading}
        emptyMessage="لا يوجد مديرون — أضف مديراً جديداً"
        renderCard={renderCard}
      />

      <PasskeyGateDialog
        open={passkeyOpen}
        onOpenChange={setPasskeyOpen}
        busy={passkeyBusy}
        error={passkeyError}
        onConfirm={() => void handlePasskeyContinue()}
      />
    </div>
  );
}

