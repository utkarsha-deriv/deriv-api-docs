import moment from 'moment';
import { IUserLoginAccount } from '../contexts/auth/auth.context';
import { DEFAULT_WS_SERVER, LOCALHOST_APP_ID, VERCEL_DEPLOYMENT_APP_ID } from './constants';

/**
 *
 * @returns {boolean} return true if the window hostname contains `localhost`
 */
export const getIsLocalhost = () => {
  return window.location.hostname.includes('localhost') ? true : false;
};

/**
 * @description based on the environment which the project is running we must use different appIds, to get the proper redirect url
 * @param isLocalHost {boolean} pass `true` if the project is running on localhost
 * @returns {string} proper appId for the project
 */
export const getAppId = (isLocalHost: boolean) => {
  return isLocalHost ? LOCALHOST_APP_ID : VERCEL_DEPLOYMENT_APP_ID;
};

/**
 * @description use this when you wanna check if the application is running on browser (not ssr)
 * @returns {boolean} true if the application is running in the browser ( not ssr )
 */
export const getIsBrowser = () => {
  return typeof window !== 'undefined';
};

/**
 * @description based on the received query params after successful login, generates the array of user's accounts
 * @param searchParams the query params in the auth path when user does the login successfully
 * @returns {IUserLoginAccount[]} array of user accounts
 */
export const getAccountsFromSearchParams = (searchParams: string) => {
  let accountCount = 0;
  const params = new URLSearchParams(searchParams);
  const accounts: IUserLoginAccount[] = [];

  for (const key of params.keys()) {
    if (key.includes('acct')) {
      accountCount += 1;
    }
  }

  for (let index = 0; index < accountCount; index++) {
    const queryIndex = index + 1;

    // we should check each account in the search params, this is some kind of validation for the URL search params
    if (
      params.has(`acct${queryIndex}`) &&
      params.has(`token${queryIndex}`) &&
      params.has(`cur${queryIndex}`)
    ) {
      accounts.push({
        name: params.get(`acct${queryIndex}`),
        token: params.get(`token${queryIndex}`),
        currency: params.get(`cur${queryIndex}`),
      });
    }
  }
  return accounts;
};

export const formatDate = (date?: moment.MomentInput, date_format = 'YYYY-MM-DD') => {
  return moment(date).format(date_format);
};

export const formatTokenScope = (tokenScope: string) => {
  const cleanedTokenScope = tokenScope.replace(/-|_/g, ' ');
  return cleanedTokenScope[0].toUpperCase() + cleanedTokenScope.slice(1).toLowerCase();
};

export const getServerConfig = () => {
  const isBrowser = getIsBrowser();
  if (isBrowser) {
    const config_server_url = localStorage.getItem('config.server_url');
    const config_app_id = localStorage.getItem('config.app_id');
    if (config_app_id && config_server_url) {
      return {
        serverUrl: config_server_url,
        appId: config_app_id,
      };
    } else {
      const isLocalHost = getIsLocalhost();
      return {
        serverUrl: DEFAULT_WS_SERVER,
        appId: getAppId(isLocalHost),
      };
    }
  } else {
    return {
      serverUrl: DEFAULT_WS_SERVER,
      appId: getAppId(false),
    };
  }
};

export const generateLoginUrl = (language: string, serverUrl: string, appId: string) => {
  return `https://${serverUrl}/oauth2/authorize?app_id=${appId}&l=${language}`;
};
