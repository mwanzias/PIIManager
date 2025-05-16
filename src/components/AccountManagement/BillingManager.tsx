import { Spinner, Stack } from "@fluentui/react";
import { Card, CardHeader } from "@fluentui/react-card";
import { RadioGroup, Radio } from "@fluentui/react-radio";
import React, { useEffect, useState, useRef } from "react";
import {
  MpesaIcon,
  PayPalIcon,
  VisaIcon,
  MastercardIcon,
  AirtelIcon,
  GooglePayIcon,
} from "../../svgIcons/paymentIcon";
import { Button } from "@fluentui/react-button";
import ProcessingSpinner from "../Marketing/Spinner";

// this will be the component that will manage the billing of the user
// integrated with stripe for card payments and payment tracking

const BillingManager: React.FC = () => {
  const [selectedPaymentOption, setSelectedPaymentOption] =
    useState<string>("");
  const [showSpinner, setShowSpinner] = useState(false);
  const [showStripeForm, setShowStripeForm] = useState(false);
  const [showPayPalForm, setShowPayPalForm] = useState(false);
  const [showGooglePayForm, setShowGooglePayForm] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
  const stripeIframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Reset form visibility when payment option changes
    setShowStripeForm(
      selectedPaymentOption === "visa" || selectedPaymentOption === "mastercard"
    );
    setShowPayPalForm(selectedPaymentOption === "paypal");
    setShowGooglePayForm(selectedPaymentOption === "googlepay");

    console.log("Selected Payment Option: ", selectedPaymentOption);

    // Load payment history from Stripe when component mounts
    if (paymentHistory.length === 0) {
      fetchPaymentHistory();
    }
  }, [selectedPaymentOption]);

  const fetchPaymentHistory = async () => {
    // This would be an actual API call to Stripe in a real implementation
    // For demo purposes, we'll use mock data
    const mockPaymentHistory = [
      {
        id: "ch_1234567890",
        amount: 100,
        currency: "KES",
        date: "2025-05-01",
        status: "succeeded",
        paymentMethod: "visa",
        last4: "4242",
      },
      {
        id: "ch_0987654321",
        amount: 100,
        currency: "KES",
        date: "2025-04-01",
        status: "succeeded",
        paymentMethod: "mastercard",
        last4: "5555",
      },
    ];

    setPaymentHistory(mockPaymentHistory);
  };

  const callStkPush = async () => {
    setShowSpinner(true);
    setTimeout(() => setShowSpinner(false), 10000); // change this to be set when the stkpush returns
    console.log("Processing mobile payment...");
  };

  const processCardPayment = () => {
    setShowSpinner(true);
    // In a real implementation, this would communicate with the Stripe iframe
    setTimeout(() => {
      setShowSpinner(false);
      // Add the new payment to history
      const newPayment = {
        id: "ch_" + Math.random().toString(36).substr(2, 9),
        amount: 100,
        currency: "KES",
        date: new Date().toISOString().split("T")[0],
        status: "succeeded",
        paymentMethod: selectedPaymentOption,
        last4: selectedPaymentOption === "visa" ? "4242" : "5555",
      };
      setPaymentHistory([newPayment, ...paymentHistory]);
    }, 3000);
    console.log("Processing card payment...");
  };

  const processPayPalPayment = () => {
    setShowSpinner(true);
    // In a real implementation, this would communicate with the PayPal SDK
    setTimeout(() => {
      setShowSpinner(false);
      // Add the new payment to history
      const newPayment = {
        id: "pp_" + Math.random().toString(36).substr(2, 9),
        amount: 100,
        currency: "KES",
        date: new Date().toISOString().split("T")[0],
        status: "succeeded",
        paymentMethod: "paypal",
        last4: "",
      };
      setPaymentHistory([newPayment, ...paymentHistory]);
    }, 3000);
    console.log("Processing PayPal payment...");
  };

  const processGooglePayPayment = () => {
    setShowSpinner(true);
    // In a real implementation, this would communicate with the Google Pay API
    setTimeout(() => {
      setShowSpinner(false);
      // Add the new payment to history
      const newPayment = {
        id: "gp_" + Math.random().toString(36).substr(2, 9),
        amount: 100,
        currency: "KES",
        date: new Date().toISOString().split("T")[0],
        status: "succeeded",
        paymentMethod: "googlepay",
        last4: "",
      };
      setPaymentHistory([newPayment, ...paymentHistory]);
    }, 3000);
    console.log("Processing Google Pay payment...");
  };

  return (
    <div>
      <h1>Billing Manager</h1>
      <p>
        This is the Billing Manager component. Kindly select Mode of Payment
      </p>
      <Stack
        horizontal={false}
        tokens={{ childrenGap: 20 }}
        style={{ marginTop: 20 }}
      >
        <Stack
          horizontal
          tokens={{ childrenGap: 20 }}
          style={{ marginTop: 20 }}
        >
          {/* Card 1 - Mobile Payments */}
          <Card style={{ width: 250 }}>
            <CardHeader header={<b>Select Mobile Payment</b>} />

            <RadioGroup
              layout="vertical"
              value={selectedPaymentOption}
              onChange={(e, data) => setSelectedPaymentOption(data.value)}
            >
              <Radio
                value="mpesa"
                label={
                  <Stack
                    horizontal
                    verticalAlign="center"
                    tokens={{ childrenGap: 8 }}
                  >
                    <MpesaIcon />
                    <span>M-Pesa</span>
                  </Stack>
                }
              />
              <Radio
                value="airtel"
                label={
                  <Stack
                    horizontal
                    verticalAlign="center"
                    tokens={{ childrenGap: 8 }}
                  >
                    <AirtelIcon />
                    <span>Airtel Money</span>
                  </Stack>
                }
              />
            </RadioGroup>
          </Card>

          {/* Card 2 - Card Payments */}
          <Card style={{ width: 250 }}>
            <CardHeader header={<b>Select Card Payment</b>} />

            <RadioGroup
              layout="vertical"
              value={selectedPaymentOption}
              onChange={(e, data) => setSelectedPaymentOption(data.value)}
            >
              <Radio
                value="visa"
                label={
                  <Stack
                    horizontal
                    verticalAlign="center"
                    tokens={{ childrenGap: 8 }}
                  >
                    <VisaIcon />
                    <span>Visa Card</span>
                  </Stack>
                }
              />
              <Radio
                value="mastercard"
                label={
                  <Stack
                    horizontal
                    verticalAlign="center"
                    tokens={{ childrenGap: 8 }}
                  >
                    <MastercardIcon />
                    <span>MasterCard</span>
                  </Stack>
                }
              />
            </RadioGroup>
          </Card>

          {/* Card 3 - Other Payment Options */}
          <Card style={{ width: 250 }}>
            <CardHeader header={<b>Other Payment Options</b>} />

            <RadioGroup
              layout="vertical"
              value={selectedPaymentOption}
              onChange={(e, data) => setSelectedPaymentOption(data.value)}
            >
              <Radio
                value="paypal"
                label={
                  <Stack
                    horizontal
                    verticalAlign="center"
                    tokens={{ childrenGap: 8 }}
                  >
                    <PayPalIcon />
                    <span>PayPal</span>
                  </Stack>
                }
              />
              <Radio
                value="googlepay"
                label={
                  <Stack
                    horizontal
                    verticalAlign="center"
                    tokens={{ childrenGap: 8 }}
                  >
                    <GooglePayIcon />
                    <span>Google Pay</span>
                  </Stack>
                }
              />
            </RadioGroup>
          </Card>
        </Stack>

        {/* Payment Instructions and Forms */}
        <Stack
          horizontal
          tokens={{ childrenGap: 20 }}
          style={{ marginTop: 20 }}
        >
          <div style={{ width: "100%" }}>
            <h2>Payment Instructions</h2>
            <p>
              Selected Payment Option:{" "}
              {selectedPaymentOption ? selectedPaymentOption : "None"}
            </p>

            {/* Mobile Payment Instructions */}
            {selectedPaymentOption === "mpesa" && (
              <div>
                <p>
                  Click{" "}
                  <Button
                    appearance={"subtle"}
                    icon={<MpesaIcon />}
                    onClick={callStkPush}
                    style={{ color: "green" }}
                  >
                    Send Request
                  </Button>{" "}
                  to the registered phone number for M-Pesa for Kshs. 100 for
                  the month of May
                </p>
              </div>
            )}
            {selectedPaymentOption === "airtel" && (
              <div>
                <p>
                  Click{" "}
                  <Button
                    appearance={"subtle"}
                    icon={<AirtelIcon />}
                    onClick={callStkPush}
                    style={{ color: "red" }}
                  >
                    Send Request
                  </Button>{" "}
                  to the registered phone number for Airtel Money for Kshs. 100
                  for the month of May
                </p>
              </div>
            )}

            {/* Stripe Card Payment Form */}
            {showStripeForm && (
              <div
                style={{
                  marginTop: 20,
                  border: "1px solid #ccc",
                  borderRadius: 8,
                  padding: 16,
                }}
              >
                <h3>Card Payment</h3>
                <div style={{ display: "flex", marginBottom: 16 }}>
                  <div style={{ marginRight: 16 }}>
                    <VisaIcon />
                  </div>
                  <div>
                    <MastercardIcon />
                  </div>
                </div>

                {/* Stripe iframe for secure card input */}
                <div
                  style={{
                    border: "1px solid #eee",
                    borderRadius: 4,
                    padding: 10,
                    marginBottom: 16,
                  }}
                >
                  <iframe
                    ref={stripeIframeRef}
                    title="Stripe Payment Form"
                    style={{
                      width: "100%",
                      height: "150px",
                      border: "none",
                      background: "#f9f9f9",
                    }}
                    src="about:blank"
                  >
                    {/* In a real implementation, this would be a Stripe Elements iframe */}
                  </iframe>
                  <div style={{ fontSize: 12, color: "#666", marginTop: 8 }}>
                    Your card information is securely processed by Stripe. We
                    never store your card details.
                  </div>
                </div>

                <Button appearance="primary" onClick={processCardPayment}>
                  Pay Kshs. 100
                </Button>
              </div>
            )}

            {/* PayPal Payment Form */}
            {showPayPalForm && (
              <div
                style={{
                  marginTop: 20,
                  border: "1px solid #ccc",
                  borderRadius: 8,
                  padding: 16,
                }}
              >
                <h3>PayPal Payment</h3>
                <div style={{ display: "flex", marginBottom: 16 }}>
                  <PayPalIcon />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <p>
                    You will be redirected to PayPal to complete your payment of
                    Kshs. 100 for the month of May.
                  </p>
                </div>

                <Button
                  appearance="primary"
                  onClick={processPayPalPayment}
                  style={{ backgroundColor: "#0070ba" }}
                >
                  Pay with PayPal
                </Button>
              </div>
            )}

            {/* Google Pay Payment Form */}
            {showGooglePayForm && (
              <div
                style={{
                  marginTop: 20,
                  border: "1px solid #ccc",
                  borderRadius: 8,
                  padding: 16,
                }}
              >
                <h3>Google Pay</h3>
                <div style={{ display: "flex", marginBottom: 16 }}>
                  <GooglePayIcon />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <p>
                    You will be redirected to Google Pay to complete your
                    payment of Kshs. 100 for the month of May.
                  </p>
                </div>

                <Button
                  appearance="primary"
                  onClick={processGooglePayPayment}
                  style={{ backgroundColor: "#4285F4" }}
                >
                  Pay with Google Pay
                </Button>
              </div>
            )}
          </div>
        </Stack>

        {/* Payment History Section */}
        {paymentHistory.length > 0 && (
          <Stack style={{ marginTop: 20 }}>
            <h2>Payment History</h2>
            <div
              style={{ border: "1px solid #eee", borderRadius: 8, padding: 16 }}
            >
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #eee" }}>
                    <th style={{ textAlign: "left", padding: "8px" }}>Date</th>
                    <th style={{ textAlign: "left", padding: "8px" }}>
                      Amount
                    </th>
                    <th style={{ textAlign: "left", padding: "8px" }}>
                      Payment Method
                    </th>
                    <th style={{ textAlign: "left", padding: "8px" }}>
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paymentHistory.map((payment) => (
                    <tr
                      key={payment.id}
                      style={{ borderBottom: "1px solid #eee" }}
                    >
                      <td style={{ padding: "8px" }}>{payment.date}</td>
                      <td style={{ padding: "8px" }}>
                        {payment.amount} {payment.currency}
                      </td>
                      <td style={{ padding: "8px" }}>
                        {payment.paymentMethod === "visa" && <VisaIcon />}
                        {payment.paymentMethod === "mastercard" && (
                          <MastercardIcon />
                        )}
                        {payment.paymentMethod === "paypal" && <PayPalIcon />}
                        {payment.paymentMethod === "googlepay" && (
                          <GooglePayIcon />
                        )}
                        {payment.paymentMethod === "mpesa" && <MpesaIcon />}
                        {payment.paymentMethod === "airtel" && (
                          <AirtelIcon />
                        )}{" "}
                        {payment.paymentMethod.charAt(0).toUpperCase() +
                          payment.paymentMethod.slice(1)}
                        {payment.last4 && ` (**** ${payment.last4})`}
                      </td>
                      <td style={{ padding: "8px" }}>
                        <span
                          style={{
                            color:
                              payment.status === "succeeded" ? "green" : "red",
                            fontWeight: "bold",
                          }}
                        >
                          {payment.status.charAt(0).toUpperCase() +
                            payment.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Stack>
        )}
      </Stack>

      <ProcessingSpinner
        show={showSpinner}
        message={
          selectedPaymentOption === "mpesa" ||
          selectedPaymentOption === "airtel"
            ? "Keep an eye on your phone for the payment request"
            : selectedPaymentOption === "paypal"
            ? "Connecting to PayPal..."
            : selectedPaymentOption === "googlepay"
            ? "Connecting to Google Pay..."
            : "Processing your payment..."
        }
      />
    </div>
  );
};

export default BillingManager;
