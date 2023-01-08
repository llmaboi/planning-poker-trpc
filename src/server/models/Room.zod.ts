import { z } from 'zod';

const ZodRoomRaw = z.object({
  id: z.number(),
  label: z.string().nullable(),
  name: z.string().min(1),
  show_votes: z.literal(0).or(z.literal(1)),
});

const ZodRoom = z.object({
  id: z.number(),
  label: z.string().nullable(),
  name: z.string().min(1),
  showVotes: z.boolean(),
});

export { ZodRoom, ZodRoomRaw };

// CREATE TABLE `Rooms` (
// 	`id` BIGINT NOT NULL AUTO_INCREMENT,
// 	`name` varchar(255) NOT NULL,
// 	`label` varchar(255),
//  `show_votes` BOOLEAN DEFAULT 1,
// 	`utc_updated` datetime DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
// 	PRIMARY KEY (`id`),
// 	UNIQUE KEY `id_UNIQUE` (`id`)
// ) ENGINE InnoDB,
//   CHARSET utf8mb4,
//   COLLATE utf8mb4_0900_ai_ci;
