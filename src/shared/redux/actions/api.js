/*
 *   Copyright (c) 2021 
 *   All rights reserved.
 */
import axios from 'axios';
axios.interceptors.request.use(function (config) {
    const AUTH_TOKEN = typeof window!=='undefined'? (localStorage.getItem('AUTH_TOKEN') || ""):"";
    if( config.url.indexOf('lyrics')<0 ){
        config.headers = AUTH_TOKEN!=""? { ...config.headers, authorization: `Basic ${AUTH_TOKEN}` }:config.headers;
    }else{
        config.headers = { ...config.headers, authorization: '' };
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

const API_ADDRESS = () => {
    const { NODE_ENV } = process.env;
    let API_PATH  = "https://api.aermuzik.com/v1";
    if( NODE_ENV=="development" ){
        // API_PATH  = 'http://localhost:3001/v1';
        API_PATH  = "http://local.music.com/api"
    }
    return API_PATH;
}

export default{
    'kv' : `${API_ADDRESS()}/api/kv`,
    'albums' : {
        'list': `${API_ADDRESS()}/albums`,
        'latest' : `${API_ADDRESS()}/albums/latest`,
        'info': `${API_ADDRESS()}/albums/info`,
    },
    'artists': {
        'idol': `${API_ADDRESS()}/artists/idol`,
        'list': `${API_ADDRESS()}/artists`,
        'info': `${API_ADDRESS()}/artists/info`,
    },
    'songs': {
        'list': `${API_ADDRESS()}/songs`,
        'getSrc': `${API_ADDRESS()}/songs/src`,
        'getLyrics': `${API_ADDRESS()}/songs/lrc`,
    },
    'sign': {
        'signin': `${API_ADDRESS()}/user/signin`
    },
    'account': {
        'info': `${API_ADDRESS()}/user/info`,
        'albums': `${API_ADDRESS()}/user/collection/albums`,
        'songs': `${API_ADDRESS()}/user/collection/songs`,
        'playlistFolder': `${API_ADDRESS()}/user/playlist`,
        'playlistFolderDetails': `${API_ADDRESS()}/user/playlistDetail`,
        'playlistFolderExpand': `${API_ADDRESS()}/user/playlist/expand`,
        'collection' : `${API_ADDRESS()}/collection`,
        'like': `${API_ADDRESS()}/user/like`,
    }
    
}