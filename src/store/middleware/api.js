import axios from "axios";

export const api = ({dispatch}) => (next) => (action) => {

    if (action.type !== 'api/apiCall') {
        next(action)
        return
    }

    const {url, method, data, onSuccess, onFail, headers} = action.payload
    axios({
        baseURL: 'http://127.0.0.1:8000/api/v1/',
        url,
        method,
        data,
        headers,
    }).then(response => {
        dispatch({
            type: onSuccess,
            payload: response.data
        })
    }).catch(response => {
            dispatch({
                type: onFail,
                payload: response.data
            })
        }
    )

    next(action)
}