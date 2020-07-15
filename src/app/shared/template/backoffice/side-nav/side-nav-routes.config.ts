import { SideNavInterface } from '../../../interfaces/side-nav.type';
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
        path: '/app/campaign',
        title: 'CampManager',
        iconType: 'nzIcon',
        iconTheme: 'outline',
        icon: 'notification',
        staff_only: false,
        submenu: [{
            path: '/app/campaign/campaign-manager',
            title: 'Campaign',
            iconType: 'nzIcon',
            iconTheme: 'outline',
            icon: 'notification',
            staff_only: false,
            submenu: []
        }, {
            path: '/app/campaign/update-billing',
            title: 'CampBilling',
            iconType: 'nzIcon',
            iconTheme: 'outline',
            icon: 'notification',
            staff_only: false,
            submenu: []
        },
        {
            path: '/app/campaign/search-engine',
            title: 'CampSearchEngine',
            iconType: 'nzIcon',
            iconTheme: 'outline',
            icon: 'notification',
            staff_only: false,
            submenu: []
        },
        {
            path: '/app/campaign/top-contributor',
            title: 'CampSponCon',
            iconType: 'nzIcon',
            iconTheme: 'outline',
            icon: 'notification',
            staff_only: false,
            submenu: []
        },
        {
            path: '/app/campaign/sponsored-post',
            title: 'CampSponPost',
            iconType: 'nzIcon',
            iconTheme: 'outline',
            icon: 'notification',
            staff_only: false,
            submenu: []
        }]
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
]
