import type { ReduxAction } from "actions/ReduxActionTypes";
import log from "loglevel";
import { create } from "mutative";

export const createReducer = (
  // TODO: Fix this the next time the file is edited
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialState: any,
  // TODO: Fix this the next time the file is edited
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handlers: { [type: string]: (state: any, action: any) => any },
) => {
  // TODO: Fix this the next time the file is edited
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function reducer(state = initialState, action: ReduxAction<any>) {
    const type = action.type;
    if ((handlers as any).hasOwnProperty(type)) {
      const handler = (handlers as any)[type];
      return handler(state, action);
    }
    return state;
  };
};

export const createImmerReducer = (
  // TODO: Fix this the next time the file is edited
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialState: any,
  // TODO: Fix this the next time the file is edited
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handlers: { [type: string]: any },
) => {
  // TODO: Fix this the next time the file is edited
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function reducer(state = initialState, action: ReduxAction<any>) {
    if (handlers.hasOwnProperty(action.type)) {
      if (action?.payload?.updates) {
        const updates = action?.payload?.updates;

        try {
          for (const update of updates) {
            if (update.kind === "newTree") {
              return update.rhs;
            }
          }
        } catch (e) {
          log.error(e);
        }
      }

      const fn = handlers[action.type];

      return create(state, (draft) => fn(draft, action));
    } else {
      return state;
    }
  };
};
