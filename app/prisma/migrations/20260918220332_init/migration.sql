-- CreateTable
CREATE TABLE "StoreAccount" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "storename" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phonenumber" TEXT NOT NULL,
    "companysize" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "StoreAccount_email_key" ON "StoreAccount"("email");
