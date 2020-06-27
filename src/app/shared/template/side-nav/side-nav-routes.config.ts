import { SideNavInterface } from '../../interfaces/side-nav.type';
export const ROUTES: SideNavInterface[] = [
    {
        path: '/app/settings/profile-settings',
        title: 'myAccountSettings',
        iconType: 'nzIcon',
        iconTheme: 'outline',
        icon: 'lock',
        staff: false,
        submenu: []
    },
    {
        path: '/app/article',
        title: 'myArticles',
        iconType: 'nzIcon',
        iconTheme: 'outline',
        icon: 'crown',
        staff: false,
        submenu: []
    },
    {
        path: '/app/campaign/campaign-manager',
        title: 'Campaign Manager',
        iconType: 'nzIcon',
        iconTheme: 'outline',
        icon: 'notification',
        staff: false,
        submenu: []
    },
    {
        path: '/app/admin',
        title: 'Admin Center',
        iconType: 'nzIcon',
        iconTheme: 'outline',
        icon: 'appstore',
        staff: true,
        submenu: [
            {
                path: '/app/admin/articles',
                title: 'All articles',
                iconType: '',
                icon: '',
                iconTheme: '',
                staff: true,
                submenu: []
            },
            {
                path: '/app/admin/members',
                title: 'All members',
                iconType: '',
                icon: '',
                iconTheme: '',
                staff: true,
                submenu: []
            }
        ]
    }
]    