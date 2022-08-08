set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

CREATE TABLE "public"."Users" (
	"userId" serial NOT NULL,
	"username" TEXT UNIQUE,
	"email" TEXT,
	"dateCreated" timestamptz NOT NULL DEFAULT 'NOW()',
	"dateRegistered" timestamptz,
	"dateLastLogin" timestamptz NOT NULL,
	CONSTRAINT "Users_pk" PRIMARY KEY ("userId")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "public"."Passwords" (
	"userId" int NOT NULL,
	"hashedPassword" TEXT
) WITH (
  OIDS=FALSE
);

CREATE TABLE "public"."Drawings" (
	"drawingId" serial NOT NULL,
	"urlText" TEXT NOT NULL UNIQUE,
	"createdByUserId" int NOT NULL,
	"dateCreated" timestamptz NOT NULL,
	"dateSaved" timestamptz,
	"elements" jsonb NOT NULL,
	CONSTRAINT "Drawings_pk" PRIMARY KEY ("drawingId")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "public"."DrawingSaves" (
	"userId" int NOT NULL,
	"drawingId" int NOT NULL
) WITH (
  OIDS=FALSE
);

ALTER TABLE "Passwords" ADD CONSTRAINT "Passwords_fk0" FOREIGN KEY ("userId") REFERENCES "Users"("userId");

ALTER TABLE "Drawings" ADD CONSTRAINT "Drawings_fk0" FOREIGN KEY ("createdByUserId") REFERENCES "Users"("userId");

ALTER TABLE "DrawingSaves" ADD CONSTRAINT "DrawingSaves_fk0" FOREIGN KEY ("userId") REFERENCES "Users"("userId");
ALTER TABLE "DrawingSaves" ADD CONSTRAINT "DrawingSaves_fk1" FOREIGN KEY ("drawingId") REFERENCES "Drawings"("drawingId");
ALTER TABLE "DrawingSaves" ADD CONSTRAINT "DrawingSaves_userId_drawingId_constraint" UNIQUE ("userId", "drawingId");
