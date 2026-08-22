-- Create default company
INSERT INTO "Company" (id, name, prefix, "createdAt", "updatedAt")
VALUES ('default-company-id', 'Dayflow', 'DF', NOW(), NOW())
ON CONFLICT (name) DO NOTHING;

-- Update existing employees with companyId
UPDATE "Employee" SET "companyId" = 'default-company-id' WHERE "companyId" IS NULL;

-- Generate loginIds for existing users based on employee data
-- First employee (Admin): DFADUN20240001
UPDATE "User" SET "loginId" = 'DFADUN20240001' WHERE email = 'admin@dayflow.com';

-- HR Manager: DFHRMA20240002
UPDATE "User" SET "loginId" = 'DFHRMA20240002' WHERE email = 'hr@dayflow.com';

-- John Doe: DFJODO20240003
UPDATE "User" SET "loginId" = 'DFJODO20240003' WHERE email = 'john.doe@dayflow.com';

-- Jane Smith: DFJASM20240004
UPDATE "User" SET "loginId" = 'DFJASM20240004' WHERE email = 'jane.smith@dayflow.com';

-- Bob Wilson: DFBOwi20240005
UPDATE "User" SET "loginId" = 'DFBOWI20240005' WHERE email = 'bob.wilson@dayflow.com';

-- Create yearly serial entry for 2024
INSERT INTO "YearlySerial" (id, "companyId", year, "lastSerial")
VALUES ('default-yearly-serial-2024', 'default-company-id', 2024, 5)
ON CONFLICT ("companyId", year) DO NOTHING;
