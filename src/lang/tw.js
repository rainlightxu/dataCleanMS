export default {
    route: {
        dashboard: '首頁',
        documentation: '文檔',
        guide: '引導頁',
        Permission: '權限管理',
        rolePermission: '角色權限',
        pagePermission: '頁面權限',
        directivePermission: '指令權限',
        icons: '圖標',
        components: '組件',
        tinymce: '富文本編輯器',
        markdown: 'Markdown',
        jsonEditor: 'JSON 編輯器',
        dndList: '列表拖拽',
        splitPane: 'Splitpane',
        avatarUpload: '頭像上傳',
        dropzone: 'Dropzone',
        sticky: 'Sticky',
        countTo: 'Count To',
        componentMixin: '小組件',
        backToTop: '返回頂部',
        dragDialog: '拖拽 Dialog',
        dragSelect: '拖拽 Select',
        dragKanban: '可拖拽看板',
        charts: '圖表',
        keyboardChart: '鍵盤圖表',
        lineChart: '折線圖',
        mixChart: '混合圖表',
        Example: '綜合實例',
        nested: '路由嵌套',
        menu1: '菜單1',
        'menu1-1': '菜單 1-1',
        'menu1-2': '菜單 1-2',
        'menu1-2-1': '菜單 1-2-1',
        'menu1-2-2': '菜單 1-2-2',
        'menu1-3': '菜單 1-3',
        menu2: '菜單 2',
        Table: 'Table',
        dynamicTable: '動態 Table',
        dragTable: '拖拽 Table',
        inlineEditTable: 'Table 內編輯',
        complexTable: '綜合 Table',
        tab: 'Tab',
        form: '表單',
        createArticle: '創建文章',
        editArticle: '編輯文章',
        articleList: '文章列表',
        errorPages: '錯誤頁面',
        page401: '401',
        page404: '404',
        errorLog: '錯誤日志',
        excel: 'Excel',
        exportExcel: '導出 Excel',
        selectExcel: '導出 已選擇項',
        mergeHeader: '導出 多級表頭',
        uploadExcel: '上傳 Excel',
        zip: 'Zip',
        pdf: 'PDF',
        exportZip: 'Export Zip',
        theme: '換膚',
        clipboardDemo: 'Clipboard',
        i18n: '國際化',
        externalLink: '外鏈',
        profile: '個人中心',
        //新增的route
        PBIHome: 'PBI 首頁',
        UserManagement: '用戶管理',
        FileManagement: '文件管理'
    },
    navbar: {
        dashboard: '首頁',
        github: '項目地址',
        logOut: '退出登錄',
        profile: '個人中心',
        theme: '換膚',
        size: '布局大小'
    },
    login: {
        title: '系統登錄',
        logIn: '登錄',
        username: '賬號',
        password: '密碼',
        any: '隨便填',
        thirdparty: '第三方登錄',
        thirdpartyTips: '本地不能模擬，請結合自己業務進行模擬！！！'
    },
    documentation: {
        documentation: '文檔',
        github: 'Github 地址'
    },
    permission: {
        addRole: '新增角色',
        editPermission: '編輯權限',
        roles: '妳的權限',
        switchRoles: '切換權限',
        tips: '在某些情況下，不適合使用 v-permission。例如：Element-UI 的 el-tab 或 el-table-column 以及其它動態渲染 dom 的場景。妳只能通過手動設置 v-if 來實現。',
        delete: '刪除',
        confirm: '確定',
        cancel: '取消'
    },
    guide: {
        description: '引導頁對于壹些第壹次進入項目的人很有用，妳可以簡單介紹下項目的功能。本 Demo 是基于',
        button: '打開引導'
    },
    components: {
        documentation: '文檔',
        tinymceTips: '富文本是管理後台壹個核心的功能，但同時又是壹個有很多坑的地方。在選擇富文本的過程中我也走了不少的彎路，市面上常見的富文本都基本用過了，最終權衡了壹下選擇了Tinymce。更詳細的富文本比較和介紹見',
        dropzoneTips: '由于我司業務有特殊需求，而且要傳七牛 所以沒用第三方，選擇了自己封裝。代碼非常的簡單，具體代碼妳可以在這裏看到 @/components/Dropzone',
        stickyTips: '當頁面滾動到預設的位置會吸附在頂部',
        backToTopTips1: '頁面滾動到指定位置會在右下角出現返回頂部按鈕',
        backToTopTips2: '可自定義按鈕的樣式、show/hide、出現的高度、返回的位置 如需文字提示，可在外部使用Element的el-tooltip元素',
        imageUploadTips: '由于我在使用時它只有vue@1版本，而且和mockjs不兼容，所以自己改造了壹下，如果大家要使用的話，優先還是使用官方版本。'
    },
    table: {
        dynamicTips1: '固定表頭, 按照表頭順序排序',
        dynamicTips2: '不固定表頭, 按照點擊順序排序',
        dragTips1: '默認順序',
        dragTips2: '拖拽後順序',
        title: '標題',
        importance: '重要性',
        type: '類型',
        remark: '點評',
        search: '搜索',
        add: '添加',
        export: '導出',
        reviewer: '審核人',
        id: '序號',
        date: '時間',
        author: '作者',
        readings: '閱讀數',
        status: '狀態',
        actions: '操作',
        edit: '編輯',
        publish: '發布',
        draft: '草稿',
        delete: '刪除',
        cancel: '取 消',
        confirm: '確 定'
    },
    example: {
        warning: '創建和編輯頁面是不能被 keep-alive 緩存的，因爲keep-alive 的 include 目前不支持根據路由來緩存，所以目前都是基于 component name 來進行緩存的。如果妳想類似的實現緩存效果，可以使用 localStorage 等浏覽器緩存方案。或者不要使用 keep-alive 的 include，直接緩存所有頁面。詳情見'
    },
    errorLog: {
        tips: '請點擊右上角bug小圖標',
        description: '現在的管理後台基本都是spa的形式了，它增強了用戶體驗，但同時也會增加頁面出問題的可能性，可能壹個小小的疏忽就導致整個頁面的死鎖。好在 Vue 官網提供了壹個方法來捕獲處理異常，妳可以在其中進行錯誤處理或者異常上報。',
        documentation: '文檔介紹'
    },
    excel: {
        export: '導出',
        selectedExport: '導出已選擇項',
        placeholder: '請輸入文件名(默認excel-list)'
    },
    zip: {
        export: '導出',
        placeholder: '請輸入文件名(默認file)'
    },
    pdf: {
        tips: '這裏使用   window.print() 來實現下載pdf的功能'
    },
    theme: {
        change: '換膚',
        documentation: '換膚文檔',
        tips: 'Tips: 它區別于 navbar 上的 theme-pick, 是兩種不同的換膚方法，各自有不同的應用場景，具體請參考文檔。'
    },
    tagsView: {
        refresh: '刷新',
        close: '關閉',
        closeOthers: '關閉其它',
        closeAll: '關閉所有'
    },
    settings: {
        title: '系統布局配置',
        theme: '主題色',
        tagsView: '開啓 Tags-View',
        fixedHeader: '固定 Header',
        sidebarLogo: '側邊欄 Logo'
    },
    log:{
        operation:"操作名稱",
        operatorName:"操作人員",
        operatorParams:"操作時篩選條件",
        operationTime:"操作時間",
        resultStatus:"結果狀態",
        resultMessage:"操作結果"
    },
    file:{
        uploadList:"上傳列表",
        currentContent:"當前目錄",
        upload:"上傳",
        folder:"文件夾",
        remove:"刪除",
        name:"名稱",
        type:"類型",
        status:"狀態",
        reason:"失敗原因",
        canDelete:"是否可刪除",
        createTime:"上傳日期",
        createUser:"上傳人員",
        pleaseKeyIn:"請輸入文件名"
    },
    user:{
        userName:"用戶名",
        userCode:"賬號",
        userGroup:"用戶分組",
        addUser:"添加用戶",
        email:"郵箱",
        createUser:"創建人",
        createTime:"創建時間",
        lastLoginTime:"最後登錄時間",
        lastResetPwdTime:"最後更改密碼時間",
        isLocked:"是否已鎖定",
    },
    userGroup:{
        addUser2Group:"添加用戶到分組",
        addGroup:"添加分組",
        changeGroupAuth:"更改分組權限",
        removeGroup:"刪除該分組",
        groupAuths:"當前分組擁有的權限信息",
        userInGroup:"當前分組內的成員",
        batchRemoveUser:"批量刪除用戶",
    }
}