import { SELECT, TEXT, STAR } from 'constants/FormFieldTypes';
import { TEN_SCALE_OPTIONS } from './constants';

export default Object.freeze({
  name: 'venueReview',
  description:
    'Thanks for booking your last show with Cadenzo! We want to give artists the chance to give feedback on venues, so we can continue to improve your live entertainment booking experience. Let us know your thoughts!',
  fields: [
    {
      label: 'How would you overall rate your experience?',
      type: STAR,
      name: 'overallRating',
    },
    {
      label:
        'The venue was clear in communicating their expectations for the show',
      type: SELECT,
      options: TEN_SCALE_OPTIONS,
      name: 'communicationClear',
    },
    {
      label: "The venue's acoustics allowed for our sound to be mixed well",
      type: SELECT,
      options: TEN_SCALE_OPTIONS,
      name: 'venueAcoustics',
    },
    {
      label:
        'The venue provided the PA system and backline they said they would',
      type: SELECT,
      options: TEN_SCALE_OPTIONS,
      name: 'backlineAdequate',
    },
    {
      label: 'The venue carried themselves in an appropriate manner',
      type: SELECT,
      options: TEN_SCALE_OPTIONS,
      name: 'bookingProfessionalEtiquette',
    },
    {
      label:
        'The venue provided the PA system and backline they said they would',
      type: SELECT,
      options: TEN_SCALE_OPTIONS,
      name: 'backlineAdequate',
    },
    {
      label: 'The venue was helpful in promoting my show',
      type: SELECT,
      options: TEN_SCALE_OPTIONS,
      name: 'venuePromotionOfShow',
    },
    {
      label: 'I would play at this venue again',
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
      name: 'wouldPlayAgainAtVenue',
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
