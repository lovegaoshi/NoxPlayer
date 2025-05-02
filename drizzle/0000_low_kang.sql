CREATE TABLE "playback-count" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "playback-count_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"songcid" varchar(255) NOT NULL,
	"count" integer NOT NULL
);
