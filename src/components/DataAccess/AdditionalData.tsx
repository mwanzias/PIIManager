import { TextField } from "@fluentui/react";
import React, { useState } from "react";

const AddProfileData = () => {
  const [idNumber, setIdNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("0");
  return (
    <div>
      <TextField
        label="ID Number"
        value={idNumber}
        onChange={(e, newValue) => setIdNumber(newValue || "")}
      />
      <TextField
        label="Phone Number"
        value={phoneNumber}
        onChange={(e, newValue) => setPhoneNumber(newValue || "")}
        required
      />
    </div>
  );
};

export default AddProfileData;
