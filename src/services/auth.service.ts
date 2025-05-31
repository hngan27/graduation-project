import { AppDataSource } from '../config/data-source';
import { User } from '../entity/user.entity';

const userRepository = AppDataSource.getRepository(User);

// Hàm tìm người dùng theo username
export const findUserByUsername = async (
  username: string
): Promise<User | null> => {
  const user = await userRepository.findOneBy({ username });
  return user;
};

// Hàm tìm người dùng theo email
export const findUserByEmail = async (email: string) => {
  const user = await userRepository.findOneBy({ email });
  return user;
};

// Hàm lưu người dùng vào cơ sở dữ liệu
export const saveUser = async (user: User): Promise<User> => {
  return await userRepository.save(user);
};

// Hàm xác thực người dùng
export const authenticateUser = async (
  email: string,
  password: string
): Promise<User | null> => {
  const user = await userRepository.findOneBy({ email });

  if (user && (await user.comparePassword(password))) {
    return user;
  }

  return null;
};
