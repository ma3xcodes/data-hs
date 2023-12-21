import {cmsReducer} from "@datawheel/canon-cms";
import {explorerReducer, olapMiddleware, permalinkMiddleware} from "@datawheel/tesseract-explorer";

/**
 * This object will be used to pre-populate the redux store with any
 * static values you may need.
 */
export const initialState = {};

/**
 * This array can contain redux middlewares that will be used in the
 * redux store.
 */
 export const middleware = [olapMiddleware, permalinkMiddleware];


export const reducers = {
  cms: cmsReducer,
  explorer: explorerReducer
};
