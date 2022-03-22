import * as bcrypt from 'bcrypt';

export const hashData = async (data: string) => {
  const salt = await bcrypt.genSalt();
  return await bcrypt.hash(data, salt);
};
