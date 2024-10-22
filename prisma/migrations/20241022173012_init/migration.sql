-- CreateEnum
CREATE TYPE "Type" AS ENUM ('NPO', 'BUDGET', 'NON_BUDGET');

-- CreateEnum
CREATE TYPE "Term" AS ENUM ('FIRST', 'SECOND');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "Course" AS ENUM ('FIRST', 'SECOND', 'THIRD', 'FOURTH', 'INACTIVE');

-- CreateEnum
CREATE TYPE "Rate" AS ENUM ('SALARIED', 'HOURLY');

-- CreateEnum
CREATE TYPE "Month" AS ENUM ('JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER');

-- CreateEnum
CREATE TYPE "MonthHalf" AS ENUM ('FIRST', 'SECOND');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "is_admin" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "groups" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "type" "Type" NOT NULL,
    "course" "Course" NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teachers" (
    "id" UUID NOT NULL,
    "fio" TEXT NOT NULL,

    CONSTRAINT "teachers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "objects" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "objects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subjects" (
    "id" UUID NOT NULL,
    "month" "Month" NOT NULL,
    "month_half" "MonthHalf" NOT NULL,
    "hours" INTEGER NOT NULL,
    "plan_id" UUID NOT NULL,

    CONSTRAINT "subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subject_terms" (
    "id" UUID NOT NULL,
    "term" "Term" NOT NULL,
    "hours" INTEGER NOT NULL,
    "plan_id" UUID NOT NULL,

    CONSTRAINT "subject_terms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plans" (
    "id" UUID NOT NULL,
    "year" TEXT NOT NULL,
    "rate" "Rate" NOT NULL,
    "max_hours" INTEGER NOT NULL,
    "worked" INTEGER NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "object_id" UUID NOT NULL,
    "teacher_id" UUID NOT NULL,
    "group_id" UUID NOT NULL,

    CONSTRAINT "plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "revoked_tokens" (
    "id" UUID NOT NULL,
    "jti" TEXT NOT NULL,

    CONSTRAINT "revoked_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_login_key" ON "users"("login");

-- CreateIndex
CREATE UNIQUE INDEX "groups_name_key" ON "groups"("name");

-- CreateIndex
CREATE UNIQUE INDEX "teachers_fio_key" ON "teachers"("fio");

-- CreateIndex
CREATE UNIQUE INDEX "objects_name_key" ON "objects"("name");

-- CreateIndex
CREATE UNIQUE INDEX "subjects_month_month_half_plan_id_key" ON "subjects"("month", "month_half", "plan_id");

-- CreateIndex
CREATE UNIQUE INDEX "subject_terms_term_plan_id_key" ON "subject_terms"("term", "plan_id");

-- CreateIndex
CREATE UNIQUE INDEX "plans_year_object_id_group_id_teacher_id_key" ON "plans"("year", "object_id", "group_id", "teacher_id");

-- CreateIndex
CREATE UNIQUE INDEX "revoked_tokens_jti_key" ON "revoked_tokens"("jti");

-- AddForeignKey
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subject_terms" ADD CONSTRAINT "subject_terms_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plans" ADD CONSTRAINT "plans_object_id_fkey" FOREIGN KEY ("object_id") REFERENCES "objects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plans" ADD CONSTRAINT "plans_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teachers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plans" ADD CONSTRAINT "plans_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
