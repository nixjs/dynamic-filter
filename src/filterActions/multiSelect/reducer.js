/* eslint-disable no-param-reassign */
import { RESET, SET_ABOVE, SET_DROPDOWN, FIELDS_STATE } from './const';

export const initialState = { [FIELDS_STATE.DROPDOWN]: false, [FIELDS_STATE.ABOVE]: false };

const multiSelectReducer = (draft, action) => {
    switch (action.type) {
        case SET_ABOVE:
            draft[FIELDS_STATE.ABOVE] = action[FIELDS_STATE.ABOVE];
            return draft;
        case SET_DROPDOWN:
            draft[FIELDS_STATE.DROPDOWN] = action[FIELDS_STATE.DROPDOWN];
            return draft;
        case RESET:
        default:
            return initialState;
    }
};

export default multiSelectReducer;
