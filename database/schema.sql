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
	"hashedPassword" TEXT NOT NULL
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."Drawings" (
	"drawingId" serial NOT NULL,
	"urlText" TEXT NOT NULL UNIQUE,
	"createdByUserId" int NOT NULL,
	"dateCreated" timestamptz NOT NULL,
	"dateSaved" timestamptz,
	CONSTRAINT "Drawings_pk" PRIMARY KEY ("drawingId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."Strokes" (
	"strokeId" serial NOT NULL,
	"drawingId" serial NOT NULL,
	"createdByUserId" serial NOT NULL,
	"dateStartCreated" timestamptz NOT NULL,
	"dateStopCreated" timestamptz NOT NULL,
	"strokeElement" TEXT NOT NULL,
	"strokeAttributes" json NOT NULL,
	CONSTRAINT "Strokes_pk" PRIMARY KEY ("strokeId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."TextBoxes" (
	"textboxId" serial NOT NULL,
	"drawingId" int NOT NULL,
	"createdByUserId" int NOT NULL,
	"dateStartCreated" timestamptz NOT NULL,
	"dateStopCreated" timestamptz NOT NULL,
	"isMarkdown" bit NOT NULL,
	"textboxAttributes" json NOT NULL,
	"textboxContent" TEXT NOT NULL,
	CONSTRAINT "TextBoxes_pk" PRIMARY KEY ("textboxId")
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

ALTER TABLE "Strokes" ADD CONSTRAINT "Strokes_fk0" FOREIGN KEY ("drawingId") REFERENCES "Drawings"("drawingId");
ALTER TABLE "Strokes" ADD CONSTRAINT "Strokes_fk1" FOREIGN KEY ("createdByUserId") REFERENCES "Users"("userId");

ALTER TABLE "TextBoxes" ADD CONSTRAINT "TextBoxes_fk0" FOREIGN KEY ("drawingId") REFERENCES "Drawings"("drawingId");
ALTER TABLE "TextBoxes" ADD CONSTRAINT "TextBoxes_fk1" FOREIGN KEY ("createdByUserId") REFERENCES "Users"("userId");

ALTER TABLE "DrawingSaves" ADD CONSTRAINT "DrawingSaves_fk0" FOREIGN KEY ("userId") REFERENCES "Users"("userId");
ALTER TABLE "DrawingSaves" ADD CONSTRAINT "DrawingSaves_fk1" FOREIGN KEY ("drawingId") REFERENCES "Drawings"("drawingId");
