import React, { useState } from 'react';
import Modal from 'components/Modal';
import H4 from 'components/H4';
import Button from 'components/Button';
import UIAvatar from 'components/UIAvatar';
import CreateableSelect from 'components/AsyncSelect/Createable';
import { createGQLQuery } from 'data/api';
import { isValidEmail } from 'utils/validation';

const USER_SEARCH_QUERY = `
query($email:String){
  users(email_Icontains: $email, first: 5) {
    edges {
      node {
        id
        name
        email
        avatar
      }
    }
  }
}`;

function AdminManagePanel({
  isOpen,
  onConfirm,
  onClose,
  existingAdmins = [],
  onAdminUpdate,
}) {
  const [admins, onUpdateNewAdmins] = useState(
    existingAdmins.map(({ email, avatar }) => ({
      avatar,
      email,
    })),
  );

  const onLoadOptions = e =>
    createGQLQuery(USER_SEARCH_QUERY, { email: e }).then(data => {
      const values = data.users.edges.map(node => ({
        label: node.node.email,
        value: node.node.email,
      }));
      return values;
    });

  const onSelectAdmin = userOption => {
    if (userOption && isValidEmail(userOption.value)) {
      const user = admins.find(admin => admin.email === userOption.value);
      if (!user) {
        onUpdateNewAdmins([
          ...admins,
          { email: userOption.value, avatar: null },
        ]);
      }
    }
  };

  const onRemoveAdmin = index => {
    const newAdmins = [...admins];
    newAdmins.splice(index, 1);
    onUpdateNewAdmins([...newAdmins]);
  };

  const handleSubmit = () => {
    onConfirm(admins.map(({ email }) => email));
  };

  const isDisabled = admins.length === 0;

  return (
    <Modal isOpen={isOpen} header="Manage Admins" onClose={onClose}>
      <div className="p-5">
        <H4 className="my-3">Manage Admins</H4>
        <CreateableSelect onChange={onSelectAdmin} />
        <ul className="mt-2">
          {admins.map((user, index) => (
            <li className="pt-1">
              {index > 0 && <hr />}
              <span className="d-flex flex-items-center flex-justify-between">
                <div className="d-flex flex-items-center">
                  <UIAvatar profileUrl={user.avatar} />
                  <p>{user.email}</p>
                </div>
                <Button onClick={() => onRemoveAdmin(index)} inverted>
                  Remove
                </Button>
              </span>
            </li>
          ))}
        </ul>
        <div className="d-flex py-4 flex-justify-end">
          <Button className="mr-2" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={isDisabled}
            inverted={isDisabled}
            onClick={handleSubmit}
          >
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default AdminManagePanel;
