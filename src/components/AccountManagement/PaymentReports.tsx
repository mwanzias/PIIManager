import React, { useState, useEffect } from "react";
import { Stack } from "@fluentui/react";
import { Card, CardHeader } from "@fluentui/react-card";
import {
  MpesaIcon,
  PayPalIcon,
  VisaIcon,
  MastercardIcon,
  AirtelIcon,
  GooglePayIcon,
} from "../../svgIcons/paymentIcon";

interface Payment {
  id: string;
  amount: number;
  currency: string;
  date: string;
  status: string;
  paymentMethod: string;
  last4?: string;
  description?: string;
}

const PaymentReports: React.FC = () => {
  const [paymentHistory, setPaymentHistory] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    // In a real implementation, this would be an API call to Stripe
    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = async () => {
    setIsLoading(true);

    // Mock data for demonstration purposes
    // In a real implementation, this would fetch data from Stripe API
    const mockPaymentHistory: Payment[] = [
      {
        id: "ch_1234567890",
        amount: 100,
        currency: "KES",
        date: "2025-05-01",
        status: "succeeded",
        paymentMethod: "visa",
        last4: "4242",
        description: "Monthly subscription - May 2025",
      },
      {
        id: "ch_0987654321",
        amount: 100,
        currency: "KES",
        date: "2025-04-01",
        status: "succeeded",
        paymentMethod: "mastercard",
        last4: "5555",
        description: "Monthly subscription - April 2025",
      },
      {
        id: "ch_5678901234",
        amount: 100,
        currency: "KES",
        date: "2025-03-01",
        status: "succeeded",
        paymentMethod: "mpesa",
        description: "Monthly subscription - March 2025",
      },
      {
        id: "pp_1234567890",
        amount: 100,
        currency: "KES",
        date: "2025-02-01",
        status: "succeeded",
        paymentMethod: "paypal",
        description: "Monthly subscription - February 2025",
      },
      {
        id: "gp_9876543210",
        amount: 100,
        currency: "KES",
        date: "2025-01-15",
        status: "succeeded",
        paymentMethod: "googlepay",
        description: "Monthly subscription - January 2025",
      },
      {
        id: "at_1357924680",
        amount: 100,
        currency: "KES",
        date: "2025-01-10",
        status: "succeeded",
        paymentMethod: "airtel",
        description: "Monthly subscription - January 2025",
      },
      {
        id: "ch_2468101214",
        amount: 100,
        currency: "KES",
        date: "2025-01-01",
        status: "failed",
        paymentMethod: "visa",
        last4: "4242",
        description: "Monthly subscription - January 2025",
      },
    ];

    setTimeout(() => {
      setPaymentHistory(mockPaymentHistory);
      setIsLoading(false);
    }, 1000); // Simulate API delay
  };

  const filteredPayments =
    filter === "all"
      ? paymentHistory
      : paymentHistory.filter((payment) => payment.paymentMethod === filter);

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case "visa":
        return <VisaIcon />;
      case "mastercard":
        return <MastercardIcon />;
      case "paypal":
        return <PayPalIcon />;
      case "googlepay":
        return <GooglePayIcon />;
      case "mpesa":
        return <MpesaIcon />;
      case "airtel":
        return <AirtelIcon />;
      default:
        return null;
    }
  };

  return (
    <div>
      <h1>Payment Reports</h1>
      <p>View your payment history and transaction details.</p>

      <Stack
        horizontal
        tokens={{ childrenGap: 10 }}
        style={{ marginBottom: 20 }}
      >
        <button
          onClick={() => setFilter("all")}
          style={{
            padding: "8px 16px",
            background: filter === "all" ? "#0078d4" : "#f0f0f0",
            color: filter === "all" ? "white" : "black",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          All
        </button>
        <button
          onClick={() => setFilter("visa")}
          style={{
            padding: "8px 16px",
            background: filter === "visa" ? "#0078d4" : "#f0f0f0",
            color: filter === "visa" ? "white" : "black",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          <VisaIcon /> Visa
        </button>
        <button
          onClick={() => setFilter("mastercard")}
          style={{
            padding: "8px 16px",
            background: filter === "mastercard" ? "#0078d4" : "#f0f0f0",
            color: filter === "mastercard" ? "white" : "black",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          <MastercardIcon /> Mastercard
        </button>
        <button
          onClick={() => setFilter("paypal")}
          style={{
            padding: "8px 16px",
            background: filter === "paypal" ? "#0078d4" : "#f0f0f0",
            color: filter === "paypal" ? "white" : "black",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          <PayPalIcon /> PayPal
        </button>
        <button
          onClick={() => setFilter("mpesa")}
          style={{
            padding: "8px 16px",
            background: filter === "mpesa" ? "#0078d4" : "#f0f0f0",
            color: filter === "mpesa" ? "white" : "black",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          <MpesaIcon /> M-Pesa
        </button>
        <button
          onClick={() => setFilter("airtel")}
          style={{
            padding: "8px 16px",
            background: filter === "airtel" ? "#0078d4" : "#f0f0f0",
            color: filter === "airtel" ? "white" : "black",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          <AirtelIcon /> Airtel
        </button>
        <button
          onClick={() => setFilter("googlepay")}
          style={{
            padding: "8px 16px",
            background: filter === "googlepay" ? "#0078d4" : "#f0f0f0",
            color: filter === "googlepay" ? "white" : "black",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          <GooglePayIcon /> Google Pay
        </button>
      </Stack>

      {isLoading ? (
        <p>Loading payment history...</p>
      ) : filteredPayments.length === 0 ? (
        <p>No payment records found.</p>
      ) : (
        <Stack tokens={{ childrenGap: 16 }}>
          {filteredPayments.map((payment) => (
            <Card key={payment.id} style={{ padding: 16 }}>
              <Stack horizontal horizontalAlign="space-between">
                <Stack.Item>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    {getPaymentIcon(payment.paymentMethod)}
                    <span style={{ marginLeft: 8, fontWeight: "bold" }}>
                      {payment.paymentMethod.charAt(0).toUpperCase() +
                        payment.paymentMethod.slice(1)}
                      {payment.last4 && ` (**** ${payment.last4})`}
                    </span>
                  </div>
                  <div>{payment.description}</div>
                </Stack.Item>
                <Stack.Item>
                  <div style={{ fontWeight: "bold", fontSize: 18 }}>
                    {payment.amount} {payment.currency}
                  </div>
                  <div
                    style={{
                      textAlign: "right",
                      color: payment.status === "succeeded" ? "green" : "red",
                    }}
                  >
                    {payment.status.charAt(0).toUpperCase() +
                      payment.status.slice(1)}
                  </div>
                </Stack.Item>
              </Stack>
              <div style={{ marginTop: 8, color: "#666", fontSize: 14 }}>
                {new Date(payment.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </Card>
          ))}
        </Stack>
      )}

      <div
        style={{
          marginTop: 20,
          padding: 16,
          backgroundColor: "#f9f9f9",
          borderRadius: 8,
        }}
      >
        <h3>Need Help?</h3>
        <p>
          If you have any questions about your payments or need to dispute a
          charge, please contact our support team at support@example.com.
        </p>
      </div>
    </div>
  );
};

export default PaymentReports;
