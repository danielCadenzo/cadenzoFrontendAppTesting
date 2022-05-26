import { SELECT, TEXT, STAR } from 'constants/FormFieldTypes';
import { TEN_SCALE_OPTIONS } from './constants';

export default Object.freeze({
  name: 'artistReview',
  description:
    'Thanks for booking your last show with Cadenzo! We want to give venues the chance to give feedback on artists, so we can continue to improve your live entertainment booking experience. Let us know your thoughts!',
  fields: [
    {
      label: 'How would you overall rate your experience?',
      type: STAR,
      name: 'overallRating',
    },
    {
      label:
        'The artist played the style of music that you expected them to play',
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
      name: 'styleOfMusic',
    },
    {
      label: 'The artist carried themselves in an appropriate manner',
      type: SELECT,
      options: TEN_SCALE_OPTIONS,
      name: 'professionalism',
    },
    {
      label: 'The crowd was enjoyable to have at my venue',
      type: SELECT,
      options: TEN_SCALE_OPTIONS,
      name: 'qualityOfCrowd',
    },
    {
      label: 'I would have this artist back at our venue',
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
      name: 'wouldHaveArtistBack',
    },
    {
      label:
        'What changes would Cadenzo have to make for you to give it a higher rating?',
      type: TEXT,
      name: 'whatCouldWeHaveDoneBetter',
    },
    {
      label: 'Any other feedback',
      type: TEXT,
      name: 'otherFeedback',
    },
  ],
});
