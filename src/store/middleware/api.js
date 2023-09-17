import axios from "axios";

export const api = ({dispatch}) => (next) => (action) => {

    if (action.type !== 'api/apiCall') {
        next(action)
        return
    }
    const token = localStorage.getItem('token');
    if (token !== 'undefined') {
        axios.defaults.headers.common['Authorization'] = `Bearer ${JSON.parse(token)}`
    }
    const {url, method, data, onSuccess, onFail, headers} = action.payload
    axios({
        baseURL: 'https://ijtimoiybolim.ozkojmb.uz/api/',
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