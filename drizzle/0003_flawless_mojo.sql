CREATE TABLE "playlist-table" (
	"internalid" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "playlist-table_internalid_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"id" text NOT NULL,
	"title" text NOT NULL,
	"type" text NOT NULL,
	"lastSubscribed" integer NOT NULL,
	"songList" text NOT NULL,
	"settings" text NOT NULL,
	CONSTRAINT "playlist-table_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "song-table" (
	"internalid" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "song-table_internalid_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"id" text NOT NULL,
	"bvid" text NOT NULL,
	"name" text NOT NULL,
	"nameRaw" text NOT NULL,
	"singer" text NOT NULL,
	"singerId" text NOT NULL,
	"cover" text NOT NULL,
	"coverLowRes" text,
	"lyric" text,
	"lyricOffset" real,
	"parsedName" text NOT NULL,
	"biliShazamedName" text,
	"page" integer,
	"duration" integer NOT NULL,
	"album" text,
	"addedDate" integer,
	"source" text,
	"isLive" boolean,
	"liveStatus" boolean,
	"metadataOnLoad" boolean,
	"metadataOnReceived" boolean,
	"order" integer,
	"localPath" text,
	CONSTRAINT "song-table_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "tempid-table" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "tempid-table_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"songid" integer NOT NULL,
	CONSTRAINT "tempid-table_songid_unique" UNIQUE("songid")
);
