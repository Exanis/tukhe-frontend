import axios from 'axios';
import watcherSaga, {
    loadAccountSaga,
    deleteAccountSaga,
    fetchDeleteAccount,
    fetchAccountsList
} from './index';

it('Should have a watcher saga as expected', () => {
    const gen = watcherSaga();

    expect(gen.next()).toMatchSnapshot();
    expect(gen.next()).toMatchSnapshot();
    expect(gen.next()).toMatchSnapshot();
    expect(gen.next().done).toBeTruthy();
});

it('Should load accounts as expected', () => {
    const gen = loadAccountSaga();

    expect(gen.next()).toMatchSnapshot();
    expect(gen.next({
        data: []
    })).toMatchSnapshot();
    expect(gen.next().done).toBeTruthy();
});

it('Should delete accounts as expected', () => {
    const gen = deleteAccountSaga({
        payload: 'test'
    });
    const request = gen.next();

    expect(request).toMatchSnapshot();
    expect(request.value.payload.fn()).toMatchSnapshot();
    expect(gen.next()).toMatchSnapshot();
    expect(gen.next().done).toBeTruthy();
});

it('Should prepare ajax requests as expected', () => {
    expect(fetchAccountsList()).toMatchSnapshot();
    expect(fetchDeleteAccount('test')).toMatchSnapshot();
});

it('Should handle error on delete', () => {
    const gen = deleteAccountSaga({
        payload: 'test'
    });

    expect(gen.next()).toMatchSnapshot();
    gen.throw('error');
    expect(gen.next()).toMatchSnapshot();
    expect(gen.next().done).toBeTruthy();
});

it('Should handle error on load accounts as expected', () => {
    const gen = loadAccountSaga();

    expect(gen.next()).toMatchSnapshot();
    gen.throw('error');
    expect(gen.next()).toMatchSnapshot();
    expect(gen.next().done).toBeTruthy();
});
