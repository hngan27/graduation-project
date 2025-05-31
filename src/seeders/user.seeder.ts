import { DataSource } from 'typeorm';
import { User } from '../entity/user.entity';
import { UserRole } from '../enums/UserRole';

export class UserSeeder {
  constructor(private dataSource: DataSource) {}

  async run(): Promise<void> {
    const userRepository = this.dataSource.getRepository(User);

    const usersData = [
      {
        id: '531fcba4-b7cd-45da-8ec3-184b8e88e949',
        email: 'admin@sun-asterisk.com',
        hash_password:
          '$2b$10$DjxAkWALpyHKWtdxyxCwYO4l5ZF7jyRcRTBr56OOruPLelb8El.cy',
        username: 'admin',
        role: UserRole.ADMIN,
        name: 'Admin',
        birthday: undefined,
        avatar_url:
          'https://visualpharm.com/assets/381/Admin-595b40b65ba036ed117d3b23.svg',
        phone: undefined,
        about: 'Administrator of the e-learning system',
      },
      {
        id: '00e813f9-59f4-40aa-bd60-1825d7606314',
        email: 'nguyen.quang.anh@sun-asterisk.com',
        hash_password:
          '$2b$10$cBvpEOwiSgshDbkhyi1.h.chwJDUydU9eXXcU1rAAwuu4utoCSIqC',
        username: 'anhnq',
        role: UserRole.INSTRUCTOR,
        name: 'Nguyen Quang Anh',
        birthday: undefined,
        avatar_url:
          'https://wallpapers-clan.com/wp-content/uploads/2024/04/avatar-the-last-airbender-aang-beautiful-desktop-wallpaper-preview.jpg',
        phone: undefined,
        about: 'Data Engineer',
      },
      {
        id: '123878ff-cd3d-4c94-aee3-cab0e0f6b27e',
        email: 'phamminhv26@gmail.com',
        hash_password:
          '$2b$10$WUum/TayekSCg7P2Guq69.aX02txwngO6Mfmo7uuMf6MdErhHjcwS',
        username: 'pmv',
        role: UserRole.INSTRUCTOR,
        name: 'Pham Minh Vuong',
        birthday: undefined,
        avatar_url:
          'https://img.freepik.com/premium-photo/teacher-man-avatar-icon-illustration-vector-style_131965-789.jpg',
        phone: undefined,
        about: 'Fullstack Engineer',
      },
      {
        id: '378e1954-1a85-458b-bfa1-d904070f1d58',
        email: 'pham.thi.hong.ngan@sun-asterisk.com',
        hash_password:
          '$2b$10$icM9rab8qK4mTumhXFIhMOGVay16oCHZkArBfWnXhpJ4H/z9NhaWK',
        username: 'nganpth',
        role: UserRole.STUDENT,
        name: 'Pham Thi Hong Ngan',
        birthday: undefined,
        avatar_url: undefined,
        phone: undefined,
        about: undefined,
      },
      {
        id: '5877df58-ad78-4833-8b04-175e72b6e3db',
        email: 'pham.minh.vuong@sun-asterisk.com',
        hash_password:
          '$2b$10$WG07nnnu2oTuocMBH.j99.GUsqMfsgtPvyQExBp3pFivu.VaeZlzG',
        username: 'vuongpm-0516',
        role: UserRole.STUDENT,
        name: 'Pham Minh Vuong',
        birthday: undefined,
        avatar_url: undefined,
        phone: undefined,
        about: undefined,
      },
      {
        id: '7b1719e9-338a-4f8e-a8e3-918c8f9663c3',
        email: 'cao.thi.phuong.anh@sun-asterisk.com',
        hash_password:
          '$2b$10$8Am90XB9ErV./evmEAvlgubarZXfz1euBTqUuIsXrxu.5vZ6Vyosm',
        username: 'anhctp',
        role: UserRole.STUDENT,
        name: 'Cao Thi Phuong Anh',
        birthday: undefined,
        avatar_url: undefined,
        phone: undefined,
        about: undefined,
      },
      {
        id: 'ad11ffa9-f4b0-4e8b-bbf0-e0f16c3854ce',
        email: 'zuanki@gmail.com',
        hash_password:
          '$2b$10$dzOiO8hEwb/gjc4uPgaMWudDud43ta32ObURJP/WuWALjrk/CKYa2',
        username: 'hoanx',
        role: UserRole.INSTRUCTOR,
        name: 'Nguyen Xuan Hoa',
        birthday: undefined,
        avatar_url:
          'https://gcs.tripi.vn/public-tripi/tripi-feed/img/474219hWQ/hinh-avatar-dep-1.jpg',
        phone: undefined,
        about: 'AI Engineer',
      },
    ];

    for (const userData of usersData) {
      const user = userRepository.create(userData);
      await userRepository.save(user);
    }

    console.log('Users seeded successfully');
  }
}
