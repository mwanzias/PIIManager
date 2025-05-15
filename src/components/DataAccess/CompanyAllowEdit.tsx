import { PrimaryButton } from "@fluentui/react";
import { on } from "events";
import React from "react";

type CompanyAllowEditProps = {
  companyname: string;
  sectorname: string;
  allowed: string[];
  onSave: () => void;
};
const CompanyAllowEdit: React.FC<CompanyAllowEditProps> = ({
  companyname,
  sectorname,
  allowed,
  onSave,
}) => {
  return (
    <div>
      <h1>Company Allow Edit</h1>
      <p>This is the Company Allow Edit component.</p>
      <p>Company Name: {companyname}</p>
      <p>Sector Name: {sectorname}</p>
      <p>Allowed Data Access: {allowed}</p>
      <div>
        <PrimaryButton text="Save" onClick={onSave}>
          Save
        </PrimaryButton>
        <PrimaryButton text="Cancel" onClick={onSave}>
          Save
        </PrimaryButton>
      </div>
    </div>
  );
};

export default CompanyAllowEdit;
