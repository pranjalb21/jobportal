import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    jobs: [],
    loading: false,
    error: null,
    message: null,
    singleJob: {},
    myJobs: [],
};
const jobSlice = createSlice({
    name: "job",
    initialState,
    reducers: {
        requestForAllJobs: (state, action) => {
            state.loading = true;
            state.error = null;
        },
        successOnJobRequest: (state, action) => {
            (state.jobs = action.payload),
                (state.error = null),
                (state.loading = false);
        },
        failureOnJobRequest: (state, action) => {
            (state.jobs = []),
                (state.error = action.payload),
                (state.loading = false);
        },
        clearAllError: (state, action) => {
            state.error = null;
        },
        resetJobSlice: (state, action) => {
            state.jobs = state.jobs;
            state.loading = false;
            state.error = null;
            state.message = null;
            state.singleJob = {};
            state.myJobs = state.myJobs;
        },
    },
});

export const fetchJobs = (niche, city, keyword) => async (dispatch) => {
    try {
        dispatch(jobSlice.actions.requestForAllJobs());
        let link = `http://localhost:8000/api/v1/job/all?`;
        let queries = [];
        if (niche) {
            queries.push(`niche=${niche}`);
        }
        if (city) {
            queries.push(`city=${city}`);
        }
        if (keyword) {
            queries.push(`keyword=${keyword}`);
        }
        link += queries.join("&");
        const response = await axios.get(link, { withCredentials: true });
        dispatch(jobSlice.actions.successOnJobRequest(response.data.jobs));
        dispatch(jobSlice.actions.clearAllError());
    } catch (error) {
        dispatch(
            jobSlice.actions.failureOnJobRequest(error.response.data.message)
        );
    }
};

export const clearAllJobErrors = () => ()=>{
    
}
