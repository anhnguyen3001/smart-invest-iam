export const buildParams = (search: object): string => {
  if (!search) return '';

  const params = new URLSearchParams();

  Object.entries(search).forEach(([key, value]) => {
    if (Array.isArray(value)) params.append(key, value.join(','));
    else params.append(key, value.toString());
  });

  return params.toString();
};
