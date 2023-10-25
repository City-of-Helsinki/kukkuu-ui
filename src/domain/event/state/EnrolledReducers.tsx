import { createReducer } from '@reduxjs/toolkit';

import { justEnrolled } from './EventActions';

const reducer = createReducer(false, (builder) => {
  builder.addCase(justEnrolled, (state) => !state);
});

export default reducer;
