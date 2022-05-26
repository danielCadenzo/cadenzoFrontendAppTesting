/**
 *
 * Asynchronously loads the component for ReviewPage
 *
 */

import loadable from 'utils/loadable';

export const ArtistReviewSchema = loadable(() =>
  import('./artist_review_schema'),
);

export const VenueReviewSchema = loadable(() =>
  import('./venue_review_schema'),
);

export const PostShowSurvey = loadable(() =>
  import('./post_show_survey_schema'),
);

export default loadable(() => import('./index'));
