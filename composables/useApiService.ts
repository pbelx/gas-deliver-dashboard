import ApiService from '~/services/api';

let apiServiceInstance: ApiService | null = null;

export const useApiService = () => {
  if (!apiServiceInstance) {
    const config = useRuntimeConfig();
    apiServiceInstance = new ApiService(config.public.apiBaseUrl);
  }
  return apiServiceInstance;
};
