import { SELECT, TEXT, STAR } from 'constants/FormFieldTypes';
import { TEN_SCALE_OPTIONS } from './constants';

export default Object.freeze({
  name: 'postShowSurvey',
  description: '',
  fields: [
    {
      label: 'Did Cadenzo clearly communicate details of the show?',
      type: SELECT,
      options: TEN_SCALE_OPTIONS,
      name: 'didCadenzoCommunicateDetails',
    },
    {
      label: 'Did the venue pay the previously agreed-upon compensation?',
      type: SELECT,
      options: [
        {
          label: 'Yes',
          value: 'Yes',
        },
        {
          label: 'No',
          value: 'No',
        },
      ],
      name: 'wasArtistPaid',
    },
    {
      label:
        "Any comments you'd like to share on the overall experience of your show?",
      type: TEXT,
      name: 'overallExperienceWithShow',
    },
    {
      label:
        'How likely is it that you would recommend Cadenzo to a friend or colleague?',
      type: SELECT,
      options: TEN_SCALE_OPTIONS,
      name: 'wouldYouRecommendCadenzo',
    },
    {
      label:
        'What changes would Cadenzo have to make for you to give it a higher rating?',
      type: TEXT,
      name: 'otherFeedback',
    },
  ],
});
