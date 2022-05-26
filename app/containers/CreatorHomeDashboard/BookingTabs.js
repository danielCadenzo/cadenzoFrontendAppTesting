import React, { memo } from 'react';
import PropTypes from 'prop-types';
import MITabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function Tabs(props) {
  const { bookingRequest, upcomingShows, cancelledShows } = props;
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box
      maxHeight={'400px'}
      sx={{
        overflowY: 'scroll',
        width: '100%',
        boxShadow: '0px 4px 4px rgb(0 0 0 / 25%)',
        borderBottomLeftRadius: '20px',
        borderBottomRightRadius: '20px',
        borderTopLeftRadius: '20px',
        borderTopRightRadius: '20px',
        ['@media (max-width: 425px)']: {
          width: '95vw',
          marginLeft: 'auto',
          marginRight: 'auto',
          borderBottomLeftRadius: 'unset',
          borderBottomRightRadius: 'unset',
          borderTopLeftRadius: 'unset',
          borderTopRightRadius: 'unset',
        },
      }}
    >
      <Box
        sx={{
          top: 0,
          position: 'sticky',
          borderBottom: 1,
          borderColor: 'divider',
          backgroundColor: '#5926CC',
          color: 'white',
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
          ['@media (max-width: 425px)']: {
            borderTopLeftRadius: 'unset',
            borderTopRightRadius: 'unset',
          },
        }}
      >
        <MITabs value={value} onChange={handleChange} centered>
          <Tab label="Booking Request" />
          <Tab label="Upcoming Shows" />
          <Tab label="Cancelled Shows" />
        </MITabs>
      </Box>
      <TabPanel value={value} index={0}>
        {bookingRequest}
      </TabPanel>
      <TabPanel value={value} index={1}>
        {upcomingShows}
      </TabPanel>
      <TabPanel value={value} index={2}>
        {cancelledShows}
      </TabPanel>
    </Box>
  );
}

Tabs.propTypes = {
  bookingRequest: PropTypes.func.isRequired,
  upcomingShows: PropTypes.func.isRequired,
  cancelledShows: PropTypes.func,
};

export default memo(Tabs);
