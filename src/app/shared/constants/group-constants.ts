export class GroupConstant {
   
    public static GroupSubscription = [
        {
            value:0,
            label:"Free"},
        {
            value: 100,
            label:"100 $ / month"},
        {
            value: 1000,
            label:"1000 $ / year"},
        {
            value: 100000,
            label: "100,000$ / years"}
    ];

    public static GroupTypes = ["Male","Female","Mix"];

    public static GroupSize = [3,5,7,9];
   
    public static GroupStatus=['CREATED' , 'VERIFIED', 'ABUSED'];

    public static FemaleGroupCoverImages=['girls_group.jpeg','girls_group_5.jpeg','girls_group_7.jpeg','girls_group_7.jpeg']
    public static MaleGroupCoverImages=['boys_3.jpeg','boys_5.jpeg','boys_multiple.jpeg','boys_multiple.jpeg'];
    public static MixGroupCoverImage=['mix_group.jpeg'];

    public static STATUS_ACTIVE = "active";
    public static STATUS_INACTIVE = "inactive";
    public static MONTHLY_GROUP_PACKAGE={
      external_id:"price_1NEVDzLir9iBf0ywljFdXAL8",
      id: "1",
      price: 100,
      customer_type:"group",
      package_type:"Month"
    };
    public static YEARLY_GROUP_PACKAGE={
      external_id:"price_1NEVHzLir9iBf0ywMeqKgSse",
      id: "2",
      price: 1000,
      customer_type:"group",
      package_type: "Year"
  
  
    };
    public static FOREVERPRICE=10000
    public static YEARLY_PACKAGES=[
        {
            price:100,
            external_id:"price_1NIWrtLir9iBf0ywTiCij3ec",
            title:"100_year"
        },
        {
            price:1000,
            external_id:"price_1NEVHzLir9iBf0ywMeqKgSse",
            title:"1000_year"
        },
        {
            price:10000,
            external_id:"price_1NIWsvLir9iBf0ywYL3nmefw",
            title:"10000_year"
        },
        {
            price:100000,
            external_id:"price_1NIWu7Lir9iBf0ywb8EkmTEP",
            title:"100000_year"

        },
        {
            price:1000000,
            external_id:"price_1NIWvSLir9iBf0ywLhB1O2zi",
            title:"1000000_year"
        }
    ];

    
    
}