// import { create } from '../api';

// // define the functional digital api instance
// // export const AppApi = create({
// //   baseURL: process.env['BASE_API_URL'],
// //   headers: { Accept: 'application/json' },
// // });

// export function AppApi() {
//   const baseUrl = localStorage.getItem('baseUrl');
//   console.log('baseUrl main ......................', { baseUrl });
//   if (baseUrl) {
//     return create({
//       baseURL: baseUrl,
//       headers: { Accept: 'application/json' },
//     });
//   }
// }

// export const setAuthToken = (token: string | null) => {
//   if (token) {
//     AppApi()?.setHeader('Authorization', `Bearer ${token}`);
//   } else {
//     AppApi()?.setHeader('Authorization', '');
//   }
// };

// export default AppApi;

import { create } from '../api';
import { ApiInstance } from '../api/types';

// Singleton pattern to ensure only one instance of the API
let apiInstance: ApiInstance | null = null;

// Function to create and return the API instance
export function AppApi() {
  // Check if we already have an instance
  if (apiInstance) {
    return apiInstance;
  }

  // Retrieve the baseURL from localStorage
  const baseURL = localStorage.getItem('baseURL');

  // Create and store the new API instance if baseURL is available
  if (baseURL) {
    apiInstance = create({
      baseURL,
      headers: { Accept: 'application/json' },
    });
  } else {
    // console.error(
    //   'baseURL not found in localStorage and no default URL provided'
    // );
    return undefined; // Or handle as needed
  }

  return apiInstance;
}

// Set the authorization token
export const setAuthToken = (token: string | null) => {
  const api = AppApi();
  if (api) {
    api.setHeader('Authorization', token ? `Bearer ${token}` : '');
  }
};

export default AppApi;
