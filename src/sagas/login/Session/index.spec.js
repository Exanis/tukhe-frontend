import watcherSaga, { sessionLoginSaga } from "./index";

it('Should have a watcher saga', () => {
    const gen = watcherSaga();

    expect(gen.next()).toMatchSnapshot();
    expect(gen.next().done).toBeTruthy();
});

it('Should log user in when there is a token', () => {
    jest.spyOn(Storage.prototype, 'getItem');
    Storage.prototype.getItem.mockReturnValue('test');
    const gen = sessionLoginSaga();

    expect(gen.next()).toMatchSnapshot();
    expect(gen.next().done).toBeTruthy();
    expect(Storage.prototype.getItem).toHaveBeenCalledWith('tukhe-token');
});

it('Should log user in when there is no token', () => {
    jest.spyOn(Storage.prototype, 'getItem');
    Storage.prototype.getItem.mockReturnValue(false);
    const gen = sessionLoginSaga();

    expect(gen.next()).toMatchSnapshot();
    expect(gen.next().done).toBeTruthy();
    expect(Storage.prototype.getItem).toHaveBeenCalledWith('tukhe-token');
});

it('Should log user in when there is a token but it is null', () => {
    jest.spyOn(Storage.prototype, 'getItem');
    Storage.prototype.getItem.mockReturnValue('null');
    const gen = sessionLoginSaga();

    expect(gen.next()).toMatchSnapshot();
    expect(gen.next().done).toBeTruthy();
    expect(Storage.prototype.getItem).toHaveBeenCalledWith('tukhe-token');
});
