import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Popover from '@material-ui/core/Popover';

function FilterFormToggable({ children, id, LabelComponent }) {
  const [isVerifiedRef, setIsVerifiedRef] = useState(null);
  const handleClick = event => {
    setIsVerifiedRef(event.currentTarget);
  };

  const handleClose = () => {
    setIsVerifiedRef(null);
  };

  return (
    <div>
      <LabelComponent onClick={handleClick} />
      <Popover
        id={id}
        open={!!isVerifiedRef}
        anchorEl={isVerifiedRef}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <div className="p-4">{children}</div>
      </Popover>
    </div>
  );
}

FilterFormToggable.propTypes = {
  LabelComponent: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  id: PropTypes.string.isRequired,
};

export default FilterFormToggable;
