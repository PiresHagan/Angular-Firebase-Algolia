import { Component, OnInit } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { UserService } from 'src/app/shared/services/user.service';
import { LanguageService } from 'src/app/shared/services/language.service';
import { AuthService } from 'src/app/shared/services/authentication.service';
import { environment } from 'src/environments/environment';
import { Language } from 'src/app/shared/interfaces/language.type';

declare const cloudsponge: any;

@Component({
  selector: 'app-import-contact',
  templateUrl: './import-contact.component.html',
  styleUrls: ['./import-contact.component.scss']
})

export class ImportContactComponent implements OnInit {

  listOfDisplayData = {
    gmail: [],
    yahoo: [],
    windowslive: [],
    aol: []

  };
  validatingThings: boolean = false;
  searchValue = "";
  visible = false;
  listOfData = [];
  checked = false;
  loading = false;
  indeterminate = false;
  currentUser;
  importedContact = {
    gmail: [],
    yahoo: [],
    windowslive: [],
    aol: []
  }
  selectedContacts = {
    gmail: {},
    yahoo: {},
    windowslive: {},
    aol: {}
  }

  providerList = [{
    name: 'gmail',
    title: 'Gmail',
    serverLoadStatus: false,
    providerLoadStatus: false,
    loading: false
  }, {
    name: 'yahoo',
    title: 'Yahoo',
    serverLoadStatus: false,
    providerLoadStatus: false,
    loading: false
  }, {
    name: 'windowslive',
    title: 'Outlook',
    serverLoadStatus: false,
    providerLoadStatus: false,
    loading: false
  }]

  languageList: Language[];
  selectedLanguage: string;

  constructor(
    private userService: UserService, 
    public translate: TranslateService, 
    private router: Router, 
    private authService: AuthService,
    private language: LanguageService,
    private _location: Location
  ) { }

  switchLang(lang: string) {
    this.language.changeLangOnBoarding(lang);
  }

  ngOnInit(): void {
    this.languageList = this.language.geLanguageList();
    this.selectedLanguage = this.language.defaultLanguage;

    const firstProvider = this.providerList[0].name;
    this.setLoadingStatus(firstProvider, true);
    this.userService.getCurrentUser().then((user) => {
      this.currentUser = user;

      this.userService.getContacts(this.currentUser.uid, firstProvider).then((data: any) => {
        this.importedContact[firstProvider] = data?.contacts ? data?.contacts : [];
        this.onAllChecked(true, firstProvider);
        this.providerList[0].serverLoadStatus = true;
        this.setLoadingStatus(firstProvider, false);
      })
    })
  }

  ngAfterViewChecked(): void {
    /* need _canScrollDown because it triggers even if you enter text in the textarea */
    try {
      let _this = this;
      cloudsponge.init({
        // this puts the widget UI inside a div on your page, make sure this element has a height and width
        rootNodeSelector: '#choose-contacts-ui',
        // // since we're using deep links, we are going to suppress the widget's display of sources
        skipSourceMenu: true,

        // callbacks let your page respond to important widget events
        afterLaunch: function () {
          // display a Loading... message
          // if (_this.listOfDisplayData && _this.listOfDisplayData.length)
          //   _this.validatingThings = false;
          // else
          //   _this.validatingThings = true;
        },
        afterClosing: function () {
          // reset the page's UI state so that another import is possible

        },
        beforeClosing: function () {
          _this.resetAllProviderLoader()
        },
        // called before the widget renders the UI with the address book
        beforeDisplayContacts: function (contacts, provider) {

          _this.importedContact[provider] = _this.getFilteredContact(contacts);
          _this.setProviderLoadingStatus(provider, false, true)
          this.onAllChecked(true, provider);
          _this.listOfDisplayData = contacts;
          _this.listOfData = _this.getFilteredContact(contacts);
        },
        // called after the user submits their contacts
        afterSubmitContacts: function (contacts, source, owner) {
          // The user has successfully shared their contacts
          // here's where you can send the user to the next step
        }
      });

    } catch (error) {
      console.log(error);
    }
  }


