export class HairSalonConstant {

  public static FREE_LEAD_COUNT = 5;

  public static STATUS_ACTIVE = "active";
  public static STATUS_INACTIVE = "inactive";

  public static LEAD_PACKAGE = "hair-salon-lead-package";
  public static PUBLIC_PROFILE_PACKAGE = "hair-salon-general-package";

  public static MEN = "Men";
  public static WOMEN = "Women";
  public static MENWOMEN = "MenWomen";

  public static HAIR_SALON_TYPES = {MEN: "Men Barbershop",
  WOMEN:"Women Hairdresser",
    MENWOMEN:"Men Barbershop & Women Hairdresser"
  };

  public static ATSALON = "at salon only";
  public static ATCLIENTHOME = "at client home only";
  public static ATSALONATCLIENTHOME = "at salon & at client home";

  public static HAIR_SALON_DELIVER_SERVICES_TYPES = {ATSALON: "at salon only",
  ATCLIENTHOME:"at client home only",
  ATSALONATCLIENTHOME:"at salon & at client home"
  };

  public static ATSALOND = "at salon";
  public static ATCLIENTHOMED = "at my address";

  public static HAIR_SALON_RECEIVE_SERVICES_TYPES = {ATSALOND: "at salon",
  ATCLIENTHOMED:"at my address"
  };

}
