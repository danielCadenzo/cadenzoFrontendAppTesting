import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import trashIcon from 'images/icons/trash.svg';
import { useField } from 'react-form';
import Select from 'components/AsyncSelect/Createable';
import TextField from 'components/Form/TextField';
import { uploadGenericFile } from 'data/api';
import styled from 'styled-components';

const InputSelect = styled(Select)`
  width: 100%;
  max-width: 250px;
`;

const DEFAULT_OPTIONS = Object.freeze([
  {
    label: 'EPK',
    value: 'EPK',
  },
  {
    label: 'Stage Plot',
    value: 'Stage Plot',
  },
  {
    label: 'Marketing Materials',
    value: 'Marketing Materials',
  },
  {
    label: 'Hospitality Rider',
    value: 'Hospitality Rider',
  },
  {
    label: 'Technical Rider',
    value: 'Technical Rider',
  },
]);

const Document = ({ document, onDeleteDocument, onEditDocument }) => (
  <div className="d-flex flex-column  py-2">
    <div className="d-flex flex-justify-between">
      <p>{document.name}</p>
      <div className="d-flex">
        <a className="color-primary" target="_blank" href={document.url}>
          <p className="mx-2">Link</p>
        </a>
        <p onClick={onEditDocument}>Edit</p>
        <button type="button" onClick={onDeleteDocument}>
          <img alt="delete" className="ml-3" src={trashIcon} />
        </button>
      </div>
    </div>
    <p className="color-gray">{document.description}</p>
  </div>
);

const AddDocumentInput = ({
  onDeleteDocument,
  index,
  id,
  doesAlreadyExist,
  document = {},
}) => {
  const defaultValue = useMemo(() => ({
    url: null,
    name: null,
    description: null,
    ...document,
  }));
  const {
    setFieldValue,
    setFieldMeta,
    setMeta,
    FieldScope,
    value,
    meta,
  } = useField(`documents.${id}`, {
    defaultValue,
    defaultMeta: useMemo(
      () => ({
        nameSelect: null,
        id,
        isUploading: false,
        isBeingEdited: !doesAlreadyExist,
      }),
      [],
    ),
  });

  const { isBeingEdited, isUploading } = meta;

  const onFileSelectHandler = e => {
    const file = e.target.files[0];
    uploadGenericFile(file, { variables: { filename: file.name } }).then(
      response => {
        if (response.uploadGenericFile.success) {
          setFieldValue(`url`, response.uploadGenericFile.imageUrl);
        }
        setMeta({ ...meta, isUploading: false });
      },
    );
    setMeta({ ...meta, isUploading: true });
  };

  const ref = React.createRef();

  if (!isBeingEdited)
    return (
      <FieldScope>
        <Document
          url={value.url}
          document={value}
          onDeleteDocument={onDeleteDocument}
          onEditDocument={() => setMeta({ ...meta, isBeingEdited: true })}
        />
      </FieldScope>
    );

  return (
    <FieldScope>
      <div className="d-flex flex-column  py-4">
        <div className="d-flex flex-justify-between full-width">
          <InputSelect
            onChange={nameOption => {
              if (nameOption) setFieldValue(`name`, nameOption.value);
              else setFieldValue(`name`, null);
            }}
            defaultOptions={DEFAULT_OPTIONS}
            options={DEFAULT_OPTIONS}
            className="full-width"
            placeholder="Enter/Select filename"
          />

          <div className="d-flex flex-items-center">
            <input
              onChange={onFileSelectHandler}
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              id="file"
              ref={ref}
              style={{ display: 'none' }}
            />
            {value.url && (
              <a className="color-primary" target="_blank" href={value.url}>
                <p className="mx-2">Link</p>
              </a>
            )}
            <Button onClick={() => ref.current.click()}>
              {isUploading ? '...Uploading' : 'Upload'}{' '}
            </Button>
            <p
              className="mx-2"
              onClick={() => setMeta({ ...meta, isBeingEdited: false })}
            >
              Done
            </p>
            <img
              onClick={onDeleteDocument}
              alt="delete document from show documents"
              className="ml-3"
              src={trashIcon}
            />
          </div>
        </div>
        <TextField
          name="description"
          placeholder="Enter your description of this document"
          style={{ resize: 'none', maxHeight: 100, minHeight: 58 }}
          className="color-gray p-1"
        />
      </div>
    </FieldScope>
  );
};

AddDocumentInput.propTypes = {
  id: PropTypes.string.isRequired,
  onDeleteDocument: PropTypes.func.isRequired,
};

export default AddDocumentInput;
