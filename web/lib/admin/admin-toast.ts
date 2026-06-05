import { toast } from "sonner";

export type AdminToastAction = "create" | "update" | "save" | "delete" | "restore" | "publish" | "send" | "draft";

const MESSAGES: Record<AdminToastAction, { done: string; entity?: (label: string) => string }> = {
  create: {
    done: "تم الإنشاء بنجاح",
    entity: (label) => `تم إنشاء ${label} بنجاح`,
  },
  update: {
    done: "تم التحديث بنجاح",
    entity: (label) => `تم تحديث ${label} بنجاح`,
  },
  save: {
    done: "تم الحفظ بنجاح",
    entity: (label) => `تم حفظ ${label} بنجاح`,
  },
  delete: {
    done: "تم الحذف بنجاح",
    entity: (label) => `تم حذف ${label}`,
  },
  restore: {
    done: "تمت الاستعادة بنجاح",
    entity: (label) => `تمت استعادة ${label}`,
  },
  publish: {
    done: "تم النشر بنجاح",
    entity: (label) => `تم نشر ${label} بنجاح`,
  },
  send: {
    done: "تم الإرسال بنجاح",
    entity: (label) => `تم إرسال ${label} بنجاح`,
  },
  draft: {
    done: "تم حفظ المسودة",
    entity: (label) => `تم حفظ مسودة ${label}`,
  },
};

function actionMessage(action: AdminToastAction, entityLabel?: string): string {
  const entry = MESSAGES[action];
  return entityLabel ? entry.entity!(entityLabel) : entry.done;
}

export interface AdminToastOptions {
  description?: string;
  action?: { label: string; onClick: () => void };
  duration?: number;
}

export const adminToast = {
  success(action: AdminToastAction, entityLabel?: string, options?: AdminToastOptions) {
    toast.success(actionMessage(action, entityLabel), options);
  },

  message(message: string, options?: AdminToastOptions) {
    toast.success(message, options);
  },

  error(message: string, options?: Omit<AdminToastOptions, "action">) {
    toast.error(message, options);
  },

  loading(message: string) {
    return toast.loading(message);
  },

  dismiss(id?: string | number) {
    toast.dismiss(id);
  },

  promise<T>(
    promise: Promise<T>,
    messages: { loading: string; success: string; error: string },
  ) {
    return toast.promise(promise, messages);
  },
};
