export const initialState: any = {
  isGetting: true,
  isCategory: true,
  isLoading: true,
  user: {},
  isLogout: false,
  currentLocation: {},
  linkInviteFriend: '',
  userType: '',
  isDoctor: false,
};

export const enum TYPES {
  SHOW_GETTING_START = 'SHOW_GETTING_START',
  SHOW_CATEGORY = 'SHOW_CATEGORY',
  SET_USER = 'SET_USER',
  LOGOUT_APP = 'LOGOUT_APP',
  SET_LOCATION = 'SET_LOCATION',
}

type ACTIONTYPE =
  | { type: TYPES.SET_USER; payload: object }
  | { type: TYPES.LOGOUT_APP; payload: boolean }
  | { type: TYPES.SHOW_GETTING_START; payload: boolean }
  | { type: TYPES.SHOW_CATEGORY; payload: boolean }
  | { type: TYPES.SET_LOCATION; payload: object };

export const enum UserTypes {
  doctor = 'doctor',
  nurse = 'nurse',
  student = 'student',
  user = 'user',
  expert_other = 'expert_other',
  other = 'other',
}

export function rootReducer(
  prevState: typeof initialState,
  action: ACTIONTYPE,
) {
  switch (action.type) {
    case TYPES.SHOW_GETTING_START:
      return { ...prevState, isGetting: action.payload };
    case TYPES.SHOW_CATEGORY:
      return { ...prevState, isCategory: action.payload };
    case TYPES.SET_USER:
      const currentUser: any = action.payload;
      const type: UserTypes = currentUser?.personalization?.type
        ? currentUser.personalization.type?.toLowerCase()
        : UserTypes.other;
      return {
        ...prevState,
        user: action.payload,
        userType: type,
        isLoading: false,
        isDoctor: type == UserTypes.doctor || type == UserTypes.nurse,
        isNurse: type == UserTypes.nurse,
        isExpertOther: type == UserTypes.expert_other,
      };
    case TYPES.SET_LOCATION:
      return { ...prevState, currentLocation: action.payload };
    case TYPES.LOGOUT_APP:
      return {
        ...prevState,
        isLogout: action.payload,
        user: {},
        isLoading: false,
        linkInviteFriend: '',
        userType: '',
        isDoctor: false,
      };
    default:
      throw new Error();
  }
}
