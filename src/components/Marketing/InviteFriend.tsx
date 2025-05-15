import { Button } from "@fluentui/react-button";
import { InviteAFriendProps } from "../../Interfaces/PseudoInterfaces";
import { Stack } from "@fluentui/react";

const InviteAFriend: React.FC<InviteAFriendProps> = ({
  userNameInviting,
  userPhoneInviting,
  userEmailInviting,
}) => {
  const processInvite = () => {};
  return (
    <div>
      <h1>Invite a Friend</h1>
      <p>This is used to invite a friend to Register with the system</p>
      <div>
        <Stack horizontal={false} tokens={{ childrenGap: 8 }}>
          <Stack
            horizontal={false}
            tokens={{ childrenGap: 8 }}
            style={{ maxWidth: 400 }}
          >
            <Stack horizontal tokens={{ childrenGap: 10 }}>
              <label htmlFor="friendName">Friend's Name</label>
              <input type="text" placeholder="Friend's Name" />
            </Stack>
            <Stack horizontal tokens={{ childrenGap: 10 }}>
              <label htmlFor="friendEmail">Friend's Email</label>
              <input type="text" placeholder="Friend's Email" />
            </Stack>
            <Stack horizontal tokens={{ childrenGap: 10 }}>
              <label htmlFor="friendPhone">Friend's Phone</label>
              <input type="text" placeholder="Friend's Phone" />
            </Stack>
            <Stack horizontal tokens={{ childrenGap: 10 }}>
              <input
                type="text"
                value={userNameInviting}
                hidden
                name="inviterName"
              />
            </Stack>
            <Stack horizontal tokens={{ childrenGap: 10 }}>
              <input
                type="text"
                value={userPhoneInviting}
                hidden
                name="inviterphone"
              />
            </Stack>
            <Stack horizontal tokens={{ childrenGap: 10 }}>
              <input
                type="text"
                value={userEmailInviting}
                hidden
                name="inviterphone"
              />
            </Stack>

            <Stack horizontal tokens={{ childrenGap: 10 }}>
              <label htmlFor="inviterMessage">Your Message</label>
              <textarea
                placeholder="Your Message"
                style={{ width: "100%", height: 100 }}
              />
            </Stack>
          </Stack>
          <Stack horizontal tokens={{ childrenGap: 8 }}>
            <Button
              appearance="primary"
              shape="circular"
              style={{
                borderRadius: "9999px",
                padding: "6px 12px",
              }}
              onClick={processInvite}
            >
              Send Invite
            </Button>
            <Button
              appearance="secondary"
              shape="circular"
              style={{
                borderRadius: "9999px",
                padding: "6px 12px",
              }}
              onClick={() => {
                console.log("Cancel Invite");
              }}
            >
              Cancel
            </Button>
          </Stack>
        </Stack>
      </div>
    </div>
  );
};

export default InviteAFriend;
// This component is a placeholder for the InviteAFriend functionality.
