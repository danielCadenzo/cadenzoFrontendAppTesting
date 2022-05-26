import {
  UPDATE_VENUE_MAP,
  FETCH_VENUE_MAP_LIST,
  CREATE_VENUE_MAP,
  LOAD_VENUE_MAP,
} from 'data/queries/VenueDesigner';
import cadenzoApi from './utils';

export const editVenueMap = (id, mapName, seatingChart, seatingMap) =>
  cadenzoApi.post(UPDATE_VENUE_MAP, { id, mapName, seatingChart, seatingMap });

export const createVenueMap = (mapName, seatingChart, seatingMap) =>
  cadenzoApi.post(CREATE_VENUE_MAP, {
    mapName,
    seatingChart: JSON.stringify(seatingChart),
    seatingMap: JSON.stringify(seatingMap),
  });

export const fetchVenueItems = email =>
  cadenzoApi.post(FETCH_VENUE_MAP_LIST, { email });

export const fetchVenueMap = id => cadenzoApi.post(LOAD_VENUE_MAP, { id });
