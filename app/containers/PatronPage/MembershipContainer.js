import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { compose } from 'redux';

import Table from 'components/Table';
import { createGQLQuery } from 'data/api';
import Button from 'components/Button';
import editIcon from 'images/icons/edit.svg';
import trashIcon from '../../images/icons/trash.svg';

import SideNav from '../../components/SideNav';
import FilterList from '../../components/FilterList';
import { fetchUsersAction, fetchMembershipsAction } from './actions';
import CEMembershipModal from './CreateMembershipModal';

export default function MembershipContainer() {
  const [isModalVisible, setModalVisible] = useState(false);

  return (
    <div>
      <UserListWrapper style={{ maxWidth: 900 }} className="m-2 p-2">
        <div className="d-flex flex-items-center">
          <h3 className="mb-1" style={{ fontWeight: 700 }}>
            Manage Memberships/Season Passes
          </h3>
          <Button
            onClick={() =>
              this.setState({
                showMembershipModal: true,
                membership: null,
              })
            }
            type="button"
          >
            Create
          </Button>
        </div>
        <Table
          data={this.props.memberships || []}
          columns={this.getMembershipTableColumns()}
          actionButtons={[
            props => (
              <IconButton
                className="pl-2"
                icon={editIcon}
                onClick={e => onSelectMembership(props)}
                {...props}
              />
            ),
            props => (
              <IconButton
                className="mx-2"
                icon={trashIcon}
                onClick={e => console.log(props)}
                {...props}
              />
            ),
          ]}
        />
      </UserListWrapper>
      <div className="d-flex">
        {isModalVisible && (
          <CEMembershipModal
            onSave={this.onUpdateMembership}
            isOpen={this.state.showMembershipModal}
            onClose={this.handleCloseMembershipModal}
            membership={this.state.membership}
          />
        )}
      </div>
    </div>
  );
}
