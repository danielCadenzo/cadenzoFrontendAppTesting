import React, { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import Modal from 'components/Modal';
import { graphql, useMutation } from 'react-relay';
import { useForm } from 'react-form';
import { createUUID } from 'utils/helpers';
import DocumentModalInput from './DocumentModalInput';

const DocumentModalMutation = graphql`
  mutation DocumentModalMutation($id: ID!, $documents: [DocumentInputNode]!) {
    modifyProfileDocuments(id: $id, documents: $documents) {
      success
    }
  }
`;

function DocumentModal({ profile }) {
  const [showModal, setShowModal] = useState(false);
  const profileDocuments = useMemo(() => {
    if (!profile || !profile.documents) return {};
    return profile.documents.reduce(
      (acc, curr) => ({
        ...acc,
        [createUUID()]: {
          ...curr,
        },
      }),
      {},
    );
  }, [profile]);

  const defaultValues = useMemo(
    () => ({
      documents: profileDocuments,
    }),
    [],
  );

  const { documents = [] } = profile;
  const { Form, values, setFieldValue, setFieldMeta, setValues } = useForm({
    defaultValues,
  });
  const [documentMutation, isInFlight] = useMutation(DocumentModalMutation);

  const onCloseModal = useCallback(() => {
    setShowModal(false);
  }, [documents, showModal]);

  const onOpenModal = useCallback(() => setShowModal(true), [showModal]);

  const onAddDocument = () => {
    const docId = createUUID();
    setFieldValue(`documents.${docId}`, {}, { id: docId, isBeingEdited: true });
    setFieldMeta(`documents.${docId}`, { id: docId, isBeingEdited: true });
  };

  const onDeleteDocument = id => {
    const shallowCopy = { ...values.documents };
    delete shallowCopy[id];
    setValues({ documents: { ...shallowCopy } });
  };

  const onSaveDocuments = () => {
    documentMutation({
      variables: {
        id: profile.id,
        documents: Object.values(values.documents),
      },
      onCompleted: () => {
        onCloseModal();
      },
    });
  };

  return (
    <div>
      <Button onClick={onOpenModal}>Manage Documents</Button>

      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={onCloseModal}
          header="Upload Show Docs"
          wrapperClassName="pb-5"
        >
          <Form className="p-5">
            <div className="d-flex flex-column">
              {Object.keys(values.documents).map(documentId => {
                const value = values.documents[documentId];
                return (
                  <DocumentModalInput
                    onDeleteDocument={() => onDeleteDocument(documentId)}
                    document={value}
                    doesAlreadyExist={value.url}
                    id={documentId}
                    key={value.id}
                  />
                );
              })}
              <div>
                <Button onClick={onAddDocument} type="button" inverted>
                  {' '}
                  Add Document{' '}
                </Button>

                <Button onClick={onSaveDocuments} type="button" inverted>
                  {' '}
                  Save Changes
                </Button>
              </div>
            </div>
          </Form>
        </Modal>
      )}
    </div>
  );
}

DocumentModal.propTypes = {
  profile: PropTypes.object,
};

export default DocumentModal;
