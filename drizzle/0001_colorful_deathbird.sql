CREATE TABLE "temp-table" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "temp-table_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"songcid" varchar(255) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "playback-count" ADD COLUMN "lastPlayed" integer;