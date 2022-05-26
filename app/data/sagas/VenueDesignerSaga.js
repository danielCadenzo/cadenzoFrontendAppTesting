import { put, select, delay } from 'redux-saga/effects';
import {
  ADD_VENUE_ITEM,
  REMOVE_VENUE_ITEM,
  VENUE_ITEM_UPDATED,
  UPDATE_NODE_FIELD,
  UPDATE_TICKET_TIERS,
  DELETE_TICKET_TIER,
  UPDATE_SEAT_MAPPING,
} from 'redux/ActionTypes';
import { venueMapUpdated } from 'redux/actions/VenueDesignerActions';
import { takeMultipleLatestSaga } from './utils';

// getsLatest of multiple functions

const createMergedVenueMap = venueDesignerState => {
  const { venueItems, ticketGroupMapping } = venueDesignerState;
  return {
    venueItems: venueItems.toJS(),
    ticketGroups: ticketGroupMapping,
  };
};

// Sagas
function* handleVenueDesignerAutoSave() {
  try {
    yield delay(1000);
    const state = yield select();
    const editorInfo = state.venueDesigner.editorInfo.toJS();
    const { selectedMapName, selectedVenueId } = editorInfo;
    const updatedJSONMap = createMergedVenueMap(state.venueDesigner);
    yield put(
      venueMapUpdated(
        selectedVenueId,
        selectedMapName,
        JSON.stringify(updatedJSONMap),
        JSON.stringify({}),
      ),
    );
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }
}

export default function* rootSaga() {
  yield takeMultipleLatestSaga({
    [ADD_VENUE_ITEM]: handleVenueDesignerAutoSave,
    [REMOVE_VENUE_ITEM]: handleVenueDesignerAutoSave,
    [VENUE_ITEM_UPDATED]: handleVenueDesignerAutoSave,
    [UPDATE_TICKET_TIERS]: handleVenueDesignerAutoSave,
    [DELETE_TICKET_TIER]: handleVenueDesignerAutoSave,
    [UPDATE_SEAT_MAPPING]: handleVenueDesignerAutoSave,
    [UPDATE_NODE_FIELD]: handleVenueDesignerAutoSave,
  });
}
