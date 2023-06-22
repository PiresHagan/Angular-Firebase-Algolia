export class EventHostConstant {
   
    public static GroupSize = [3,5,7];
    public static EventTypes=[
        "Restaurant","Lounge","Dating","SpeedDating","GameNight","HomeFoodCook","Discussion",
        "Debate","Concert","Travel","Sports","Running","Business","Politics","Religion","Random"
    ];
    // these are 
    public static TypesImages=[
        "restaurants","lounge","dating","speedDating","gameNight","homeFoodCook",'discussion',
        'debate','concert','travel','sports','running','business','politics','religion','random'
    ];
    public static IMAGE_EXTENSION = ".png";
    public static ImageBackgroung = "home_background";
    public static GroupTypes = ["Male","Female","Mix"];
     
    public static UNPUBLISHED = {
       title: "UnPublished",
       color: "#d9534f"
    };
    public static PUBLISHED = {
        title: "Published",
        color: "#5cb85c"
     };
    public static SCHEDULED = {
        title: "On Scedule",
        color: "#85634"

    };
    public static Missed = {
        title: "Missed",
        color: "#9654"
    };
    public static Done = {
        title: "Done",
        color: "#1459"
    };
}