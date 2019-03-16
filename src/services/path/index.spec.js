import {
    api,
    oauthUrl,
    getFullUrlPath,
    parseQueryString
} from "./index";

it('Should have correct urls', () => {
    expect(api('test')).toMatchSnapshot();
    expect(oauthUrl()).toMatchSnapshot();
});

it('Should construct correct path', () => {
    const locationHttps = {
        protocol: 'https:',
        hostname: 'test',
        pathname: '/test'
    };
    const locationHttp = {
        ...locationHttps,
        protocol: 'http:'
    };
    const locationPort = {
        ...locationHttps,
        port: '8080'
    };
    const locationPartialPathName = {
        ...locationHttps,
        pathname: 'test'
    };

    expect(getFullUrlPath(locationHttps)).toMatchSnapshot();
    expect(getFullUrlPath(locationHttp)).toMatchSnapshot();
    expect(getFullUrlPath(locationPort)).toMatchSnapshot();
    expect(getFullUrlPath(locationPartialPathName)).toMatchSnapshot();
});

it('Should correctly parse query string', () => {
    expect(parseQueryString()).toMatchSnapshot();
    expect(parseQueryString('test')).toMatchSnapshot();
    expect(parseQueryString('test&test2=val')).toMatchSnapshot();
});
