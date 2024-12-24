// ** React Imports
import { createContext, useEffect, useState, ReactNode } from "react";

// ** Next Import
import { useRouter } from "next/router";

// ** Types
import {
  AuthValuesType,
  LoginParams,
  ErrCallbackType,
  UserDataType,
} from "./types";

import AppApi, { setAuthToken } from "../utils/AppApi";
import { globalNotify } from "../helper/serverErrorHandler";
import { AppConfig, AuthConfig, useAppConfig } from "@wiznox/common";

// Define the type for the tenant object
export interface TenantData {
  id: number;
  name: string;
}

// Define the type for the user object
export interface UserData {
  createdAt: string; // ISO 8601 date string
  default: boolean;
  deletedAt: string | null; // Can be a date string or null
  email: string;
  id: number;
  name: string;
  phone: string;
  roles: string[]; // Array of role strings
  tenant: TenantData;
  tenantId: number;
  updatedAt: string; // ISO 8601 date string
  uuid: string; // UUID string
}

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  isInitialized: false,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  setIsInitialized: () => Boolean,
  register: () => Promise.resolve(),
  metaData: null,
  activeTenant: {},
  tenants: [],
  setActiveTenant: () => null,
  accessToken: null,
  setAccessToken: () => null,
  setTenantsData: () => null,
  activeHeaderTab: "",
  setActiveHeaderTab: () => null,
  refresh: false,
  setRefresh: () => Boolean,
  setActiveUser:()=>null,
  users:[],
  activeUser:{}
};

interface metaDataType {
  [key: string]: any;
}

const AuthContext = createContext(defaultProvider);

type Props = {
  children: ReactNode;
  authConfig: AppConfig["authConfig"];
};

const AuthProvider = ({ children, authConfig }: Props) => {
  // ** States
  const [user, setUser] = useState<UserDataType | null | undefined>(
    defaultProvider.user
  );
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading);
  const [isInitialized, setIsInitialized] = useState<boolean>(
    defaultProvider.isInitialized
  );
  const [metaData, setMetaData] = useState<metaDataType>(defaultProvider.metaData);

  const [activeTenant, setActiveTenant] = useState<any>(null);
  const[activeUser,setActiveUser]=useState<any>(null);
  const[usersData,setUsersData]=useState<any>([])
  const [tenantsData, setTenantsData] = useState<any[]>([]);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [activeHeaderTab, setActiveHeaderTab] = useState<string>(
    defaultProvider.activeHeaderTab
  );
  const [refresh, setRefresh] = useState<boolean>(defaultProvider.refresh);

  // ** Hooks
  const router = useRouter();

  const {
    appConfig: { getHomeRoute },
  } = useAppConfig();

  const metaFetcher = async () => {
    setLoading(true);
    const metaResponse = await AppApi()?.get(
      authConfig?.metaDataEndpoint ?? ""
    );

    if (metaResponse?.ok) {
       setMetaData(metaResponse?.data);
      setLoading(false);

      return metaResponse;
    }
  };

  const meFetcher = async (type: "init" | "login") => {
    setLoading(true);
    //**me fetch */
    const response = await AppApi()?.get(authConfig?.meEndpoint ?? "");
    if (response?.ok) {
      await metaFetcher();
      const returnUrl = router?.query?.returnUrl;

      setUser({ ...response?.data.data });
      await window.localStorage.setItem(
        "userData",
        JSON.stringify(response?.data.data)
      );

      if (response?.data?.data?.tenant) {
        setActiveTenant({ ...response?.data?.data?.tenant });
        localStorage.setItem(
          "activeTenant",
          JSON.stringify(response?.data?.data?.tenant)
        );
     if(response?.data?.data?.roles[0] === 'admin'){
userFetcher("init")
     }
      }

      if(response?.data?.data?.ImpersonatedUser)
        {
          setActiveUser({...response?.data?.data?.ImpersonatedUser})
          localStorage.setItem(
            "activeUser",
            JSON.stringify(response?.data?.data?.ImpersonatedUser)
          );
        }
      if (type == "login") {
        const redirectURL =
          returnUrl && returnUrl !== "/"
            ? returnUrl
            : getHomeRoute(response?.data?.data?.roles);

        router.replace(redirectURL as string);
      }

      setLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      meFetcher("init");
    }
  }, [accessToken]);

  const tenantFetcher = (type: "init" | "login") => {
    setLoading(true);
    AppApi()
      ?.get(`/api/tenants?records_per_page=500`)
      .then((response) => {
        if (response?.ok) {
          setTenantsData(response?.data?.data);
          meFetcher(type);
          setLoading(false);
        }
      });
  };
