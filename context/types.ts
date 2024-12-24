export type ErrCallbackType = (err: { [key: string]: string } | string) => void;

export type LoginParams = {
  email: string;
  password: string;
};

export type RegisterParams = {
  email: string;
  username: string;
  password: string;
};

export type UserDataType = {
  id: number;
  roles: string[];
  permission: string[];
  email: string;
  name: string;
  username: string;
  password: string;
  avatar?: string | null;
  phone ?:string | undefined
};

export type AuthValuesType = {
  loading: boolean;
  setLoading: (value: boolean) => void;
  logout: () => void;
  isInitialized: boolean;
  user: UserDataType | null | undefined;
  setUser: (value: UserDataType | null) => void;
  setIsInitialized: (value: boolean) => void;
  login: (params: LoginParams, errorCallback?: ErrCallbackType) => void;
  register: (params: RegisterParams, errorCallback?: ErrCallbackType) => void;
  metaData: any;
  activeTenant?: any;
  activeUser?:any;
  tenants?: any[];
  users?:any[]
  setTenantsData: (value: any) => void;
  setActiveTenant: (value: any) => void;
  setActiveUser: (value: any) => void;
  accessToken: string | null;
  setAccessToken: (value: any) => void;
  activeHeaderTab: string;
  setActiveHeaderTab: (value: string) => void;
  refresh:boolean;
  setRefresh:(value: boolean) => void;
};
