/*
  Warnings:

  - A unique constraint covering the columns `[category,version,code]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Product_category_version_code_key" ON "Product"("category", "version", "code");
