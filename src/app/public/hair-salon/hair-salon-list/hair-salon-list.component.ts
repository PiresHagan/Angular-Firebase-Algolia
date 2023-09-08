import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HairSalonService } from 'src/app/shared/services/hair-salon.service';
import {CountriesConstant} from 'src/app/shared/constants/countries';

import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { HairSalonConstant } from 'src/app/shared/constants/hair-salon-constant';
@Component({
  selector: 'app-hair-salon-list',
  templateUrl: './hair-salon-list.component.html',
  styleUrls: ['./hair-salon-list.component.scss']
})
export class HairSalonListComponent implements OnInit {
  hairSalonsData: any[];
  lastVisible: any = null;
  lastPage: number = 0;
  hairSalonLoading: boolean;
  loadingMore: boolean;
  isSearchByCountry: boolean = false;
  isSearchByName: boolean = true;
  isSearchByhairSalonType: boolean = false;
  isSearchByhairSalonDeliverServicesType: boolean = false;
  nameSearchTerm : string = null;
  countrySearchTerm : string = null;
  citySearchTerm : string = null;
  serviceDeliverTypeSearchTerm : string = null;
  hairSalonTypeSearchTerm  : string = null;
  searchForm: FormGroup;
  searchresValue: string='';
  citySearchresValue: string='';
  searchfield: any = 'name';
  isSearch: boolean = false;
  countriesList:any;
  hairSalonTypesList:any;
  hairSalonDeliverServicesTypesList:any;

  constructor(
    private translate: TranslateService,
    private hairSalonService: HairSalonService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.countriesList = CountriesConstant.Countries;
    this.hairSalonTypesList = HairSalonConstant.HAIR_SALON_TYPES;
    this.hairSalonDeliverServicesTypesList = HairSalonConstant.HAIR_SALON_DELIVER_SERVICES_TYPES;
    window.addEventListener('scroll', this.scrollEvent, true);
    this.getHairSalons();
    this.searchForm = this.fb.group({
      hairSalonssearchform: "",
    });
  }

  async getHairSalons (){
    this.hairSalonLoading = true;
    if(this.isSearch && !(this.citySearchTerm == null && this.countrySearchTerm == null && this.hairSalonTypeSearchTerm == null && this.serviceDeliverTypeSearchTerm == null)){
      this.hairSalonService.searchHairSalons(100,
        '',
        this.lastVisible,
        this.nameSearchTerm,
        this.countrySearchTerm,
        this.citySearchTerm,
        this.serviceDeliverTypeSearchTerm,
        this.hairSalonTypeSearchTerm).subscribe((data) => {
        this.hairSalonsData = data.hairSalonList;
        this.lastVisible = data.lastVisible;
        this.hairSalonLoading = false;
      });
    }
    else if(this.isSearch && this.nameSearchTerm != null){
      await this.hairSalonService.searchHairSalonsByAlgolia(null,
        '',
        this.lastPage,
        this.nameSearchTerm).then((searchRes)=>{
          this.hairSalonsData = searchRes.hairSalonList;
          this.lastPage = searchRes.lastPage;
        }).finally(()=>{
          this.hairSalonLoading = false;
        });
    }
    else{
      this.hairSalonService.getAllHairSalons().subscribe((data) => {
        this.hairSalonsData = data.hairSalonList;
        this.lastVisible = data.lastVisible;
        this.lastPage = 0;
        this.hairSalonLoading = false;
      });
    }

  }

  getsearchfield(searchfield: any) {
    this.searchfield = searchfield;
    if (searchfield === "location") {
      this.isSearchByCountry = true;
      this.isSearchByName = false;
      this.isSearchByhairSalonType = false;
      this.isSearchByhairSalonDeliverServicesType = false;
      this.searchfield = "country";
      this.nameSearchTerm=null;
      this.serviceDeliverTypeSearchTerm=null;
      this.hairSalonTypeSearchTerm = null;
    } else if(searchfield === "name") {
      this.isSearchByCountry = false;
      this.isSearchByName = true;
      this.isSearchByhairSalonType = false;
      this.isSearchByhairSalonDeliverServicesType = false;
      this.searchfield = "name";
      this.citySearchTerm=null;
      this.countrySearchTerm=null;
      this.serviceDeliverTypeSearchTerm=null;
      this.hairSalonTypeSearchTerm = null;
    } else if(searchfield === "type") {
      this.isSearchByCountry = false;
      this.isSearchByName = false;
      this.isSearchByhairSalonType = true;
      this.isSearchByhairSalonDeliverServicesType = false;
      this.searchfield = "type";
      this.citySearchTerm=null;
      this.countrySearchTerm=null;
      this.serviceDeliverTypeSearchTerm=null;
    } else if(searchfield === "serviceDeliverType") {
      this.isSearchByCountry = false;
      this.isSearchByName = false;
      this.isSearchByhairSalonType = false;
      this.isSearchByhairSalonDeliverServicesType = true;
      this.searchfield = "serviceDeliverType";
      this.citySearchTerm=null;
      this.countrySearchTerm=null;
      this.hairSalonTypeSearchTerm = null;
    }
  }
  onCountryChange(selectedValue) {
    this.countrySearchTerm = selectedValue;
  }
  onCityChange(value) {
    this.citySearchTerm = value;
  }

