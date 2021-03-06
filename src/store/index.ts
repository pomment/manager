import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import getAuthObject from '@/lib/getAuthObject';
import ThreadList from '@/interface/thread-list';
import RootState from '@/interface/state-types';

Vue.use(Vuex);

export default new Vuex.Store<RootState>({
    strict: process.env.NODE_ENV !== 'production',
    state: {
        logged: false,
        url: '',
        token: '',
        threads: [],
        avatarPrefix: 'https://secure.gravatar.com/avatar/',
        nextPath: '/list/threads',
    },
    mutations: {
        setLoginInfo(state, param: { url: string; token: string }) {
            state.url = param.url;
            state.token = param.token;
        },
        setLoginStatus(state, param: { logged: boolean }) {
            state.logged = param.logged;
        },
        setThreadList(state, param: { threads: ThreadList[] }) {
            state.threads = param.threads;
        },
        setNextPath(state, param: { nextPath: string }) {
            state.nextPath = param.nextPath;
        },
        setThreadTitle(state, param: { url: string; title: string }) {
            for (let i = 0; i < state.threads.length; i += 1) {
                if (state.threads[i].url === param.url) {
                    state.threads[i].title = param.title;
                    return;
                }
            }
            console.warn(`[Pomment] Unable to find ${param.url} from the thread list`);
        },
    },
    actions: {
        async getThreadList(ctx) {
            const result = await axios.post(`${ctx.state.url}/v3/manage/threads`, {
                auth: getAuthObject(ctx.state.token),
            });
            this.commit('setThreadList', {
                threads: result.data,
            });
        },
    },
});
