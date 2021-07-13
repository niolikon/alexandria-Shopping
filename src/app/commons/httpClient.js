import axios from 'axios';
import config from '../../config';
import { getCredentials } from '../authentication/authenticationSlice';

export function getAuthorizedHttpClient(baseURL) {

    let credentials = getCredentials();

    let instance = axios.create({
        baseURL: baseURL,
        timeout: config.httpTimeoutMs,
        headers: { Authorization: `Bearer ${credentials.token}` }
    });

    return instance;
}

export function getHttpClient(baseURL) {

    let instance = axios.create({
        baseURL: baseURL,
        timeout: config.httpTimeoutMs,
    });

    return instance;
}