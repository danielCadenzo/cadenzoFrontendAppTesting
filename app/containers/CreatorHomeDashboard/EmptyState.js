'use es6';

import React, { useCallback } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import * as AuthSelectors from 'data/selectors/authSelectors';
import { redirectToUrl } from 'utils/helpers';
import { createStructuredSelector } from 'reselect';
import Routes from 'data/Routes';
import { setActiveProfile } from 'data/actions/AuthActions';
import PropTypes from 'prop-types';
import { ProfileCard, AddProfileCard } from './ProfileCard';

const onAddProfileHandler = () => redirectToUrl(Routes.profileOnboarding());

function EmptyState({ profiles, setActiveUser }) {
  const onAccountSelect = useCallback(profileId => {
    if (!profileId) return;
    localStorage.setItem('activeProfileId', profileId);
    setActiveUser(profileId);
  });
  return (
    <div className="d-flex flex-wrap full-width flex-justify-center p-2">
      <AddProfileCard onClick={onAddProfileHandler} />
      {profiles.map(profile => (
        <ProfileCard onClick={onAccountSelect} profile={profile} />
      ))}
    </div>
  );
}

EmptyState.propTypes = {
  profiles: PropTypes.array.isRequired,
  setActiveUser: PropTypes.func.isRequired,
};

const stateToProps = createStructuredSelector({
  profiles: AuthSelectors.getAllProfiles,
});

const mapDispatchToProps = {
  setActiveUser: setActiveProfile,
};

const withConnect = connect(
  stateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(EmptyState);