  onHairSalonTypeChange(selectedValue) {
    this.hairSalonTypeSearchTerm = selectedValue;
    this.hairSalonssearch();
  }

  onServiceDeliverTypeChange(selectedValue) {
    this.serviceDeliverTypeSearchTerm = selectedValue;
    this.hairSalonssearch();
  }
  getsearchres(searchres:any){
    this.nameSearchTerm = searchres;
  }

  isEmptyOrSpaces(str){
    if(str==undefined || str=='undefined')
      return true;
    else return str === null || str.match(/^ *$/) !== null;
  }

  hairSalonssearch(){
    if(this.isEmptyOrSpaces(this.nameSearchTerm)) this.nameSearchTerm = null;
    if(this.isEmptyOrSpaces(this.countrySearchTerm)) this.countrySearchTerm = null;
    if(this.isEmptyOrSpaces(this.citySearchTerm)) this.citySearchTerm = null;
    if(this.isEmptyOrSpaces(this.hairSalonTypeSearchTerm)) this.hairSalonTypeSearchTerm = null;
    if(this.isEmptyOrSpaces(this.serviceDeliverTypeSearchTerm)) this.serviceDeliverTypeSearchTerm = null;
    if(this.searchresValue == null && this.citySearchTerm == null && this.countrySearchTerm == null && this.serviceDeliverTypeSearchTerm == null && this.serviceDeliverTypeSearchTerm == null){
      this.resetSearch();
      return;
    }
    this.isSearch=true;
    this.getHairSalons();
  }

  resetSearch(){
    this.nameSearchTerm=null;
    this.citySearchTerm=null;
    this.countrySearchTerm=null;
    this.hairSalonTypeSearchTerm = null;
    this.serviceDeliverTypeSearchTerm = null;
    this.searchForm.reset();
    this.searchForm = this.fb.group({
      hairSalonssearchform: "",
    });
    this.isSearch=false;
    this.getHairSalons();
  }


  scrollEvent = async (event: any): Promise<void> => {
    const today = new Date();
    let documentElement = event.target.documentElement ? event.target.documentElement : event.target;
    if (documentElement) {
      const top = documentElement.scrollTop
      const height = documentElement.scrollHeight
      const offset = documentElement.offsetHeight
      if (top > height - offset - 1 - 100 && this.lastVisible && !this.loadingMore) {
        this.loadingMore = true;
        if(this.isSearch && !(this.citySearchTerm == null && this.countrySearchTerm == null)){
          this.hairSalonService.searchHairSalons(null,
            'next',
            this.lastVisible,
            this.nameSearchTerm,
            this.countrySearchTerm,
            this.citySearchTerm,
            this.hairSalonTypeSearchTerm,
            this.serviceDeliverTypeSearchTerm).subscribe((data) => {
            this.hairSalonsData = data.hairSalonList;
            this.lastVisible = data.lastVisible;
            this.hairSalonLoading = false;
          });
        }
        else if(this.isSearch && this.nameSearchTerm != null){
          await this.hairSalonService.searchHairSalonsByAlgolia(null,
            'next',
            this.lastPage + 1,
            this.nameSearchTerm).then((searchRes)=>{
              this.hairSalonsData = searchRes.hairSalonList;
              this.lastPage = searchRes.lastPage;
            }).finally(()=>{
              this.hairSalonLoading = false;
            });
        }
        else{
          this.hairSalonService.getAllHairSalons(null, 'next', this.lastVisible).subscribe((data) => {
            if (data &&
              data.hairSalonList &&
              data.hairSalonList[0]
              && data.hairSalonList.length > 1)
              {
                this.loadingMore = false;
                let hairSalonsDataNew = data.hairSalonList;
                this.hairSalonsData = [...this.hairSalonsData, ...hairSalonsDataNew];
                this.lastVisible = data.lastVisible;
                this.lastPage = 0;
                this.hairSalonLoading = false;
              }
          });
        }
      }
    }
  }
}
