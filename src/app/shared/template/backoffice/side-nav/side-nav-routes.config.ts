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
        path: '/app/article/articles',
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
        title: 'Charities',
        iconType: 'nzIcon',
        iconTheme: 'outline',
        icon: 'notification',
        staff_only: false,
        submenu: []
    },
    {
        path: '/app/fundraiser/fundraiser-list',
        title: 'Fundraisers',
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

    {
        path: '/app/social-sharing/post-list',
        title: 'Social Sharing',
        iconType: 'nzIcon',
        iconTheme: 'outline',
        icon: 'notification',
        staff_only: false,
        submenu: []
    },
    {
        path: '',
        title: 'Store',
        iconType: 'nzIcon',
        iconTheme: 'outline',
        icon: 'shopping-cart',
        staff_only: false,
        submenu: [
            {
                path: '/app/shop/sellproducts/product-list',
                title: 'Product List',
                iconType: 'nzIcon',
                iconTheme: 'outline',
                icon: 'skin',
                staff_only: false,
                submenu: []
            },
            {
                path: '/app/shop/sellproducts/store-settings',
                title: 'Store Setting',
                iconType: 'nzIcon',
                iconTheme: 'outline',
                icon: 'setting',
                staff_only: false,
                submenu: []
            },
            {

                path: '/app/shop/sellproducts/order-list',
                title: 'Order List',
                iconType: 'nzIcon',
                iconTheme: 'outline',
                icon: 'down-square',
                staff_only: false,
                submenu: []
            }
        ]
    },
    {
        path: '/app/shop/myorders/my-order-list',
        title: 'My Orders',
        iconType: 'nzIcon',
        iconTheme: 'outline',
        icon: 'skin',
        staff_only: false,
        submenu: [


        ]
    },
    {
        path: 'app/ad-network/sites',
        title: 'Ad Network',
        iconType: 'nzIcon',
        iconTheme: 'outline',
        icon: 'notification',
        staff_only: false,
        submenu: [
            // {
            //     path: 'ad-network/sites',
            //     title: 'My Sites',
            //     iconType: 'nzIcon',
            //     iconTheme: 'outline',
            //     icon: 'crown',
            //     staff_only: false,
            //     submenu: []
            // }
        ]
    },
    {
        path: '/app/agency',
        title: 'Agency',
        iconType: 'nzIcon',
        iconTheme: 'outline',
        icon: 'skin',
        staff_only: false,
        submenu: [


        ]
    },
    {
        path: '/app/newsletter',
        title: 'Newsletter',
        iconType: 'nzIcon',
        iconTheme: 'outline',
        icon: 'mail',
        staff_only: false,
        submenu: [


        ]
    },
    {
        path: '/app/business-funding',
        title: 'BusinessFunding',
        iconType: 'nzIcon',
        iconTheme: 'outline',
        icon: 'dollar',
        staff_only: false,
        submenu: [


        ]
    },
    {
        path: '',
        title: 'ECommerceFundingandAdvertising',
        iconType: 'nzIcon',
        iconTheme: 'outline',
        icon: 'shopping-cart',
        staff_only: false,
        submenu: [
            {
                path: '/app/e-commerce-funding',
                title: 'ECommerceFundingandAdvertising',
                iconType: 'nzIcon',
                iconTheme: 'outline',
                icon: 'shopping-cart',
                staff_only: false,
                submenu: []
            },
            {
                path: '',
                title: 'EcommerceAdvertising',
                iconType: 'nzIcon',
                iconTheme: 'outline',
                icon: 'shopping-cart',
                staff_only: false,
                submenu: []
            },

        ]
    },
    {
        path: '/app/merchant-processing',
        title: 'MerchantProcessing',
        iconType: 'nzIcon',
        iconTheme: 'outline',
        icon: 'credit-card',
        staff_only: false,
        submenu: [


        ]
    },
    {
        path: '/app/bitcoin-store',
        title: 'BitcoinStore',
        iconType: 'nzIcon',
        iconTheme: 'outline',
        icon: 'bold',
        staff_only: false,
        submenu: [


        ]
    }
]
