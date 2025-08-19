import { NextResponse } from "next/server";
import connectDB from "@/app/lib/dbconnect";
import { Transaction } from "@/app/models/pricingmodel";
import { Business } from "@/app/models/business";
import { auth } from "@/app/lib/auth";

// Utility for timestamped logs
const log = (level, context, message, data = null) => {
  const ts = new Date().toISOString();
  const emojis = {
    info: "ℹ️",
    success: "✅",
    warn: "⚠️",
    error: "❌"
  };
  const colors = {
    info: "\x1b[34m",    // blue
    success: "\x1b[32m", // green
    warn: "\x1b[33m",    // yellow
    error: "\x1b[31m"    // red
  };
  const reset = "\x1b[0m";

  console.log(
    `${colors[level]}${emojis[level]} [${ts}] [${context}] ${message}${reset}`,
    data ? data : ""
  );
};

export async function POST(req) {
  const context = "POST /transactions";
  try {
    await connectDB();
    log("info", context, "Database connected");

    const user = await auth();
    if (!user || !user.businessName) {
      log("warn", context, "Unauthorized request", { user });
      return NextResponse.json({ success: false, msg: "Unauthorized - Please login first" }, { status: 401 });
    }

    log("info", context, "Authenticated user", { userId: user._id, businessName: user.businessName });

    const businessDetails = await Business.findOne({ businessName: user.businessName }).exec();
    if (!businessDetails) {
      log("warn", context, "Business details not found", { businessName: user.businessName });
      return NextResponse.json({ success: false, msg: "Business details not found" }, { status: 404 });
    }

    const { transactionId, planName, employeeCount, planDurationMonths, paymentMethod = "upi" } = await req.json();
    if (!transactionId || !planName || !employeeCount || !planDurationMonths) {
      log("warn", context, "Missing required fields");
      return NextResponse.json({ success: false, msg: "Missing required fields" }, { status: 400 });
    }

    log("info", context, "Transaction request received", { transactionId, planName, employeeCount, planDurationMonths });

    const existingTransaction = await Transaction.findOne({ transactionId });
    if (existingTransaction) {
      log("warn", context, "Duplicate transaction attempt", { transactionId });
      return NextResponse.json({ success: false, msg: "This transaction ID has already been submitted" }, { status: 400 });
    }

    const newTransaction = await Transaction.createTransaction({
      businessName: businessDetails.businessName,
      businessType: businessDetails.businessType,
      userId: user._id,
      transactionId,
      planName,
      employeeCount,
      planDurationMonths,
      paymentMethod
    });

    log("success", context, "Transaction created", { transactionId: newTransaction.transactionId, amount: newTransaction.finalAmount });

    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + planDurationMonths);

    await Business.updateOne(
      { businessName: user.businessName },
      {
        $set: {
          subscription: {
            planName,
            expiryDate
          }
        }
      }
    );

    log("success", context, "Business subscription updated", { businessName: user.businessName, planName, expiryDate });

    return NextResponse.json({
      success: true,
      msg: "Transaction submitted successfully",
      data: {
        transactionId: newTransaction.transactionId,
        status: newTransaction.status,
        submittedAt: newTransaction.submittedAt,
        finalAmount: newTransaction.finalAmount,
        planDuration: newTransaction.planDurationMonths
      }
    }, { status: 201 });

  } catch (error) {
    log("error", context, "Transaction submission error", { error: error.message });
    return NextResponse.json({ success: false, msg: "Error submitting transaction", error: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  const context = "GET /transactions";
  try {
    await connectDB();
    log("info", context, "Database connected");

    const user = await auth();
    if (!user || !user.businessName) {
      log("warn", context, "Unauthorized request", { user });
      return NextResponse.json({ success: false, msg: "Unauthorized - Please login first" }, { status: 401 });
    }

    log("info", context, "Authenticated user", { userId: user._id, businessName: user.businessName });

    const businessDetails = await Business.findOne({ businessName: user.businessName }).exec();
    if (!businessDetails) {
      log("warn", context, "Business details not found", { businessName: user.businessName });
      return NextResponse.json({ success: false, msg: "Business details not found" }, { status: 404 });
    }

    const transactions = await Transaction.find({ businessName: businessDetails.businessName })
      .sort({ createdAt: -1 })
      .lean();

    log("info", context, "Transactions fetched", { count: transactions.length });

    const enhancedTransactions = transactions.map(tx => ({
      ...tx,
      durationLabel: tx.planDurationMonths === 1 ? "1 Month" :
        tx.planDurationMonths === 6 ? "6 Months" :
          "1 Year",
      totalCost: tx.finalAmount,
      costPerEmployee: tx.pricePerEmployee
    }));

    log("success", context, "Transactions processed for response");

    return NextResponse.json({ success: true, data: enhancedTransactions }, { status: 200 });

  } catch (error) {
    log("error", context, "Error fetching transactions", { error: error.message });
    return NextResponse.json({ success: false, msg: "Error fetching transactions", error: error.message }, { status: 500 });
  }
}
