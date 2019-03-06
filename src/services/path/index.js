export function api(path) {
    const basePath = process.env.REACT_APP_API_URL;

    return basePath + path;
}

export function oauthUrl() {
    return process.env.REACT_APP_OAUTH_URL;
}

/*
 * The next two functions are either copied or adapted from satellizer's code
 * https://github.com/sahat/satellizer/blob/master/src/utils.ts
 */

export function getFullUrlPath(location) {
  const isHttps = location.protocol === 'https:';
  return location.protocol + '//' + location.hostname +
    ':' + (location.port || (isHttps ? '443' : '80')) +
    (/^\//.test(location.pathname) ? location.pathname : '/' + location.pathname);
}

export function parseQueryString(str) {
    const result = {};

    (str || '').split('&').map(keyValue => {
        if (keyValue) {
            const parts = keyValue.split('=');
            const key = decodeURIComponent(parts[0]);

            if (parts[1] === undefined)
                result[key] = true;
            else
                result[key] = decodeURIComponent(parts[1]);
        }
        return '';
    });
    return result;
}