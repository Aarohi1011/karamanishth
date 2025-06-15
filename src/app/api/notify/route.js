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
          body: message
        }));
      } catch (err) {
        console.error("Push error:", err);
      }
    }
  }

  return NextResponse.json({ success: true });
}
