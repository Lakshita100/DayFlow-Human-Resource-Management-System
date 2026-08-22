# Dayflow HRMS — Salary Information API Documentation

Backend implementation for the Dayflow HRMS Salary Information module.

## Authentication & Authorization

All endpoints require JWT Bearer authentication header:
`Authorization: Bearer <token>`

- **Admin/HR**: Full access to view and update any employee's salary configuration.
- **Employee**: Read-only access to view their own salary information. Attempting to view another employee's salary returns `403 Forbidden`. Updating salary configuration returns `403 Forbidden`.

---

## Endpoints

### 1. Get Employee Salary

Returns current salary breakdown, components, PF configuration, and tax configuration for an employee.

- **Method**: `GET`
- **URL**: `/api/employees/:employeeId/salary`
- **Permissions**: `ADMIN`, `HR`, or `EMPLOYEE` (self only)

#### Response `200 OK`
```json
{
  "success": true,
  "data": {
    "employeeId": "DFEMP003",
    "wageType": "FIXED",
    "monthlyWage": "50000.00",
    "yearlyWage": "600000.00",
    "workingDaysPerWeek": 5,
    "breakTimeHours": "1.00",
    "components": [
      {
        "id": "uuid-1",
        "code": "BASIC_SALARY",
        "name": "Basic Salary",
        "calculationType": "PERCENTAGE",
        "calculationBasis": "WAGE",
        "value": "50.00",
        "amount": "25000.00",
        "isActive": true,
        "displayOrder": 1
      },
      {
        "id": "uuid-2",
        "code": "HRA",
        "name": "House Rent Allowance",
        "calculationType": "PERCENTAGE",
        "calculationBasis": "BASIC_SALARY",
        "value": "50.00",
        "amount": "12500.00",
        "isActive": true,
        "displayOrder": 2
      },
      {
        "id": "uuid-3",
        "code": "FIXED_ALLOWANCE",
        "name": "Fixed Allowance",
        "calculationType": "FIXED_AMOUNT",
        "calculationBasis": null,
        "value": "2918.00",
        "amount": "2918.00",
        "isActive": true,
        "displayOrder": 3
      }
    ],
    "totalComponents": "40418.00",
    "remainingAmount": "9582.00",
    "pf": {
      "employeeRate": "12.00",
      "employeeAmount": "3000.00",
      "employerRate": "12.00",
      "employerAmount": "3000.00",
      "isActive": true
    },
    "tax": {
      "professionalTax": "200.00",
      "isActive": true
    }
  }
}
```

---

### 2. Create / Update Salary Structure

Creates or updates an employee's salary structure, wage, components, PF, and Tax configuration. Recalculates all percentage-based components against the monthly wage inside a database transaction.

- **Method**: `PUT`
- **URL**: `/api/employees/:employeeId/salary`
- **Permissions**: `ADMIN`, `HR`

#### Request Body
```json
{
  "monthlyWage": 60000,
  "wageType": "FIXED",
  "workingDaysPerWeek": 5,
  "breakTimeHours": 1.0,
  "components": [
    {
      "code": "BASIC_SALARY",
      "name": "Basic Salary",
      "calculationType": "PERCENTAGE",
      "calculationBasis": "WAGE",
      "value": 50
    },
    {
      "code": "HRA",
      "name": "House Rent Allowance",
      "calculationType": "PERCENTAGE",
      "calculationBasis": "BASIC_SALARY",
      "value": 50
    },
    {
      "code": "FIXED_ALLOWANCE",
      "name": "Fixed Allowance",
      "calculationType": "FIXED_AMOUNT",
      "value": 2918
    }
  ],
  "pf": {
    "employeeRate": 12,
    "employerRate": 12,
    "isActive": true
  },
  "tax": {
    "professionalTax": 200,
    "isActive": true
  }
}
```

---

### 3. Update Salary Components

- **Method**: `PUT`
- **URL**: `/api/employees/:employeeId/salary/components`
- **Permissions**: `ADMIN`, `HR`

#### Request Body
```json
{
  "components": [
    {
      "code": "BASIC_SALARY",
      "name": "Basic Salary",
      "calculationType": "PERCENTAGE",
      "calculationBasis": "WAGE",
      "value": 50
    }
  ]
}
```

---

### 4. Update PF Configuration

- **Method**: `PUT`
- **URL**: `/api/employees/:employeeId/salary/pf`
- **Permissions**: `ADMIN`, `HR`

#### Request Body
```json
{
  "employeeRate": 12,
  "employerRate": 12,
  "isActive": true
}
```

---

### 5. Update Tax Configuration

- **Method**: `PUT`
- **URL**: `/api/employees/:employeeId/salary/tax`
- **Permissions**: `ADMIN`, `HR`

#### Request Body
```json
{
  "professionalTax": 200,
  "isActive": true
}
```

---

## Error Handling & Codes

| Error Code | HTTP Status | Description |
|---|---|---|
| `VALIDATION_ERROR` | 400 | Invalid payload format, negative wage, invalid numbers |
| `SALARY_COMPONENT_TOTAL_EXCEEDS_WAGE` | 400 | Total of salary components exceeds monthly wage |
| `INVALID_COMPONENT_DEPENDENCY` | 400 | Circular dependency or invalid calculation basis |
| `DUPLICATE_COMPONENT` | 400 | Duplicate component code in configuration |
| `UNAUTHORIZED` | 401 | Missing or invalid authentication token |
| `FORBIDDEN` | 403 | Employee attempting to view another's salary or perform updates |
| `EMPLOYEE_NOT_FOUND` | 404 | Specified employee ID does not exist |
| `SALARY_NOT_FOUND` | 404 | Salary structure not initialized for employee |
