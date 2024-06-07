import { combineReducers } from "@reduxjs/toolkit"

const rootReducer = combineReducers({
    auth: authReducer,
})