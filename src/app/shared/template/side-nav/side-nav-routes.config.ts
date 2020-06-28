import { SideNavInterface } from '../../interfaces/side-nav.type';
export const ROUTES: SideNavInterface[] = [
    {
        path: '/app/settings/profile-settings',
        title: 'myAccountSettings',
        iconType: 'nzIcon',
        iconTheme: 'outline',
        icon: 'lock',
        staff_only: false,
        submenu: []
    },
    {
        path: '/app/article',
        title: 'myArticles',
        iconType: 'nzIcon',
        iconTheme: 'outline',
        icon: 'crown',
        staff_only: false,
        submenu: []
    },
    {
        path: '/app/campaign/campaign-manager',
        title: 'Campaign Manager',
        iconType: 'nzIcon',
        iconTheme: 'outline',
        icon: 'notification',
        staff_only: false,
        submenu: []
    },
    {
        path: '/app/admin',
        title: 'Admin Center',
        iconType: 'nzIcon',
        iconTheme: 'outline',
        icon: 'lock',
        staff_only: true,
        submenu: [
            {
                path: '/app/admin/article',
                title: 'allArticles',
                iconType: 'nzIcon',
                iconTheme: 'outline',
                icon: 'crown',
                staff_only: true,
                submenu: []
            },
            {
                path: '/app/admin/member',
                title: 'memberSettings',
                iconType: 'nzIcon',
                iconTheme: 'outline',
                icon: 'lock',
                staff_only: true,
                submenu: []
            }
        ]
    }
    ,
    {
        path: '/app/settings/profile-settings',
        title: 'myAccountSettings',
        iconType: 'nzIcon',
        iconTheme: 'outline',
        icon: 'lock',
        staff_only: true,
        submenu: []
    },
]
