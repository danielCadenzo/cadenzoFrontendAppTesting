import React, { useState } from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Grid from '@material-ui/core/Grid';
import { FormLabel } from '@material-ui/core';

function CardListItem(props) {
  const { cardType, last4, expirationDate, onRemove, paymentId } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRemove = () => {
    onRemove(paymentId);
  };

  return (
    <Grid className="my-2" container justify="space-between">
      <Grid direction="column">
        <Grid zeroMinWidth>
          <FormLabel>{cardType}</FormLabel>
          <FormLabel> •••• {last4}</FormLabel>
        </Grid>
        <Grid>
          <FormLabel>Expiration Date: </FormLabel>
          <FormLabel>{expirationDate}</FormLabel>
        </Grid>
      </Grid>
      <div>
        <IconButton
          aria-label="more"
          aria-controls="long-menu"
          aria-haspopup="true"
          onClick={handleClick}
        >
          <MoreVertIcon />
        </IconButton>

        <Menu
          id="long-menu"
          anchorEl={anchorEl}
          keepMounted
          open={open}
          onClose={handleClose}
        >
          <MenuItem onClick={handleRemove}>Remove</MenuItem>
        </Menu>
      </div>
    </Grid>
  );
}

CardListItem.propTypes = {
  cardType: PropTypes.string.isRequired,
  last4: PropTypes.string.isRequired,
  expirationDate: PropTypes.string.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default CardListItem;