  refreshCheckedStatus(provider): void {
    this.checked = this.importedContact[provider].every(item => {
      let id = item.fullname + item.email
      this.selectedContacts[provider][id];
    })
    this.indeterminate = this.importedContact[provider].some(item => this.selectedContacts[provider][item.fullname + item.email] && !this.checked);


    //   this.checked = listOfEnabledData.every(({ id }) => this.setOfCheckedId.has(id));
    //   this.indeterminate = listOfEnabledData.some(({ id }) => this.setOfCheckedId.has(id)) && !this.checked;
    //
  }

  onItemChecked(id: string, checked: boolean, provider, data): void {
    this.updateCheckedSet(id, checked, provider, data);
    this.refreshCheckedStatus(provider);
  }

  onAllChecked(checked: boolean, provider): void {
    this.importedContact[provider].forEach((data) => {
      let id = data.fullname + data.email;
      this.updateCheckedSet(id, checked, provider, data)
    });
    this.refreshCheckedStatus(provider);
  }
  updateCheckedSet(id: any, checked: boolean, provider, data): void {
    if (checked) {
      this.selectedContacts[provider][id] = { ...data }
    } else {
      delete this.selectedContacts[provider][id];
    }
    console.log(this.selectedContacts)
    //this.refreshCheckedStatus(provider);
  }
  isChecked(id) {
    return id ? true : false;
  }
  hasSelectedData(provider) {
    return Object.keys(this.selectedContacts[provider]).length

  }

  getContactList(provider) {
    let serverContacts = []
    if (this.selectedContacts[provider]) {
      let selectedData = this.selectedContacts[provider];
      for (const key in selectedData) {
        if (selectedData.hasOwnProperty(key)) {
          const data = selectedData[key];
          if (data.email)
            serverContacts.push({ fullname: data.fullname ? data.fullname : '', email: data.email })
        }
      }
    }
    return serverContacts;
  }
  getFilteredContact(contacts) {
    let filteredContact = []
    contacts.forEach((data) => {
      if (data?.email[0])
        filteredContact.push({ fullname: data.first_name + data.last_name, email: data?.email[0]?.address })

    });
    return filteredContact;
  }
  loadCotactsFromServer(provider) {
    if (!this.getServerLoadStatus(provider)) {
      this.setLoadingStatus(provider, true);
      this.userService.getContacts(this.currentUser.uid, provider).then((data: any) => {
        this.importedContact[provider] = data?.contacts ? data?.contacts : [];
        this.onAllChecked(true, provider);
        this.setServerLoadStatus(provider);
        this.setLoadingStatus(provider, false);
      })
    } else {
      console.log('contacts are already loaded');
    }

  }
  setServerLoadStatus(provider, state = true) {
    this.providerList.forEach(element => {
      if (provider && element.name === provider)
        element.serverLoadStatus = state
    });
  }
  getServerLoadStatus(provider) {
    let serverLoadStatus = false;
    this.providerList.forEach(element => {
      if (provider && element.name === provider)
        serverLoadStatus = element.serverLoadStatus
    });
    return serverLoadStatus;
  }
  setLoadingStatus(provider, state = true) {
    this.providerList.forEach(element => {
      if (provider && element.name === provider)
        element.loading = state
    });
  }
  setProviderLoadingStatus(provider, loadignState, providerLoadStatus = false) {
    this.providerList.forEach(element => {
      if (provider && element.name === provider && !element.providerLoadStatus) {
        element.loading = loadignState
      } else if (element.name === provider && providerLoadStatus) {
        element.providerLoadStatus = true;
        element.loading = loadignState
      }

    });
  }
  resetAllProviderLoader() {
    this.providerList.forEach(element => {
      element.loading = false
    });
  }

  sendInvite(contact, providerName: string) {
    contact['isSendingInvite'] = true;

    const body = {
      provider: providerName,
      email: contact.email,
      fullname: contact.fullname ? contact.fullname : ''
    };

    this.userService.sendInvitation(this.currentUser.uid, body).then( response => {
      contact['isSendingInvite'] = false;
      contact['isInvited'] = true;
    }).catch( err => {
      contact['isSendingInvite'] = false;
    })
  }

  backClicked() {
    this._location.back();
  }

}
