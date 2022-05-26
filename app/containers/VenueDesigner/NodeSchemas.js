import * as FieldTypes from './FieldTypes';
import * as IconTypes from './IconTypes';
import * as GraphNodeTypes from './GraphNodeTypes';
import {
  ALPHABETICAL_ORDER,
  NUMERICAL_ORDER,
  ODD_NUMERICAL_ORDER,
} from './constants';

/**
 * const ExampleSectionObject = {
  label: 'Table 6',
  icon: '@material-ui/icons/EventSeat',
  hasBackground: true,
  hasIcon: true,
  hasLabel: true,
  seatingChart: {
    // The mappings for ticket groups and membership holds
    // 
    ticketGroups: {
      SOME_TICKET_GROUP: {
        <Assigned_SEATING_ID>: [<Seat numbers>],
        <GA_SECTION_ID>: true
      }
    }
    membership_holds: {
      <Membership_id>: {
        <Assigned_SEATING_ID>: [<Seat numbers>],
        <GA_SECTION_ID>: true
      }
     user_holds: {
      <Membership_id>: {
        <Assigned_SEATING_ID>: [<Seat numbers>],
        <GA_SECTION_ID>: true
      }
    }
  }
  background: {
    fill: '',
    width: null,
    height: null,
  },
  fields: [
    {
      label: 'Section Prefix',
      type: 'TEXT',
      value: 'Section',
      componentOptions: {},
    },
  ],
};
 */

export const GA_SECTION = {
  label: 'Section',
  icon: '@material-ui/icons/EventSeat',
  type: GraphNodeTypes.GA_SECTION,
  hasBackground: true,
  hasIcon: true,
  hasLabel: true,
  height: 100,
  width: 175,
  rotation: 0,
  x: 100,
  y: 100,
  seatMap: {
    '0': null,
  },
  seatingChart: {
    membershipHolds: {},
    userHolds: {},
  },
  background: {
    fill: '#bdbbb9',
    width: 200,
    height: 100,
  },
  fields: [
    {
      label: 'Section Label',
      type: FieldTypes.TEXT_FIELD,
      value: 'Section',
      componentOptions: {},
    },
    {
      label: 'Icon',
      type: FieldTypes.ICON_SELECT_FIELD,
      value: 'FOOTPRINT',
      componentOptions: {
        options: [IconTypes.EVENT_SEAT, IconTypes.FOOTPRINT],
      },
    },
    {
      label: 'Capacity',
      type: FieldTypes.NUMBER_FIELD,
      value: 50,
      componentOptions: {},
    },

    {
      label: 'Show Section Label',
      type: FieldTypes.BOOLEAN_FIELD,
      value: true,
      componentOptions: {},
    },
    {
      label: 'Show Icon',
      type: FieldTypes.BOOLEAN_FIELD,
      value: true,
      componentOptions: {},
    },
  ],
};

export const TABLE = {
  label: 'Table',
  icon: null,
  type: GraphNodeTypes.TABLE,
  hasBackground: true,
  hasIcon: true,
  hasLabel: true,
  rotation: 0,
  x: 289,
  y: 366,
  seatMap: {
    '0': null,
    '1': null,
    '2': null,
  },
  seatingChart: {
    membershipHolds: {},
    userHolds: {},
    ticketGroups: {},
  },
  background: {
    fill: '#bdbbb9',
    width: 200,
    height: 100,
  },
  fields: [
    {
      label: 'Seat Amount',
      type: FieldTypes.NUMBER_FIELD,
      value: 12,
      componentOptions: {},
    },
    {
      label: 'Table End Seating Amount',
      type: FieldTypes.NUMBER_FIELD,
      value: 2,
      componentOptions: {},
    },
    {
      label: 'Table Prefix',
      type: FieldTypes.TEXT_FIELD,
      value: 'Table',
      componentOptions: {},
    },
    {
      label: 'Seat Prefix',
      type: FieldTypes.TEXT_FIELD,
      value: 'Seat',
      componentOptions: {},
    },
    /**
     * {
      label: 'Seat Ordering',
      type: FieldTypes.SELECT_FIELD,
      value: '1,2,3...',
      componentOptions: {
        options: [
          { label: NUMERICAL_ORDER, value: NUMERICAL_ORDER },
          { label: ODD_NUMERICAL_ORDER, value: ODD_NUMERICAL_ORDER },
          { label: ALPHABETICAL_ORDER, value: ALPHABETICAL_ORDER },
        ],
      },
    },
     */
    {
      label: 'Start With',
      type: FieldTypes.NUMBER_FIELD,
      value: 1,
      componentOptions: {},
    },
    {
      label: 'Rotation',
      type: FieldTypes.SLIDER_FIELD,
      value: 0,
      componentOptions: {
        min: 0,
        step: 5,
        max: 360,
      },
    },
  ],
};

