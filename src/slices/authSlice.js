import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    token: localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")) : null
}