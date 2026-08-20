import axiosInstance from "./axios";

export const apiClient = {
  get: async <T>(
    url: string,
    config?: object
  ): Promise<T> => {
    const response = await axiosInstance.get<T>(
      url,
      config
    );

    return response.data;
  },

  post: async <T, D = unknown>(
    url: string,
    data?: D,
    config?: object
  ): Promise<T> => {
    const response = await axiosInstance.post<T>(
      url,
      data,
      config
    );

    return response.data;
  },

  put: async <T, D = unknown>(
    url: string,
    data?: D,
    config?: object
  ): Promise<T> => {
    const response = await axiosInstance.put<T>(
      url,
      data,
      config
    );

    return response.data;
  },

  patch: async <T, D = unknown>(
    url: string,
    data?: D,
    config?: object
  ): Promise<T> => {
    const response = await axiosInstance.patch<T>(
      url,
      data,
      config
    );

    return response.data;
  },

  delete: async <T>(
    url: string,
    config?: object
  ): Promise<T> => {
    const response = await axiosInstance.delete<T>(
      url,
      config
    );

    return response.data;
  },
};