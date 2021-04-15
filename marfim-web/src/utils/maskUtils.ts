export const maskedCnpj = (cnpj: string): string => {
  const masked = `${cnpj.substring(0, 2)}.${cnpj.substring(
    2,
    5,
  )}.${cnpj.substring(5, 8)}/${cnpj.substring(8, 12)}-${cnpj.substring(12)}`;

  return masked;
};

export const unmaskCnpj = (cnpj: string): string => {
  return cnpj.replaceAll('.', '').replaceAll('/', '').replaceAll('-', '');
};
