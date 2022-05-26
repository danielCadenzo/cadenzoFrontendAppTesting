import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import UIAvatar from 'components/UIAvatar';

const Wrapper = styled.button`
  width: 175px;
  border-radius: 8px;
  border: 2px solid gray;
  height: 200px;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  display: flex;
  margin: 4px;
  flex-direction: column;
`;

export function AddProfileCard({ onClick }) {
  return (
    <Wrapper onClick={onClick}>
      <b className="color-primary f3">+</b>
      <p> Add Profile </p>
    </Wrapper>
  );
}

AddProfileCard.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export function ProfileCard({ profile, onClick }) {
  return (
    <Wrapper onClick={() => onClick(profile.id)}>
      <UIAvatar
        avatarUrl={profile.avatar}
        profileName={profile.name}
        profileInfo={profile}
      />
      <p>{profile.name}</p>
    </Wrapper>
  );
}

ProfileCard.propTypes = {
  onClick: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
};
