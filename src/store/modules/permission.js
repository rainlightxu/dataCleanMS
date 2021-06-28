import { asyncRoutes, constantRoutes } from '@/router'
import Layout from "@/layout";
/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
    if (route.meta && route.meta.roles) {
        return roles.some(role => route.meta.roles.includes(role))
    } else {
        return true
    }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
    const res = []

    routes.forEach(route => {
        const tmp = {...route }
        if (hasPermission(roles, tmp)) {
            if (tmp.children) {
                tmp.children = filterAsyncRoutes(tmp.children, roles)
            }
            res.push(tmp)
        }
    })

    return res
}

const state = {
    routes: [],
    addRoutes: []
}

const mutations = {
    SET_ROUTES: (state, routes) => {
        state.addRoutes = routes
        state.routes = constantRoutes.concat(routes)
    }
}

const actions = {
    generateRoutes({ commit }, roles) {
        return new Promise(resolve => {
            // let userInfo = store.state.user.userInfo;
            let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
            // console.log(userInfo, "userInfo");
            // 将userInfo.RoleList按照SortNum排序
            userInfo.RoleList = userInfo.RoleList.sort((a,b) => {
                return parseInt(a.SortNum) - parseInt(b.SortNum)
            })
            let accessedRoutes = [];
            for (var a = 0; a < userInfo.RoleList.length; a++) {
                const obj = {
                    path: userInfo.RoleList[a].url,
                    component: Layout,
                    redirect: userInfo.RoleList[a].url,
                    name: userInfo.RoleList[a].Name + ".",
                    meta: {
                        title: userInfo.RoleList[a].Name,
                        icon: userInfo.RoleList[a].ClassName
                    },
                    children: []
                };
                userInfo.RoleList[a].SubMenus.forEach(item => {
                    // var url = userInfo.RoleList[a].SubMenus[i].url;
                    let childPath = item.url.slice(
                        item.url.lastIndexOf("/") + 1
                    );
                    // console.log(childPath);
                    obj.children.push({
                        path: childPath,
                        component: (resolve) => require([`@/views${item.url}`], resolve),
                        name: item.Name,
                        meta: {
                            title: item.Name
                        },
                        hidden: item.IsDisplay != 1
                    });
                });
                accessedRoutes.push(obj);
                // accessedRoutes.push({ path: "*", redirect: "/404", hidden: true });
            }
            commit('SET_ROUTES', accessedRoutes)
            resolve(accessedRoutes)
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}