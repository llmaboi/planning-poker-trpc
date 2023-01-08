import { z } from 'zod';

const ZodDisplayRaw = z.object({
  id: z.number(),
  room_id: z.number(),
  name: z.string().min(1),
  card_value: z.number(),
  is_host: z.literal(0).or(z.literal(1)),
});

const ZodDisplay = z.object({
  id: z.number(),
  roomId: z.number(),
  name: z.string().min(1),
  cardValue: z.number(),
  isHost: z.boolean(),
});

export { ZodDisplay, ZodDisplayRaw };

// CREATE TABLE `Displays` (
// 	`id` BIGINT NOT NULL AUTO_INCREMENT,
// 	`name` varchar(255) NOT NULL,
// 	`utc_updated` datetime DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
// 	`room_id` BIGINT NOT NULL,
//  `card_value` int NOT NULL DEFAULT 0,
//  `is_host` tinyint(1) DEFAULT '0',
// 	PRIMARY KEY (`id`),
// 	UNIQUE KEY `id_UNIQUE` (`id`)
// ) ENGINE InnoDB,
//   CHARSET utf8mb4,
//   COLLATE utf8mb4_0900_ai_ci;
