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
    // {
    //     path: '/app/article/articles',
    //     title: 'myArticles',
    //     iconType: 'nzIcon',
    //     iconTheme: 'outline',
    //     icon: 'crown',
    //     staff_only: false,
    //     submenu: []
    // },
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
            path: '/app/campaign/buy-search-engine',
            title: 'CampSearchEngine',
            iconType: 'nzIcon',
            iconTheme: 'outline',
            icon: 'notification',
            staff_only: false,
            submenu: []
        },
        {
            path: '/app/campaign/buy-top-contributor',
            title: 'CampSponCon',
            iconType: 'nzIcon',
            iconTheme: 'outline',
            icon: 'notification',
            staff_only: false,
            submenu: []
        },
        {
            path: '/app/campaign/buy-sponsored-post',
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
        title: 'AdminCenter',
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
            },
            // {
            //     path: '/app/admin/ad-network',
            //     title: 'Ad network',
            //     iconType: 'nzIcon',
            //     iconTheme: 'outline',
            //     icon: 'lock',
            //     staff_only: true,
            //     submenu: []
            // }
        ]
    },
    {
        path: '/app/company/company-list',
        title: 'CompanyList',
        iconType: 'nzIcon',
        iconTheme: 'outline',
        icon: 'notification',
        staff_only: false,
        submenu: []
    },
    {
        path: '/app/charity/charity-list',
        title: 'charitiesTitle',
        iconType: 'nzIcon',
        iconTheme: 'outline',
        icon: 'notification',
        staff_only: false,
        submenu: []
    },
    {
        path: '/app/fundraiser/fundraiser-list',
        title: 'fundraisers',
        iconType: 'nzIcon',
        iconTheme: 'outline',
        icon: 'notification',
        staff_only: false,
        submenu: []
    },
    // {
    //     path: 'app/ad-network',
    //     title: 'Ad Network',
    //     iconType: 'nzIcon',
    //     iconTheme: 'outline',
    //     icon: 'notification',
    //     staff_only: false,
    //     submenu: [
    //         {
    //             path: 'ad-network/sites',
    //             title: 'My Sites',
    //             iconType: 'nzIcon',
    //             iconTheme: 'outline',
    //             icon: 'crown',
    //             staff_only: false,
    //             submenu: []
    //         }
    //     ]
    // }
]
