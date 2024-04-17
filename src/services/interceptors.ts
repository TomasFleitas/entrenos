import axiosInstance from '.';

export const setToken = (token: string) => {
  axiosInstance.defaults.headers = {
    ...axiosInstance.defaults.headers,
    ...(token && { Authorization: `Bearer ${token}` }),
  } as any;
};

export const RequestInterceptor = (
  getIdToken: (force: boolean) => Promise<string>,
) => {
  const id = axiosInstance.interceptors.request.use(async (config) => {
    setToken(await getIdToken(true));
    return config;
  });

  return () => axiosInstance.interceptors.request.eject(id);
};

export const ResponseInterceptor = (
  getIdToken: (force: boolean) => Promise<string>,
) => {
  const id = axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status !== 401) {
        return Promise.reject(error);
      }

      axiosInstance.interceptors.response.eject(id);

      return getIdToken(true)
        .then((token: string) => {
          error.response.config.headers['Authorization'] = 'Bearer ' + token;

          error.response.config.data = {
            ...JSON.parse(error.response?.config?.data || JSON.stringify({})),
          };

          return axiosInstance.request(error.response.config);
        })
        .catch((error: Error) => {
          return Promise.reject(error);
        });
    },
  );

  return () => axiosInstance.interceptors.response.eject(id);
};
