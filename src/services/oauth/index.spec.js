import {
    oauth1Popup,
    pollOauth1Popup
} from "./index";
import * as path from '../path';

it('Should open popup as expected', () => {
    window.open = jest.fn();

    expect(oauth1Popup(
        'testurl',
        'token',
        300,
        200
    )).toMatchSnapshot();
    expect(window.open).toHaveBeenCalled();
    expect(window.open.mock.calls[0]).toMatchSnapshot();
});

it('Should correctly poll oauth popup', () => {
    expect(pollOauth1Popup(false)).toBeFalsy();
    expect(pollOauth1Popup({
        test: 'test'
    })).toBeFalsy();
    expect(pollOauth1Popup({
        closed: true
    })).toBeFalsy();
    expect(pollOauth1Popup({
        closed: false,
        location: 'something'
    })).toBeTruthy();
    jest.spyOn(path, 'getFullUrlPath');
    jest.spyOn(path, 'oauthUrl');
    path.getFullUrlPath.mockReturnValue(false);
    path.oauthUrl.mockReturnValue(false);
    expect(pollOauth1Popup({
        closed: false,
        location: false
    })).toBeTruthy(); // It should not fail here
    expect(path.getFullUrlPath).toHaveBeenCalledWith(false);
    jest.spyOn(path, 'parseQueryString');
    path.parseQueryString.mockReturnValue({
        error: true
    });
    expect(pollOauth1Popup({
        closed: false,
        location: {
            search: 'test',
            hash: 'test'
        }
    })).toBeFalsy();
    path.parseQueryString.mockReturnValue({});

    const fn = jest.fn();

    expect(pollOauth1Popup({
        closed: false,
        location: {
            search: 'test',
            hash: 'test'
        },
        close: fn
    })).toEqual({});
    expect(fn).toHaveBeenCalled();
});
