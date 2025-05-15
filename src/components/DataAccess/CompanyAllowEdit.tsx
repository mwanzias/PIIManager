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
  const itemmap = {
    idnumber: "ID Number",
    "email address": "Email Address",
    "phone number": "Phone Number",
  };
  const itemsWithEdit = Object.keys(itemmap) as Array<keyof typeof itemmap>;
  const itemsChanged = () => {
    console.log("Items changed");
  };
  return (
    <div>
      <h1>Company Allow Edit</h1>
      <p>This is the Company Allow Edit component.</p>
      <p>Company Name: {companyname}</p>
      <p>Sector Name: {sectorname}</p>
      {allowed}
      {itemsWithEdit.map((item) => {
        const checkedValue = allowed.indexOf(item.toString()) > -1;
        return (
          <div key={item}>
            <label>
              <input
                type="checkbox"
                checked={checkedValue}
                onChange={itemsChanged}
              />
              {itemmap[item]}:
            </label>
          </div>
        );
      })}
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
