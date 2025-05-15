import { Spinner, Stack } from "@fluentui/react";
import { Card, CardHeader } from "@fluentui/react-card";
import { RadioGroup, Radio } from "@fluentui/react-radio";
import React, { useEffect, useState } from "react";
import { MpesaIcon } from "../../svgIcons/paymentIcon";
import { Button } from "@fluentui/react-button";
import ProcessingSpinner from "../Marketing/Spinner";

// this will be the component that will manage the billing of the user
// we need to integrate to stripe and manage the billing of the user

const BillingManager: React.FC = () => {
  const [selectedPaymentOption, setSelectedPaymentOption] =
    useState<string>("");
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    // this will be the component that will manage the billing of the user
    // we need to integrate to stripe and manage the billing of the user
    console.log("Selected Payment Option: ", selectedPaymentOption);
  }, [selectedPaymentOption]);

  const callStkPush = async () => {
    setShowSpinner(true);
    setTimeout(() => setShowSpinner(false), 10000); // change thi to be set when the stkpush returns
    // this will be the component that will manage the billing of the user
    console.log("Processing payment...");
  };

  // this will be the component that will manage the billing of the user
  // we need to integrate to stripe and manage the billing of the user
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
          {/* Card 1 */}
          <Card style={{ width: 250 }}>
            <CardHeader header={<b>Select Mobile Payment</b>} />

            <RadioGroup
              layout="vertical"
              value={selectedPaymentOption}
              onChange={(e, data) => setSelectedPaymentOption(data.value)}
            >
              <Radio
                value="mpesa"
                checked={true}
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
                    <img
                      src="/icons/airtel.png"
                      alt="Airtel Money"
                      width={20}
                      height={20}
                    />
                    <span>Airtel Money</span>
                  </Stack>
                }
              />
            </RadioGroup>
          </Card>

          {/* Card 2 */}
          <Card style={{ width: 250 }}>
            <CardHeader header={<b>Select Bank Payment</b>} />

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
                    <img
                      src="/icons/visa.png"
                      alt="Visa"
                      width={20}
                      height={20}
                    />
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
                    <img
                      src="/icons/mastercard.png"
                      alt="MasterCard"
                      width={20}
                      height={20}
                    />
                    <span>MasterCard</span>
                  </Stack>
                }
              />
            </RadioGroup>
          </Card>
        </Stack>
        <Stack
          horizontal
          tokens={{ childrenGap: 20 }}
          style={{ marginTop: 20 }}
        >
          <div>
            <h2>Payment Instructions</h2>
            <p>
              Selected Payment Option:{" "}
              {selectedPaymentOption ? selectedPaymentOption : "None"}
            </p>
            {selectedPaymentOption == "mpesa" && (
              <div>
                <p>
                  Click{" "}
                  <Button
                    appearance={"subtle"}
                    icon={<MpesaIcon />}
                    onClick={callStkPush}
                    style={{ color: "red" }}
                  >
                    Send Request
                  </Button>{" "}
                  to the registered phone number for M-Pesa for Kshs. 100 for
                  the month of May
                </p>
              </div>
            )}
            {selectedPaymentOption == "airtel" && (
              <div>
                <p>
                  Click{" "}
                  <Button
                    appearance={"subtle"}
                    icon={<img src="/icons/airtel.png" />}
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
          </div>
        </Stack>
      </Stack>
      <ProcessingSpinner
        show={showSpinner}
        message="Keep an eye on your phone for the M-Pesa request"
      />
    </div>
  );
};

export default BillingManager;
