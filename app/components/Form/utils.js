import * as FormFieldTypes from 'constants/FormFieldTypes';
import InputField from './InputField';
import LocationField from './LocationField';
import TextField from './TextField';
import SelectField from './SelectField';
import RadioGroup from './RadioGroup';
import DateTimeField from './DateTimeField';
import Checkbox from './Checkbox';
import StarField from './StarField';

export function componentFromType(fieldType) {
  switch (fieldType) {
    case FormFieldTypes.INPUT:
    case FormFieldTypes.NUMBER: {
      return InputField;
    }
    case FormFieldTypes.TEXT: {
      return TextField;
    }
    case FormFieldTypes.BOOLEAN:
      return Checkbox;
    case FormFieldTypes.DATETIME:
      return DateTimeField;
    case FormFieldTypes.LOCATION:
      return LocationField;
    case FormFieldTypes.SELECT:
      return SelectField;
    case FormFieldTypes.RADIO:
      return RadioGroup;
    case FormFieldTypes.STAR:
      return StarField;
    default:
      throw new Error('Not a field type');
  }
}
