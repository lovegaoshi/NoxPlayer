CREATE TABLE "abrepeat-table" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "abrepeat-table_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"songcid" varchar(255) NOT NULL,
	"a" real,
	"b" real,
	CONSTRAINT "abrepeat-table_songcid_unique" UNIQUE("songcid")
);
--> statement-breakpoint
CREATE TABLE "lyric-table" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "lyric-table_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"songId" varchar(255) NOT NULL,
	"lyricKey" varchar(255) NOT NULL,
	"lyricOffset" real NOT NULL,
	"lyric" text NOT NULL,
	"source" varchar(255),
	CONSTRAINT "lyric-table_songId_unique" UNIQUE("songId")
);
--> statement-breakpoint
CREATE TABLE "r128gain-table" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "r128gain-table_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"songcid" varchar(255) NOT NULL,
	"r128gain" real,
	CONSTRAINT "r128gain-table_songcid_unique" UNIQUE("songcid")
);