export const LABEL = {
  label: 'Label',
  icon: null,
  type: GraphNodeTypes.LABEL,
  hasBackground: true,
  hasIcon: true,
  hasLabel: true,
  rotation: 0,
  x: 289,
  y: 366,
  seatMap: {},
  background: {
    fill: '#bdbbb9',
    width: 200,
    height: 100,
  },
  fields: [
    {
      label: 'Font Size',
      type: FieldTypes.NUMBER_FIELD,
      value: 20,
    },
    {
      label: 'Label',
      type: FieldTypes.TEXT_FIELD,
      value: 'Label',
      componentOptions: {},
    },
    {
      label: 'Rotation',
      type: FieldTypes.SLIDER_FIELD,
      value: 0,
      componentOptions: {
        min: 0,
        step: 5,
        max: 360,
      },
    },
  ],
};

export const ASSIGNED_SEATING_SECTION = {
  label: 'Assigned Section',
  icon: null,
  type: GraphNodeTypes.ASSIGNED_SEATING_SECTION,
  hasBackground: true,
  hasIcon: true,
  hasLabel: true,
  rotation: 0,
  x: 200,
  y: 200,
  seatMap: {},
  seatingChart: {
    membershipHolds: {},
    userHolds: {},
    ticketGroups: {},
  },
  background: {
    fill: '#bdbbb9',
    width: 200,
    height: 100,
  },
  fields: [
    {
      label: 'Seat count per Row',
      type: FieldTypes.NUMBER_FIELD,
      value: 10,
      componentOptions: {},
    },
    {
      label: 'Seat Amount',
      type: FieldTypes.NUMBER_FIELD,
      value: 50,
      componentOptions: {},
    },
    {
      label: 'Label',
      type: FieldTypes.TEXT_FIELD,
      value: 'Section X',
      componentOptions: {},
    },
    {
      label: 'Row Label',
      type: FieldTypes.SELECT_FIELD,
      value: ALPHABETICAL_ORDER,
      isLabelField: true,
      componentOptions: {
        options: [
          { label: NUMERICAL_ORDER, value: NUMERICAL_ORDER },
          { label: ODD_NUMERICAL_ORDER, value: ODD_NUMERICAL_ORDER },
          { label: ALPHABETICAL_ORDER, value: ALPHABETICAL_ORDER },
        ],
      },
    },
    {
      label: 'Row Seat Label',
      type: FieldTypes.SELECT_FIELD,
      value: ALPHABETICAL_ORDER,
      isLabelField: true,
      componentOptions: {
        options: [
          { label: NUMERICAL_ORDER, value: NUMERICAL_ORDER },
          { label: ODD_NUMERICAL_ORDER, value: ODD_NUMERICAL_ORDER },
          { label: ALPHABETICAL_ORDER, value: ALPHABETICAL_ORDER },
        ],
      },
    },
    {
      label: 'Curve',
      type: FieldTypes.SLIDER_FIELD,
      value: 0,
      componentOptions: {
        min: -1,
        step: 0.1,
        max: 1,
      },
    },
    {
      label: 'Skew',
      type: FieldTypes.SLIDER_FIELD,
      value: 0,
      componentOptions: {
        min: -1.5,
        step: 0.1,
        max: 1.5,
      },
    },
    {
      label: 'Rotation',
      type: FieldTypes.SLIDER_FIELD,
      value: 0,
      componentOptions: {
        min: 0,
        step: 5,
        max: 360,
      },
    },
  ],
};
