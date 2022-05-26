import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Checkbox from '@material-ui/core/Checkbox';
import Slider from '@material-ui/core/Slider';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import { cadenzoPrimary } from 'utils/CssVariables';
import Button from 'components/Button';
import { createStructuredSelector } from 'reselect';
import {
  getSelectedMapNodeId,
  getSelectedMapNode,
  getSelectedMapNodeFields,
  getEditorBufferTimestamp,
} from 'data/selectors/venueDesignerSelectors';
import * as VenueDesignerActions from 'redux/actions/VenueDesignerActions';
import MenuItem from '@material-ui/core/MenuItem';
import * as FieldTypes from './FieldTypes';
import * as IconSelections from './Icons';

const StyledTextField = styled(TextField)`
  width: 80px;
`;
// / Field Types - Select, Slider, Boolean, Number, Icon Select, Text
// / { renderProps }
// / Make Schema Validator

// / FIELD_SCHEMA = { label, type, value, componentOptions={} }

/**
 *
 * Structure of Node
 * Compromised of a Group - A Background, Label, Image
 * Fields - which are either LAYOUT or LABEL rules
 * The EditForm renders these fields and rules and passes back the update rulesets to the MapSidebar Controller
 */

const IconOption = styled.button`
  border: 1px solid ${cadenzoPrimary};
  background-color: ${({ isSelected = false }) =>
    isSelected ? `${cadenzoPrimary}` : `white`};
  color: ${({ isSelected = false }) =>
    isSelected ? `white` : `${cadenzoPrimary}`};
  height: 50px;
  width: 50px;
  margin: 0 4px;
`;

class EditForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      forceRerender: false,
    };
  }

  forceRerender = () => {
    const { forceRerender } = this.state;
    this.setState({ forceRerender: !forceRerender });
  };

  renderIconSelect = (field, onChange) => {
    const { value, componentOptions, label } = field;
    const { options, ...rest } = componentOptions;

    return (
      <div className="d-flex">
        {options.map(option => {
          const isSelected = value === option;
          return (
            <IconOption
              onClick={e => {
                e.target.value = option;
                onChange(e);
                this.forceRerender();
              }}
              name={label}
              isSelected={isSelected}
              value={option}
              {...rest}
            >
              {IconSelections[option]()}
            </IconOption>
          );
        })}
      </div>
    );
  };

  renderField = (field, fieldIndex) => {
    const { label, type, value, componentOptions } = field;
    const { updateNodeField, selectedNodeId } = this.props;
    const onFieldChange = (event, secondaryValue = null) => {
      let {
        target: { value: eventVal },
      } = event;
      if (type === FieldTypes.BOOLEAN_FIELD) eventVal = eventVal === 'true';
      if (type === FieldTypes.NUMBER_FIELD) eventVal = parseInt(eventVal, 10);
      if (type === FieldTypes.SLIDER_FIELD) eventVal = secondaryValue;
      updateNodeField(selectedNodeId, fieldIndex, eventVal);
      this.forceRerender();
    };
    let FieldComponent;
    switch (type) {
      case FieldTypes.BOOLEAN_FIELD: {
        const isChecked = typeof value === 'string' ? value === 'true' : value;
        FieldComponent = (
          <Checkbox
            defaultChecked={isChecked}
            checked={isChecked}
            hey={label}
            onChange={e => {
              e.target.value = e.target.checked || e.target.checked === 'true';
              onFieldChange(e);
            }}
            {...componentOptions}
          />
        );
        break;
      }
      case FieldTypes.SLIDER_FIELD: {
        FieldComponent = (
          <Slider
            min={0}
            max={100}
            key={label}
            value={value}
            data-test-id={`field-${label}`}
            onChange={onFieldChange}
            {...componentOptions}
          />
        );
        break;
      }
      case FieldTypes.SELECT_FIELD: {
        FieldComponent = (
          <Select
            defaultValue={value}
            key={label}
            onChange={onFieldChange}
            {...componentOptions}
            data-test-id={`field-${label}`}
          >
            {componentOptions.options.map(option => (
              <MenuItem value={option.value}>{option.label}</MenuItem>
            ))}
          </Select>
        );
        break;
      }
      case FieldTypes.NUMBER_FIELD: {
        FieldComponent = (
          <StyledTextField
            type="number"
            onChange={onFieldChange}
            value={value}
            key={label}
            InputLabelProps={{
              shrink: false,
            }}
            {...componentOptions}
          />
        );
        break;
      }
      case FieldTypes.TEXT_FIELD: {
        FieldComponent = (
          <StyledTextField
            type="text"
            size="small"
            onChange={onFieldChange}
            key={label}
            value={value}
            data-test-id={`field-${label}`}
            InputLabelProps={{
              shrink: true,
            }}
          />
        );
        break;
      }
      case FieldTypes.ICON_SELECT_FIELD: {
        FieldComponent = this.renderIconSelect(field, onFieldChange);
        break;
      }
      default:
        FieldComponent = null;
    }
    return (
      <div className="d-flex flex-justify-between flex-items-center my-1">
        <div className="flex-shrink-0 mr-2">{label}</div>
        {FieldComponent}
      </div>
    );
  };

  renderFormFields = () => {
    const { selectedNodeFields: fields } = this.props;

    return fields.map((field, idx) => this.renderField(field, idx));
  };

  render() {
    const {
      selectedNodeId,
      removeVenueItem,
      selectedNode,
      cloneVenueItem,
    } = this.props;
    const isNodeSelected = !!selectedNodeId && selectedNode;
    if (!isNodeSelected) return null;
    return (
      <React.Fragment>
        <Paper className="p-3 mt-3 mx-1" elevation={3}>
          {this.renderFormFields()}
        </Paper>
        <div className="d-flex flex-wrap flex-justify-center">
          <Button
            onClick={() => {
              cloneVenueItem(selectedNode);
            }}
            className="flex-self-center"
          >
            Clone
          </Button>

          <Button
            onClick={() => {
              removeVenueItem(selectedNodeId);
            }}
            className="flex-self-center"
            inverted
            style={{ color: 'red' }}
          >
            Delete Map Object
          </Button>
        </div>
      </React.Fragment>
    );
  }
}

EditForm.propTypes = {
  cloneVenueItem: PropTypes.func.isRequired,
  selectedNode: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  removeVenueItem: PropTypes.func.isRequired,
  selectedNodeId: PropTypes.string,
  selectedNodeFields: PropTypes.array,
  updateNodeField: PropTypes.func.isRequired,
};

EditForm.defaultProps = {};

const mapDispatchToProps = {
  updateNodeField: VenueDesignerActions.updateSelectedNodeField,
  removeVenueItem: VenueDesignerActions.removeVenueItem,
  cloneVenueItem: VenueDesignerActions.cloneVenueItem,
};

const mapStateToProps = createStructuredSelector({
  selectedNodeId: getSelectedMapNodeId(),
  selectedNode: getSelectedMapNode(),
  selectedNodeFields: getSelectedMapNodeFields(),
  editTimeStamp: getEditorBufferTimestamp(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(EditForm);
