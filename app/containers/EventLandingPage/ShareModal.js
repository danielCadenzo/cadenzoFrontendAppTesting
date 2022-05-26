import React, { memo } from 'react';
import Modal from 'components/Modal';
import Button from 'components/Button';

function ShareModal(props) {
  return (
    <Modal {...props} header="Share This Event">
      <div>
        <ul>
          <li className="py-2 work-sans-black">
            Twitter:{' '}
            <a
              href="https://twitter.com/share?ref_src=twsrc%5Etfw"
              className="twitter-share-button"
              data-text={`Hey here&#39;s an event https://cadenzotickets.com`}
              data-show-count="false"
            >
              <Button>Tweet</Button>
            </a>
            <script
              async
              src="https://platform.twitter.com/widgets.js"
              charset="utf-8"
            />
          </li>
          <li className="py-2 work-sans-black">
            Email:{' '}
            <a
              href="https://twitter.com/share?ref_src=twsrc%5Etfw"
              className="twitter-share-button"
              data-text={`Hey here&#39;s an event https://cadenzotickets.com`}
              data-show-count="false"
            >
              <Button>Email</Button>
            </a>
            <script
              async
              src="https://platform.twitter.com/widgets.js"
              charset="utf-8"
            />
          </li>
        </ul>
      </div>
    </Modal>
  );
}

export default memo(ShareModal);