const userFetcher=(type:'init' | 'login')=>{
  setLoading(true);
  AppApi()
    ?.get(`/api/users?records_per_page=500`)
    .then((response) => {
      if (response?.ok) {
        setUsersData(response?.data?.data);
        // meFetcher(type);
        setLoading(false);
      }
    });
}

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      setIsInitialized(true);
      const storedToken = window.localStorage.getItem(
        authConfig?.storageTokenKeyName ?? ""
      )!;

      // const activeTenant=window.localStorage.getItem('activeTenant')
      await setAuthToken(storedToken);

      if (storedToken) {
        //**tenant fetcher */
        tenantFetcher("init");
        if(activeTenant && user?.roles[0]=== 'admin')
        {
          userFetcher("init")
        }
      } else if (router?.query?.token) {
        await setAuthToken(router?.query?.token as string);

        //**tenant fetcher */
        tenantFetcher("init");
        if(activeTenant  && user?.roles[0]=== 'admin')
          {
            userFetcher("init")
          }
      } else {
        setLoading(false);
      }
    };

    if (!router.isReady) return;

    initAuth();
  }, [router.isReady, refresh]);

  // console.log('router',router)
  useEffect(() => {
    // Request interceptor
    const requestInterceptor = AppApi()?.axiosInstance.interceptors.request.use(
      (request) => {
        // Do something here with request if you need to

        // request.params['delay'] = true
        return request;
      }
    );

    // Response interceptor
    const responseInterceptor = AppApi()?.axiosInstance.interceptors.response?.use(
      (response) => {
        // Handle response here
        return response;
      },
      (error: any) => {
        // Handle errors here
        if (error.response?.status) {
          switch (error.response?.status) {
            case 401:
              // Handle Unauthenticated here
              setLoading(false);
              globalNotify("401 : Unauthorized", "error");
              handleLogout();
              break;
            case 403:
              // Handle Unauthorized here
              break;

            default:
              break;
          }
        }

        return error;
      }
    );

    return () => {
      // Remove handlers here
      AppApi()?.axiosInstance.interceptors.request.eject(
        requestInterceptor as any
      );
      AppApi()?.axiosInstance.interceptors.response?.eject(
        responseInterceptor as any
      );
    };
  }, []);

  const handleLogin = (
    params: LoginParams,
    errorCallback?: ErrCallbackType
  ) => {
    AppApi()
      ?.post(authConfig?.loginEndpoint ?? "", params)
      .then(async (res) => {
        if (res.ok) {
          window.localStorage.setItem(
            authConfig?.storageTokenKeyName ?? "",
            res.data.accessToken
          );
          await setAuthToken(res.data.accessToken);

          //***-------------Updated for Jump Start----------------- */
          const response = await metaFetcher();
          if (response?.ok) {
            const { steps } = response?.data ?? {};

            const foundIncompleteStep = steps?.find(
              (item: any) => item.completed == false
            );

            if (foundIncompleteStep) {
              router.replace(`/business-setup?token=${res.data.accessToken}`);

              //**<---------------------me fetch-----------------------> */
              const response = await AppApi()?.get(
                authConfig?.meEndpoint ?? ""
              );
              if (response?.ok) {
                setUser({ ...response?.data.data });
                await window.localStorage.setItem(
                  "userData",
                  JSON.stringify(response?.data.data)
                );
              }
              //**<---------------------me fetch-----------------------> */
            } else {
              //**tenant fetcher */
              tenantFetcher("login");
            }
          }
          //***-------------Updated for Jump Start----------------- */
        } else {
          if (errorCallback) errorCallback(res.problem);
        }
      });
  };

  const handleLogout = () => {
    setUser(null);
    setMetaData(defaultProvider?.metaData);
    setIsInitialized(false);
    setAccessToken(null);
    setActiveTenant(null);
    setActiveUser(null);
    setTenantsData([]);
    setActiveHeaderTab("");
    window.localStorage.removeItem("userData");
    window.localStorage.removeItem(authConfig?.storageTokenKeyName ?? "");
    router.push("/login");
    window.localStorage.removeItem("currentTab");
    window.localStorage.removeItem("nestedCurrentTab");
    window.localStorage.removeItem("activeTenant");
    window.localStorage.removeItem("activeUser");
    window.localStorage.removeItem("tenant-token");
    AppApi()?.deleteHeader("tenant-token");
    AppApi()?.deleteHeader("Authorization")
  };


  //**Temprary Solution for log issue/bug */
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData') as string)
    if (!userData) {
      setTimeout(() => {
        handleLogout()
      }, 300);
    }
  }, [user]);
  //**Temprary Solution for log issue/bug */

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    isInitialized,
    setIsInitialized,
    login: handleLogin,
    logout: handleLogout,
    register: () => Promise.resolve(),
    metaData,
    activeTenant,
    setActiveTenant,
    tenants: tenantsData,
    setTenantsData,
    accessToken,
    setAccessToken,
    activeHeaderTab,
    setActiveHeaderTab,
    setRefresh,
    refresh,
    setActiveUser,
    users:usersData,
    activeUser
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
