'use es6';

import React, { useState } from 'react';
import { DataGrid, GridToolbar, NoRowsOverlay } from '@material-ui/data-grid';
import Button from 'components/Button';
import PersonIcon from '@material-ui/icons/Person';

function AttendeeTable({ data, onCheckIn }) {
  const [COLUMNS] = useState([
    {
      field: 'cover_img',
      width: 48,
      headerName: ' ',
      headerClassName: 'visibility-invisible',
      headerAlign: 'center',
      renderCell: () => <PersonIcon />,
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
      renderCell: row => {
        const { email } = row.data;
        return <p>{email}</p>;
      },
    },
    {
      field: 'id',
      headerName: 'Check-In',
      flex: 0.5,
      renderCell: row => (
        <Button
          onClick={() => onCheckIn(row.data.id)}
          inverted
          className="px-2"
        >
          Check In
        </Button>
      ),
    },
  ]);

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <div style={{ flexGrow: 1 }}>
        <DataGrid
          filterModel={{
            items: [
              {
                columnField: 'email',
                value: '',
                operatorValue: 'contains',
              },
            ],
          }}
          rows={data}
          disableSelectionOnClick
          columns={COLUMNS}
          pageSize={10}
          components={{
            Toolbar: GridToolbar,
            NoRowsOverlay: <div>No Users</div>,
          }}
        />
      </div>
    </div>
  );
}

export default AttendeeTable;
