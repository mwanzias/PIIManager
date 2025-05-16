import React, { useState, useEffect } from "react";
import { Stack } from "@fluentui/react";
import { Card, CardHeader } from "@fluentui/react-card";
import { Button } from "@fluentui/react-button";
import {
  MpesaIcon,
  PayPalIcon,
  VisaIcon,
  MastercardIcon,
  AirtelIcon,
  GooglePayIcon,
} from "../../svgIcons/paymentIcon";

interface PaymentDetail {
  id: string;
  amount: number;
  currency: string;
  date: string;
  status: string;
  paymentMethod: string;
  last4?: string;
  description?: string;
  receiptUrl?: string;
  billingDetails?: {
    name: string;
    email: string;
    address?: {
      line1: string;
      line2?: string;
      city: string;
      state?: string;
      country: string;
      postalCode: string;
    };
  };
}

// This component carries the details of a specific payment
const PaymentDetails: React.FC = () => {
  const [payment, setPayment] = useState<PaymentDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // In a real implementation, this would fetch the payment details from Stripe API
    // based on the payment ID from URL params or props
    fetchPaymentDetails();
  }, []);

  const fetchPaymentDetails = async () => {
    setIsLoading(true);

    // Mock data for demonstration purposes
    // In a real implementation, this would fetch data from Stripe API
    const mockPaymentDetail: PaymentDetail = {
      id: "ch_1234567890",
      amount: 100,
      currency: "KES",
      date: "2025-05-01",
      status: "succeeded",
      paymentMethod: "visa",
      last4: "4242",
      description: "Monthly subscription - May 2025",
      receiptUrl: "#",
      billingDetails: {
        name: "John Doe",
        email: "john.doe@example.com",
        address: {
          line1: "123 Main St",
          city: "Nairobi",
          country: "Kenya",
          postalCode: "00100",
        },
      },
    };

    setTimeout(() => {
      setPayment(mockPaymentDetail);
      setIsLoading(false);
    }, 1000); // Simulate API delay
  };

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

  if (isLoading) {
    return (
      <div>
        <h1>Payment Details</h1>
        <p>Loading payment details...</p>
      </div>
    );
  }

  if (!payment) {
    return (
      <div>
        <h1>Payment Details</h1>
        <p>Payment not found or could not be loaded.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Payment Details</h1>
      <p>View detailed information about your payment.</p>

      <Card style={{ padding: 20, marginTop: 20 }}>
        <Stack tokens={{ childrenGap: 20 }}>
          {/* Payment Header */}
          <Stack horizontal horizontalAlign="space-between">
            <Stack.Item>
              <h2 style={{ margin: 0 }}>Payment #{payment.id}</h2>
              <div style={{ color: "#666" }}>
                {new Date(payment.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </Stack.Item>
            <Stack.Item>
              <div
                style={{
                  padding: "4px 12px",
                  borderRadius: 16,
                  backgroundColor:
                    payment.status === "succeeded" ? "#e6f7e6" : "#ffebee",
                  color: payment.status === "succeeded" ? "#2e7d32" : "#c62828",
                  fontWeight: "bold",
                }}
              >
                {payment.status.charAt(0).toUpperCase() +
                  payment.status.slice(1)}
              </div>
            </Stack.Item>
          </Stack>

          {/* Payment Amount */}
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 36, fontWeight: "bold" }}>
              {payment.amount} {payment.currency}
            </div>
            <div style={{ color: "#666" }}>{payment.description}</div>
          </div>

          {/* Payment Method */}
          <Card style={{ padding: 16, backgroundColor: "#f9f9f9" }}>
            <h3 style={{ margin: "0 0 12px 0" }}>Payment Method</h3>
            <Stack
              horizontal
              verticalAlign="center"
              tokens={{ childrenGap: 12 }}
            >
              {getPaymentIcon(payment.paymentMethod)}
              <div>
                <div style={{ fontWeight: "bold" }}>
                  {payment.paymentMethod.charAt(0).toUpperCase() +
                    payment.paymentMethod.slice(1)}
                  {payment.last4 && ` (**** ${payment.last4})`}
                </div>
                <div style={{ color: "#666", fontSize: 14 }}>
                  Processed by Stripe
                </div>
              </div>
            </Stack>
          </Card>

          {/* Billing Details */}
          {payment.billingDetails && (
            <Card style={{ padding: 16, backgroundColor: "#f9f9f9" }}>
              <h3 style={{ margin: "0 0 12px 0" }}>Billing Details</h3>
              <Stack tokens={{ childrenGap: 8 }}>
                <div>
                  <strong>Name:</strong> {payment.billingDetails.name}
                </div>
                <div>
                  <strong>Email:</strong> {payment.billingDetails.email}
                </div>
                {payment.billingDetails.address && (
                  <div>
                    <strong>Address:</strong>
                    <div style={{ marginLeft: 16 }}>
                      {payment.billingDetails.address.line1}
                      {payment.billingDetails.address.line2 && (
                        <div>{payment.billingDetails.address.line2}</div>
                      )}
                      <div>
                        {payment.billingDetails.address.city}
                        {payment.billingDetails.address.state &&
                          `, ${payment.billingDetails.address.state}`}{" "}
                        {payment.billingDetails.address.postalCode}
                      </div>
                      <div>{payment.billingDetails.address.country}</div>
                    </div>
                  </div>
                )}
              </Stack>
            </Card>
          )}

          {/* Actions */}
          <Stack horizontal tokens={{ childrenGap: 12 }}>
            {payment.receiptUrl && (
              <Button
                appearance="primary"
                href={payment.receiptUrl}
                target="_blank"
              >
                Download Receipt
              </Button>
            )}
            <Button appearance="outline">Contact Support</Button>
          </Stack>
        </Stack>
      </Card>
    </div>
  );
};

export default PaymentDetails;
