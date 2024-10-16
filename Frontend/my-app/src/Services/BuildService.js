import axios from 'axios'

const API_URL = "http://localhost:8080/build";

//Create a new Build Entry
export const createBuildEntry = (buildEntry) => axios.post(API_URL, buildEntry);

//Get all Build entries
export const fetchAllBuildEntries = () => axios.get(API_URL);

//Get Build Entry By Id
export const getBuildEntryById = (buildId) => axios.get(`${API_URL}/${buildId}`);

//Mark Task Working
export const markTaskWorking = (taskDetails) => axios.post(API_URL, taskDetails);

//Mark Task Not Working
export const markTaskNotWorking = (taskDetails) => axios.post(API_URL, taskDetails);