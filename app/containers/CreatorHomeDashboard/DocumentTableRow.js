import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { fromServerTime } from 'utils/dates';
import { DateTime } from 'luxon';
import useDynamicRefs from 'utils/hooks/useDynamicRefs';
import Modal from 'components/Modal';

import messages from './messages';

export function DocumentTableRow({ booking }) {
  const [getRef, setRef] = useDynamicRefs();
  const [showModal, setShowModal] = useState(false);
  const profile = booking.performer;

  const profileDocuments = profile.documents;

  return (
    <div className="d-flex width-full border-bottom py-3 work-sans">
      <div className="d-table-cell col-2">
        {fromServerTime(booking.startDate).toLocaleString(DateTime.DATE_SHORT)}
      </div>
      <div className="d-table-cell col-5">{profile.name}</div>
      <div className="d-table-cell col-3">
        {profileDocuments.length} available
      </div>
      <div className="d-table-cell col-1 color-primary">
        <button
          onClick={() => setShowModal(true)}
          className="color-primary no-wrap"
          type="button"
        >
          <FormattedMessage {...messages.view} />
        </button>
      </div>

      <Modal
        header="Show Documents"
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      >
        <div className="d-flex flex-column p-2 color-primary text-underline">
          {profileDocuments.map((doc, idx) => (
            <a
              className="f3 py-3"
              alt={doc.name}
              target="_blank"
              rel="noopener noreferrer"
              ref={setRef(idx.toString())}
              href={doc.url}
              download={doc.name}
            >
              {doc.name}
            </a>
          ))}
        </div>
      </Modal>
    </div>
  );
}

DocumentTableRow.propTypes = {
  documents: PropTypes.object,
};

export default DocumentTableRow;
