"use client";

import { Mail, Phone, MapPin } from "lucide-react";
import { IconPulse } from "@/components/motion";

interface ContactChannelCardsProps {
  phone: string;
  email: string;
  locationTitle: string;
  locationBody: string;
  officeHours: string;
  phoneLabel: string;
  emailLabel: string;
}

export function ContactChannelCards({
  phone,
  email,
  locationTitle,
  locationBody,
  officeHours,
  phoneLabel,
  emailLabel,
}: ContactChannelCardsProps) {
  return (
    <div className="mt-4 space-y-3">
      <a
        href={`tel:${phone.replace(/\s/g, "")}`}
        className="flex items-center gap-4 rounded-xl border border-[var(--brand-gray-200)] bg-white p-4 hover:border-[var(--brand-red)]"
      >
        <IconPulse>
          <Phone className="h-5 w-5 text-[var(--brand-red)]" />
        </IconPulse>
        <div>
          <p className="text-sm text-[var(--brand-gray-500)]">{phoneLabel}</p>
          <p className="font-semibold" dir="ltr">{phone}</p>
        </div>
      </a>
      <a
        href={`mailto:${email}`}
        className="flex items-center gap-4 rounded-xl border border-[var(--brand-gray-200)] bg-white p-4 hover:border-[var(--brand-red)]"
      >
        <IconPulse>
          <Mail className="h-5 w-5 text-[var(--brand-red)]" />
        </IconPulse>
        <div>
          <p className="text-sm text-[var(--brand-gray-500)]">{emailLabel}</p>
          <p className="font-semibold">{email}</p>
        </div>
      </a>
      <div className="flex items-center gap-4 rounded-xl border border-[var(--brand-gray-200)] bg-white p-4">
        <IconPulse>
          <MapPin className="h-5 w-5 text-[var(--brand-red)]" />
        </IconPulse>
        <div>
          <p className="text-sm text-[var(--brand-gray-500)]">{locationTitle}</p>
          <p className="text-sm">{locationBody}</p>
          <p className="mt-1 text-xs text-[var(--brand-gray-500)]">{officeHours}</p>
        </div>
      </div>
    </div>
  );
}
