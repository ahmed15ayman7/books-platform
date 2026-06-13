import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";


const connectionString = process.env["DATABASE_URL"];
if (!connectionString) {
  throw new Error("DATABASE_URL is not set. Run seed from web/ with .env present.");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // Create default admin user
  // const adminPassword = await bcrypt.hash("@123456", 12);
  // const admin = await prisma.user.upsert({
  //   where: { email: "" },
  //   update: {
  //     isSuperAdmin: true,
  //     role: "ADMIN",
  //     isActive: true,
  //   },
  //   create: {
  //     email: "user@example.com",
  //     passwordHash: adminPassword,
  //     fullName: "مدير المنصة",
  //     role: "ADMIN",
  //     isSuperAdmin: true,
  //     permissions: [],
  //     isActive: true,
  //   },
  // });
  // console.log("✅ Admin user created:", admin.email);

  // Default settings
  const defaultSettings = [
    { key: "site_name_ar", value: "منصة الكتب العالمية" },
    { key: "site_name_en", value: "Books Platform" },
    { key: "cart_recovery_enabled", value: true },
    { key: "cart_recovery_delay_hours", value: 2 },
    { key: "cart_recovery_discount", value: 10 },
    { key: "comment_auto_approve", value: false },
    { key: "default_commission_rate", value: 10 },
    { key: "social_facebook", value: "" },
    { key: "social_instagram", value: "" },
    { key: "social_x", value: "" },
    { key: "social_telegram", value: "" },
    { key: "social_youtube", value: "" },
    { key: "social_linkedin", value: "" },
    { key: "ambassador_program_enabled", value: true },
    { key: "b2b_subscriptions_enabled", value: true },
    { key: "maintenance_mode", value: false },
  ];

  for (const setting of defaultSettings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: {
        key: setting.key,
        value: setting.value,
      },
    });
  }
  console.log("✅ Default settings created");

  console.log("🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
