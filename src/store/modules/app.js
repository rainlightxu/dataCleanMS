import Cookies from 'js-cookie'
import { getLanguage } from '@/lang/index'

const state = {
    sidebar: {
        opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
        withoutAnimation: false
    },
    device: 'desktop',
    language: getLanguage(),
    size: Cookies.get('size') || 'medium',
    title: 'Big Data Clean Platform'
}

const mutations = {
    TOGGLE_SIDEBAR: state => {
        state.sidebar.opened = !state.sidebar.opened
        state.sidebar.withoutAnimation = false
        if (state.sidebar.opened) {
            Cookies.set('sidebarStatus', 1)
        } else {
            Cookies.set('sidebarStatus', 0)
        }
    },
    CLOSE_SIDEBAR: (state, withoutAnimation) => {
        Cookies.set('sidebarStatus', 0)
        state.sidebar.opened = false
        state.sidebar.withoutAnimation = withoutAnimation
    },
    TOGGLE_DEVICE: (state, device) => {
        state.device = device
    },
    SET_LANGUAGE: (state, language) => {
        state.language = language
        Cookies.set('language', language)
    },
    SET_SIZE: (state, size) => {
        state.size = size
        Cookies.set('size', size)
    },
    SET_TITLE: (state, title) => {
        state.title = title
    }
}

const actions = {
    toggleSideBar({ commit }) {
        commit('TOGGLE_SIDEBAR')
    },
    closeSideBar({ commit }, { withoutAnimation }) {
        commit('CLOSE_SIDEBAR', withoutAnimation)
    },
    toggleDevice({ commit }, device) {
        commit('TOGGLE_DEVICE', device)
    },
    setLanguage({ commit }, language) {
        commit('SET_LANGUAGE', language)
    },
    setSize({ commit }, size) {
        commit('SET_SIZE', size)
    },
    setTitle({ commit }, title) {
        commit('SET_TITLE', title)
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}