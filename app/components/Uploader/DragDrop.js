import React, { Component } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  position: relative;
  //border: 2px solid grey;
  border-radius: 8px;
  background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='10' ry='10' stroke='%23333' stroke-width='3' stroke-dasharray='6%2c 14' stroke-dashoffset='0' stroke-linecap='butt'/%3e%3c/svg%3e")
  ${props =>
    (!!props.background &&
      `, url(${
        !props.shouldUseUrl ? `data:image/${props.imageType};base64,` : ''
      }${props.background});`) ||
    ';'}

  &:hover {
    background-color: #252424c9;
  }
`;

const ActiveDragDropContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: ${({ active }) => (active ? '#d6d6d6' : 'inherit')};
  text-align: center;
  place-content: center;
  justify-content: center;
  display: flex;
  justify-items: center;
  align-items: center;
`;
class DragAndDrop extends Component {
  state = {
    drag: false,
  };

  count = 0;

  dragCounter = 0;

  dropRef = React.createRef();

  handleDrag = e => {
    e.preventDefault();
    e.stopPropagation();
  };

  handleDragIn = e => {
    e.preventDefault();
    e.stopPropagation();
    this.dragCounter++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      this.setState({ drag: true });
    }
  };

  handleDragOut = e => {
    e.preventDefault();
    e.stopPropagation();
    this.dragCounter--;
    if (this.dragCounter > 0) return;
    this.setState({ drag: false });
  };

  handleDrop = e => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      this.props.handleDrop(e.dataTransfer.files);
      e.dataTransfer.clearData();
      this.setState({ drag: false });
    }
  };

  componentDidMount() {
    const div = this.dropRef.current;
    div.addEventListener('dragenter', this.handleDragIn);
    div.addEventListener('dragleave', this.handleDragOut);
    div.addEventListener('dragover', this.handleDrag);
    div.addEventListener('drop', this.handleDrop);
  }

  componentWillUnmount() {
    const div = this.dropRef.current;
    div.removeEventListener('dragenter', this.handleDragIn);
    div.removeEventListener('dragleave', this.handleDragOut);
    div.removeEventListener('dragover', this.handleDrag);
    div.removeEventListener('drop', this.handleDrop);
  }

  render() {
    return (
      <Wrapper ref={this.dropRef}>
        {this.state.drag && (
          <ActiveDragDropContainer active className="roboto">
            Drop your files here or &nbsp; <b>browse</b>
          </ActiveDragDropContainer>
        )}
        {this.props.children}
      </Wrapper>
    );
  }
}
export default DragAndDrop;
