import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { uploadGenericImage } from 'data/clients/eventClient';
import { createUUID } from 'containers/VenueDesigner/utils';
import styled from 'styled-components';
import CircularProgress from '@material-ui/core/CircularProgress';
import { cadenzoPrimary } from 'utils/CssVariables';
import DragAndDrop from './DragDrop';
import UIIcon from '../UIIcon';

const Image = styled.img`
  width: 175px;
  height: 90px;
  object-fit: cover;
  border: 1px solid grey;
  margin: 8px;
  border-radius: 4px;
  margin: 8px;
`;

const ImageWrapper = styled.div`
  position: relative;
`;

const DeleteImage = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  background-color: ${cadenzoPrimary};
  border-radius: 100%;
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  z-index: 2;
`;

const UploadWrapper = styled.div`
  min-height: 300px;
  display: flex;
  flex-align-items: center;
  flex-justify-content: center;
  position: relative;
  flex-wrap: wrap;
  width: 100%;
  padding: 16px;
`;

const BoxInitial = styled.div`
  display: block;
  padding-top: 17%;
  padding-left: 47%;
`;

const UPLOAD_STATES = Object.freeze({
  UNITIZIALIZED: 'UNITIZIALIZED',
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
});

class FileList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
    };
    this.inputRef = React.createRef();
  }

  componentDidMount() {
    const { files } = this.state;
    const { fileUrls } = this.props;
    this.setState({
      files: [
        ...fileUrls.map(url => ({
          id: createUUID(),
          url,
        })),
        ...files,
      ],
    });
  }

  handleDrop = files => {
    const fileList = this.state.files;
    for (let i = 0; i < files.length; i++) {
      if (!files[i].name) return;
      fileList.push({
        id: createUUID(),
        name: files[i].name,
        file: files[i],
        status: UPLOAD_STATES.UNITIZIALIZED,
      });
    }
    this.setState({
      files: fileList,
    });
    fileList.forEach((fp, idx) => {
      if (!fp.url) {
        this.uploadImage(fp, idx);
      }
    });
  };

  onDeleteFile = fileUrl => {
    const { onUpdate } = this.props;
    const fileList = [...this.state.files];
    const index = fileList.findIndex(fp => fp.url === fileUrl);
    if (index > -1) {
      fileList.splice(index, 1);
      this.setState({ files: fileList });
      onUpdate(fileList);
    }
  };

  uploadImage = (file, idx) => {
    const { onUpdate } = this.props;
    const reader = new FileReader();
    reader.onload = () => {
      const base64Image = btoa(reader.result);
      // const imgType = file.file.type.replace('image/', '');

      uploadGenericImage(base64Image, `${file.name}`).then(data => {
        const { uploadImage } = data;
        if (uploadImage && uploadImage.success) {
          const fileList = this.state.files;
          const newFile = {
            ...this.state.files[idx],
            url: uploadImage.imageUrl,
            status: UPLOAD_STATES.SUCCESS,
          };
          fileList[idx] = newFile;
          this.setState({
            files: fileList,
          });
          onUpdate(fileList);
        }
      });
    };
    reader.readAsBinaryString(file.file);
  };

  uploadFromClick = evt => {
    const fileList = this.state.files;
    for (let i = 0; i < evt.target.files.length; i++) {
      if (!evt.target.files[i].name) return;
      fileList.push({
        id: createUUID(),
        name: evt.target.files[i].name,
        file: evt.target.files[i],
        status: UPLOAD_STATES.UNITIZIALIZED,
      });
    }
    this.setState({
      files: fileList,
    });
    fileList.forEach((fp, idx) => {
      if (!fp.url) {
        this.uploadImage(fp, idx);
      }
    });
  };

  renderFileImage(file) {
    if (file.url) {
      return (
        <ImageWrapper>
          <Image src={file.url} />
          <DeleteImage
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              this.onDeleteFile(file.url);
            }}
          >
            <UIIcon name="Close" />
          </DeleteImage>
        </ImageWrapper>
      );
    }
    return <CircularProgress />;
  }

  render() {
    return (
      <DragAndDrop handleDrop={this.handleDrop}>
        <UploadWrapper onClick={() => this.inputRef.current.click()}>
          {this.state.files.length ? null : (
            <BoxInitial>
              {' '}
              <UIIcon name="AddPhoto" />
            </BoxInitial>
          )}
        <input
          onChange={this.uploadFromClick}
          type="file"
          accept=".jpg,.jpeg,.png"
          id="file"
          multiple
          ref={this.inputRef}
          style={{ display: 'none' }}
        />
          {this.state.files.map((file, i) => (
            <Fragment>{this.renderFileImage(file)}</Fragment>
          ))}
        </UploadWrapper>
      </DragAndDrop>
    );
  }
}

FileList.propTypes = {
  onUpdate: PropTypes.func,
  fileUrls: PropTypes.array,
};
export default FileList;
