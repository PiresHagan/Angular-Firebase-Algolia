import { SideNavInterface } from '../../interfaces/side-nav.type';
export const ROUTES: SideNavInterface[] = [
    {
        path: '/app/article',
        title: 'myArticles',
        iconType: 'nzIcon',
        iconTheme: 'outline',
        icon: 'crown',
        submenu: []
    },
    {
        path: '/app/campaign/campaign-manager',
        title: 'Campaigns',
        iconType: 'nzIcon',
        iconTheme: 'outline',
        icon: 'notification',
        submenu: []
    },

    {
        path: '/app/settings/profile-settings',
        title: 'myAccountSettings',
        iconType: 'nzIcon',
        iconTheme: 'outline',
        icon: 'lock',
        submenu: []
    }

    // {
    //     path: '',
    //     title: 'Multi Level Menu',
    //     iconType: 'nzIcon',
    //     iconTheme: 'outline',
    //     icon: 'appstore',
    //     submenu: [
    //         { 
    //             path: '',
    //             title: 'Level 1', 
    //             iconType: '', 
    //             icon: '',
    //             iconTheme: '',
    //             submenu: [
    //                 {
    //                     path: '',
    //                     title: 'Level 2',
    //                     iconType: 'nzIcon',
    //                     iconTheme: 'outline',
    //                     icon: 'layout',
    //                     submenu: []
    //                 }    
    //             ] 
    //         }
    //     ]
    // }
]

export const ADMIN_ROUTES: SideNavInterface[] = [
    {
        path: '/app/admin/article',
        title: 'allArticles',
        iconType: 'nzIcon',
        iconTheme: 'outline',
        icon: 'crown',
        submenu: []
    },
    {
        path: '/app/admin/member',
        title: 'memberSettings',
        iconType: 'nzIcon',
        iconTheme: 'outline',
        icon: 'lock',
        submenu: []
    },
    {
        path: '/app/settings/profile-settings',
        title: 'myAccountSettings',
        iconType: 'nzIcon',
        iconTheme: 'outline',
        icon: 'lock',
        submenu: []
    }
]