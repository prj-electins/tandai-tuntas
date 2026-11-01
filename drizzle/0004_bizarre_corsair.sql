CREATE TABLE `backup_items` (
	`backup_id` text NOT NULL,
	`entity` text NOT NULL,
	`data` text NOT NULL,
	FOREIGN KEY (`backup_id`) REFERENCES `backups`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `backup_items_backup_idx` ON `backup_items` (`backup_id`);--> statement-breakpoint
CREATE TABLE `backups` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`name` text NOT NULL,
	`created_at` integer NOT NULL,
	`prefs` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `backups_owner_idx` ON `backups` (`owner_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `recoveries` (
	`account_id` text PRIMARY KEY NOT NULL,
	`hash` text NOT NULL,
	FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `trash` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`entity` text NOT NULL,
	`record_id` text NOT NULL,
	`data` text NOT NULL,
	`deleted_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `trash_owner_idx` ON `trash` (`owner_id`,`deleted_at`);--> statement-breakpoint
ALTER TABLE `workspaces` ADD `archived_at` integer;--> statement-breakpoint
CREATE INDEX `projects_owner_updated_idx` ON `projects` (`owner_id`,`updated_at`);--> statement-breakpoint
CREATE INDEX `tasks_owner_updated_idx` ON `tasks` (`owner_id`,`updated_at`);--> statement-breakpoint
CREATE INDEX `videos_owner_updated_idx` ON `videos` (`owner_id`,`updated_at`);