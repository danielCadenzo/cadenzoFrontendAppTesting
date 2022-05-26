import { GET_VIEWER_INFO } from 'data/queries/dashboard';
import cadenzoApi from './utils';

export const fetchViewerInfo = () => cadenzoApi.post(GET_VIEWER_INFO);
