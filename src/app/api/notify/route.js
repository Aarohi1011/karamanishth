import webPush from 'web-push';
import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/dbconnect';
import { Employee } from '@/app/models/employee';

webPush.setVapidDetails(
  'mailto:admin@example.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

export async function POST(req) {
  await connectDB();
  const { message, title = "New Notification", userIds } = await req.json();

  const employees = await Employee.find({ _id: { $in: userIds } });

  for (const emp of employees) {
    if (emp.subscription) {
      try {
        await webPush.sendNotification(emp.subscription, JSON.stringify({
          title,
          body: message,
          icon: 'https://cdn.corenexis.com/i/d/ju16/5nLvsN.png?token=5eeb75d88f36638a48375f7517bf7cfb', // Add an icon path
          badge: 'https://cdn.corenexis.com/i/d/ju16/e5c0Pg.png?token=5eeb75d88f36638a48375f7517bf7cfb', // Add a badge path
          actions: [
            { action: 'accept', title: '✅ Manjuri' },
            { action: 'reject', title: '❌ Reject' }
          ],
          data: {
            acceptUrl: "https://pathshala.sharmaindustry.in",
            rejectUrl: "https://pathshala.sharmaindustry.in",
            defaultUrl: "https://pathshala.sharmaindustry.in"
          }
        }));
      } catch (err) {
        console.error("Push error:", err);
      }
    }
  }

  return NextResponse.json({ success: true });
}
