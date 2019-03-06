import {getFullUrlPath, oauthUrl, parseQueryString} from "../path";

/*
 * Most of this code is adapted from satellizer's code
 * https://github.com/sahat/satellizer/blob/master/src/popup.ts
 */

export function oauth1Popup(url, token, height, width) {
    const options = {
        width: width,
        height: height,
        top: window.screenY + ((window.outerHeight - height) / 2.5),
        left: window.screenX + ((window.outerWidth - width) / 2)
    };
    const features = `width=${options.width},height=${options.height},top=${options.top},left=${options.left}`;

    return window.open(
        `${url}?oauth_token=${token}`,
        'popupWindow',
        features
    );
}

export function pollOauth1Popup(popup) {
    if (!popup || popup.closed === undefined || popup.closed)
        return false;

    try {
        const popupLocation = popup.location;
        const popupUrlPath = getFullUrlPath(popupLocation);

        if (popupUrlPath === oauthUrl()) {
            const query = parseQueryString(popupLocation.search.substring(1).replace(/\/$/, ''));
            const hash = parseQueryString(popupLocation.hash.substring(1).replace(/[/$]/, ''));
            const params = {...query, ...hash};

            if (params.error)
                return false;
            popup.close();
            return params;
        }
    } catch (error) {
        // Ignore DOMException: Blocked a frame with origin from accessing a cross-origin frame.
        // A hack to get around same-origin security policy errors in IE.
    }
    return true;
}