export default {
    login: "/echo-api/user-info/login post query", // 登录
    register: "/echo-api/user-info/register post query", // 注册
    refreshToken: "/echo-api/user-info/refreshToken get", // 刷新 token

    whiteList: "/echo-api/auth-white-ip/listAuthWhiteIp get", // 白名单列表
    whiteListAll: "/echo-api/auth-white-ip/listAllAuthWhiteIp get", // 管理员-所有白名单列表
    whiteListAdd: "/echo-api/auth-white-ip/addWhiteIp get", // 白名单新增
    whiteListDelete: "/echo-api/auth-white-ip/deleteAuthWhiteIp get", // 白名单删除

    getDevice: "/echo-api/client-info/listClientInfo get", // 获取 device

    downstream: "/echo-api/downstream-server/listDownstreamServer get", // downstream
    downstreamAdd: "/echo-api/downstream-server/addDownstreamServer get", // downstream 添加
    downstreamStatus: "/echo-api/downstream-server/setResourceStatus get", // downstream 状态

    nat: "/echo-api/nat-mapping-server/listNatMappingServer get", // nat
    natAdd: "/echo-api/nat-mapping-server/addNatMappingServer get", // nat 添加
    natStatus: "/echo-api/nat-mapping-server/setNatMappingServerStatus get", // nat 状态

    setAuth: "/echo-api/user-info/setupAuthAccount get", // 设置 auth 账号
    getUser: "/echo-api/user-info/userInfo get", // 获取用户信息

    getProxy: "/echo-api/proxy-resource/getProxy get", // 获取代理
    getIp: "/echo-api/proxy-resource/clientMappingProxy get", // 获取出口 ip

    userAdd: "/echo-api/user-info/createUser get", // 创建用户
    userList: "/echo-api/user-info/listUser get", // 用户列表
    userQuota: "/echo-api/user-info/setupQuota get", // 设置 quota
    userLogin: "/echo-api/user-info/travelToUser get", // 模拟登录
}