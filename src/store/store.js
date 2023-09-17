import {configureStore} from '@reduxjs/toolkit'
import {api} from "./middleware/api";
import documents from "./documents"
import worker from "./workers"
import stats from "./stats"
import problems from "./problems"
import events from "./events"
import members from "./members"
import login from "./logIn"
import notifications from "./notifications"


export default configureStore({
    reducer: {
        documents, login, worker, stats, events, notifications, members, problems
    },
    middleware: [
        api,
    ]
})