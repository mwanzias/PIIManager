export interface LoginProps {
  toggleForm: () => void; // Accept toggleForm as a prop
}

export interface InviteAFriendProps {
  userEmailInviting?: string; // The email of the user inviting
  userPhoneInviting?: string; // The phone number of the user inviting
  userNameInviting?: string; // The name of the user inviting
  userPhoneInvited?: BigInteger; // The phone number of the user being invited
}

export interface allowedCompaniesProps {
  emailAddress?: number; // The ID of the company
  phoneNumber?: string; // The name of the company
}

export interface accountManagementProps {
  idnumber?: string; // The ID of the account
  emailAddress: string; // The email address of the account
  phoneNumber: number; // The phone number of the account
}
