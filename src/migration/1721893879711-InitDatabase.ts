import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitDatabase1721893879711 implements MigrationInterface {
  name = 'InitDatabase1721893879711';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`enrollments\` (\`id\` varchar(36) NOT NULL, \`status\` enum ('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING', \`done\` tinyint NOT NULL DEFAULT 0, \`enrollment_date\` datetime NOT NULL, \`student_id\` varchar(36) NULL, \`course_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`lessons\` (\`id\` varchar(36) NOT NULL, \`title\` varchar(255) NOT NULL, \`content\` varchar(255) NOT NULL, \`file_url\` varchar(255) NULL, \`study_time\` datetime NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`student_lesson\` (\`id\` varchar(36) NOT NULL, \`done\` tinyint NOT NULL DEFAULT 0, \`student_id\` varchar(36) NULL, \`lesson_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`options\` (\`id\` varchar(36) NOT NULL, \`content\` varchar(255) NOT NULL, \`is_correct\` tinyint NOT NULL, \`question_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`answers\` (\`id\` varchar(36) NOT NULL, \`answer\` varchar(255) NULL, \`student_id\` varchar(36) NULL, \`question_id\` varchar(36) NULL, \`option_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`grades\` (\`id\` varchar(36) NOT NULL, \`status\` enum ('TODO', 'DOING', 'PASS', 'FAIL') NOT NULL DEFAULT 'TODO', \`grade\` float NOT NULL, \`max_grade\` float NOT NULL, \`feedback\` varchar(255) NULL, \`assignment_id\` varchar(36) NULL, \`student_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`users\` (\`id\` varchar(36) NOT NULL, \`email\` varchar(255) NOT NULL, \`hash_password\` varchar(255) NOT NULL, \`username\` varchar(255) NOT NULL, \`role\` enum ('ADMIN', 'INSTRUCTOR', 'STUDENT') NOT NULL DEFAULT 'STUDENT', \`name\` varchar(255) NOT NULL, \`birthday\` date NULL, \`avatar_url\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`courses\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`instructor_id\` varchar(36) NOT NULL, \`sub_instructor_id\` varchar(36) NULL, \`assignment_id\` varchar(36) NULL, UNIQUE INDEX \`REL_53507595a85e67bfa5c8206799\` (\`assignment_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`assignments\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NULL, \`deadline\` datetime NULL, \`course_id\` varchar(36) NULL, UNIQUE INDEX \`REL_33f833f305070d2d4e6305d8a0\` (\`course_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`questions\` (\`id\` varchar(36) NOT NULL, \`content\` varchar(255) NOT NULL, \`assignment_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`lesson_course\` (\`course_id\` varchar(36) NOT NULL, \`lesson_id\` varchar(36) NOT NULL, INDEX \`IDX_42a784f3dab0ad201b5d4bb33a\` (\`course_id\`), INDEX \`IDX_24723c8385d4fb37f5492757b1\` (\`lesson_id\`), PRIMARY KEY (\`course_id\`, \`lesson_id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `ALTER TABLE \`enrollments\` ADD CONSTRAINT \`FK_307813fe255896d6ebf3e6cd55c\` FOREIGN KEY (\`student_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`enrollments\` ADD CONSTRAINT \`FK_b79d0bf01779fdf9cfb6b092af3\` FOREIGN KEY (\`course_id\`) REFERENCES \`courses\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`student_lesson\` ADD CONSTRAINT \`FK_ee05e947a4876f2cb6f20e5ad37\` FOREIGN KEY (\`student_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`student_lesson\` ADD CONSTRAINT \`FK_1b1e669a97eabf06df2012766b9\` FOREIGN KEY (\`lesson_id\`) REFERENCES \`lessons\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`options\` ADD CONSTRAINT \`FK_2bdd03245b8cb040130fe16f21d\` FOREIGN KEY (\`question_id\`) REFERENCES \`questions\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`answers\` ADD CONSTRAINT \`FK_5599e6557440fcc9a843e62b99b\` FOREIGN KEY (\`student_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`answers\` ADD CONSTRAINT \`FK_677120094cf6d3f12df0b9dc5d3\` FOREIGN KEY (\`question_id\`) REFERENCES \`questions\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`answers\` ADD CONSTRAINT \`FK_67e979b8942acc80137116b6f12\` FOREIGN KEY (\`option_id\`) REFERENCES \`options\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`grades\` ADD CONSTRAINT \`FK_361ad24212a796fb219e19b3f08\` FOREIGN KEY (\`assignment_id\`) REFERENCES \`assignments\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`grades\` ADD CONSTRAINT \`FK_9acca493883cee3b9e8f9e01cd1\` FOREIGN KEY (\`student_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`courses\` ADD CONSTRAINT \`FK_4fdc83dd6b261101401ec259342\` FOREIGN KEY (\`instructor_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`courses\` ADD CONSTRAINT \`FK_3d51c7bc0a2aa26907d7b0e4a51\` FOREIGN KEY (\`sub_instructor_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`courses\` ADD CONSTRAINT \`FK_53507595a85e67bfa5c8206799a\` FOREIGN KEY (\`assignment_id\`) REFERENCES \`assignments\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`assignments\` ADD CONSTRAINT \`FK_33f833f305070d2d4e6305d8a0c\` FOREIGN KEY (\`course_id\`) REFERENCES \`courses\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`questions\` ADD CONSTRAINT \`FK_fd156d20b66a5f26eed9cac60dc\` FOREIGN KEY (\`assignment_id\`) REFERENCES \`assignments\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`lesson_course\` ADD CONSTRAINT \`FK_42a784f3dab0ad201b5d4bb33a5\` FOREIGN KEY (\`course_id\`) REFERENCES \`courses\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE \`lesson_course\` ADD CONSTRAINT \`FK_24723c8385d4fb37f5492757b1a\` FOREIGN KEY (\`lesson_id\`) REFERENCES \`lessons\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`lesson_course\` DROP FOREIGN KEY \`FK_24723c8385d4fb37f5492757b1a\``
    );
    await queryRunner.query(
      `ALTER TABLE \`lesson_course\` DROP FOREIGN KEY \`FK_42a784f3dab0ad201b5d4bb33a5\``
    );
    await queryRunner.query(
      `ALTER TABLE \`questions\` DROP FOREIGN KEY \`FK_fd156d20b66a5f26eed9cac60dc\``
    );
    await queryRunner.query(
      `ALTER TABLE \`assignments\` DROP FOREIGN KEY \`FK_33f833f305070d2d4e6305d8a0c\``
    );
    await queryRunner.query(
      `ALTER TABLE \`courses\` DROP FOREIGN KEY \`FK_53507595a85e67bfa5c8206799a\``
    );
    await queryRunner.query(
      `ALTER TABLE \`courses\` DROP FOREIGN KEY \`FK_3d51c7bc0a2aa26907d7b0e4a51\``
    );
    await queryRunner.query(
      `ALTER TABLE \`courses\` DROP FOREIGN KEY \`FK_4fdc83dd6b261101401ec259342\``
    );
    await queryRunner.query(
      `ALTER TABLE \`grades\` DROP FOREIGN KEY \`FK_9acca493883cee3b9e8f9e01cd1\``
    );
    await queryRunner.query(
      `ALTER TABLE \`grades\` DROP FOREIGN KEY \`FK_361ad24212a796fb219e19b3f08\``
    );
    await queryRunner.query(
      `ALTER TABLE \`answers\` DROP FOREIGN KEY \`FK_67e979b8942acc80137116b6f12\``
    );
    await queryRunner.query(
      `ALTER TABLE \`answers\` DROP FOREIGN KEY \`FK_677120094cf6d3f12df0b9dc5d3\``
    );
    await queryRunner.query(
      `ALTER TABLE \`answers\` DROP FOREIGN KEY \`FK_5599e6557440fcc9a843e62b99b\``
    );
    await queryRunner.query(
      `ALTER TABLE \`options\` DROP FOREIGN KEY \`FK_2bdd03245b8cb040130fe16f21d\``
    );
    await queryRunner.query(
      `ALTER TABLE \`student_lesson\` DROP FOREIGN KEY \`FK_1b1e669a97eabf06df2012766b9\``
    );
    await queryRunner.query(
      `ALTER TABLE \`student_lesson\` DROP FOREIGN KEY \`FK_ee05e947a4876f2cb6f20e5ad37\``
    );
    await queryRunner.query(
      `ALTER TABLE \`enrollments\` DROP FOREIGN KEY \`FK_b79d0bf01779fdf9cfb6b092af3\``
    );
    await queryRunner.query(
      `ALTER TABLE \`enrollments\` DROP FOREIGN KEY \`FK_307813fe255896d6ebf3e6cd55c\``
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_24723c8385d4fb37f5492757b1\` ON \`lesson_course\``
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_42a784f3dab0ad201b5d4bb33a\` ON \`lesson_course\``
    );
    await queryRunner.query(`DROP TABLE \`lesson_course\``);
    await queryRunner.query(`DROP TABLE \`questions\``);
    await queryRunner.query(
      `DROP INDEX \`REL_33f833f305070d2d4e6305d8a0\` ON \`assignments\``
    );
    await queryRunner.query(`DROP TABLE \`assignments\``);
    await queryRunner.query(
      `DROP INDEX \`REL_53507595a85e67bfa5c8206799\` ON \`courses\``
    );
    await queryRunner.query(`DROP TABLE \`courses\``);
    await queryRunner.query(`DROP TABLE \`users\``);
    await queryRunner.query(`DROP TABLE \`grades\``);
    await queryRunner.query(`DROP TABLE \`answers\``);
    await queryRunner.query(`DROP TABLE \`options\``);
    await queryRunner.query(`DROP TABLE \`student_lesson\``);
    await queryRunner.query(`DROP TABLE \`lessons\``);
    await queryRunner.query(`DROP TABLE \`enrollments\``);
  }
}
