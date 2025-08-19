import { NextResponse } from "next/server";
import connectDB from "@/app/lib/dbconnect";
import { Transaction } from "@/app/models/pricingmodel";
import { Business } from "@/app/models/business";

export async function POST(req) {
  try {
    console.log("📡 [API] Transaction verification request received...");

    // Connect to DB
    await connectDB();
    console.log("✅ [DB] Connected successfully");

    const { transactionId, status, adminNote } = await req.json();
    console.log("📥 [Request Body]:", { transactionId, status, adminNote });

    if (!transactionId || !status) {
      console.warn("⚠️ [Validation] Missing required fields: transactionId or status");
      return NextResponse.json({
        success: false,
        msg: "Transaction ID and status are required",
      }, { status: 400 });
    }

    // Find the transaction
    const transaction = await Transaction.findOne({ transactionId });
    if (!transaction) {
      console.warn(`🚫 [Transaction] Not found for ID: ${transactionId}`);
      return NextResponse.json({
        success: false,
        msg: "Transaction not found",
      }, { status: 404 });
    }
    console.log("🔍 [Transaction Found]:", transaction);

    // Update transaction status
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      transaction._id,
      {
        status,
        adminNote,
        verifiedAt: new Date(),
        verifiedBy: "admin_user_id_here", // Replace with actual admin ID
      },
      { new: true }
    );
    console.log(`✏️ [Transaction Updated]: Status → ${status}`);

    // If transaction is approved, update business subscription
    if (status === "approved") {
      console.log("💳 [Approval] Approved transaction, updating business subscription...");

      // Get business details
      const business = await Business.findOne({ businessName: transaction.businessName });
      if (!business) {
        console.error(`❌ [Business] Not found for name: ${transaction.businessName}`);
        return NextResponse.json({
          success: false,
          msg: "Business not found",
        }, { status: 404 });
      }
      console.log("🏢 [Business Found]:", business.businessName);

      // Calculate new expiry
      let newExpiry = business.subscription?.expiryDate && new Date(business.subscription.expiryDate) > new Date()
        ? new Date(business.subscription.expiryDate)
        : new Date();

      newExpiry.setMonth(newExpiry.getMonth() + transaction.planDurationMonths);

      console.log(`⏳ [Subscription Update] Plan: ${transaction.planName}, Expiry → ${newExpiry}`);

      // Update business subscription
      await Business.findOneAndUpdate(
        { businessName: transaction.businessName },
        {
          subscription: {
            planName: transaction.planName,
            expiryDate: newExpiry,
          },
        },
        { new: true }
      );
      console.log("✅ [Business Subscription] Updated successfully");
    }

    console.log("🎉 [Success] Transaction verification completed");
    return NextResponse.json({
      success: true,
      data: updatedTransaction,
    }, { status: 200 });

  } catch (error) {
    console.error("🔥 [Error] Transaction verification failed:", error);
    return NextResponse.json({
      success: false,
      msg: "Error verifying transaction",
      error: error.message,
    }, { status: 500 });
  }
}
