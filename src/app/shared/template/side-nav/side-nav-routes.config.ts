import { SideNavInterface } from '../../interfaces/side-nav.type';
export const ROUTES: SideNavInterface[] = [
    {
        path: 'app/settings/profile-settings',
        title: 'myAccountSettings',
        iconType: 'nzIcon',
        iconTheme: 'outline',
        icon: 'lock',
        submenu: []
    },
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