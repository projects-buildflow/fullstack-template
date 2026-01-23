# Task 3.6: API Documentation

| XP Reward | Estimated Time | Type |
|-----------|----------------|------|
| 25 XP | 45 min | Pull Request |

## Quick Links

- **Team Chat** in your dashboard - Get help from mentors
- [OpenAPI Specification](https://swagger.io/specification/)
- [Swagger Editor](https://editor.swagger.io/) - Test your spec

## Objective

Document your API endpoints using OpenAPI 3.0 specification for clear, professional API documentation.

## The Situation

> **Jamie Park (Designer):** "Good documentation is essential for any API. Other developers (and future you!) need to understand how to use it without reading all the code. Let's create comprehensive docs using OpenAPI spec - it's the industry standard and generates beautiful interactive docs."

## Requirements

Create API documentation with:
- OpenAPI 3.0 specification file
- All endpoints documented (Auth, Tasks, Columns, Boards)
- Request/response schemas
- Authentication requirements
- Example values
- Error responses

## What is OpenAPI?

OpenAPI (formerly Swagger) is a standard format for describing REST APIs. Benefits:
- **Auto-generated docs:** Tools create interactive docs from your spec
- **Client generation:** Auto-generate API clients in any language
- **Validation:** Catch API contract violations early
- **Testing:** Use specs to test your API

## Steps

### 1. Create a New Branch

```bash
git checkout main
git pull origin main
git checkout -b task-3.6-api-docs
```

### 2. Understand the OpenAPI Structure

Create `server/docs/openapi.yaml`:

```yaml
openapi: 3.0.3

info:
  title: TaskMaster API
  description: REST API for the TaskMaster Kanban board application
  version: 1.0.0
  contact:
    name: TaskMaster Support
    email: support@taskmaster.com

servers:
  - url: http://localhost:3001/api
    description: Development server
  - url: https://api.taskmaster.com
    description: Production server

tags:
  - name: Auth
    description: Authentication endpoints
  - name: Tasks
    description: Task CRUD operations
  - name: Columns
    description: Column management
  - name: Boards
    description: Board management

paths:
  # TODO: Add all your endpoints here

components:
  # TODO: Add reusable schemas, responses, parameters
```

### 3. Document Authentication Endpoints

**Complete example - Auth endpoints:**

```yaml
paths:
  /auth/register:
    post:
      tags: [Auth]
      summary: Register a new user
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [email, password, name]
              properties:
                email:
                  type: string
                  format: email
                  example: user@example.com
                password:
                  type: string
                  minLength: 8
                  example: SecurePass123!
                name:
                  type: string
                  example: Jane Doe
      responses:
        201:
          description: User registered successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AuthResponse'
        400:
          description: Validation error
        409:
          description: Email already exists

  /auth/login:
    post:
      tags: [Auth]
      summary: Login with credentials
      # TODO: Add requestBody (email, password)
      # TODO: Add responses (200, 401)

  /auth/me:
    get:
      tags: [Auth]
      summary: Get current user profile
      security:
        - bearerAuth: []
      # TODO: Add responses (200, 401)
```

### 4. Document Task Endpoints

**Pattern to follow:**

```yaml
  /tasks:
    get:
      tags: [Tasks]
      summary: Get all tasks
      security:
        - bearerAuth: []
      parameters:
        - name: column_id
          in: query
          schema:
            type: string
            format: uuid
          description: Filter by column ID (optional)
      # TODO: Add 200 response with array of tasks
      # TODO: Add 401 unauthorized response

    post:
      tags: [Tasks]
      summary: Create a new task
      security:
        - bearerAuth: []
      # TODO: Add requestBody with CreateTask schema
      # TODO: Add 201 created response
      # TODO: Add 400 validation error response

  /tasks/{id}:
    get:
      # TODO: Get single task by ID

    put:
      # TODO: Update task

    delete:
      # TODO: Delete task
```

**TODO:** Document all task endpoints (GET, POST, PUT, DELETE)

### 5. Document Column and Board Endpoints

Follow the same pattern for:
- `/columns` (GET, POST)
- `/columns/{id}` (GET, PUT, DELETE)
- `/boards` (GET, POST)
- `/boards/{id}` (GET, PUT, DELETE)

### 6. Define Reusable Components

**Schemas section:**

```yaml
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: JWT token from /auth/login

  schemas:
    User:
      type: object
      properties:
        id:
          type: string
          format: uuid
        email:
          type: string
          format: email
        name:
          type: string
        avatar_url:
          type: string
          format: uri
        created_at:
          type: string
          format: date-time
      example:
        id: "123e4567-e89b-12d3-a456-426614174000"
        email: "user@example.com"
        name: "Jane Doe"
        created_at: "2024-01-15T10:30:00Z"

    Task:
      type: object
      required: [id, title, column_id, priority]
      properties:
        id:
          type: string
          format: uuid
        title:
          type: string
          minLength: 1
          maxLength: 255
        description:
          type: string
        priority:
          type: string
          enum: [low, medium, high]
        column_id:
          type: string
          format: uuid
        assignee_id:
          type: string
          format: uuid
        due_date:
          type: string
          format: date
        position:
          type: integer
        created_at:
          type: string
          format: date-time
      # TODO: Add example object

    CreateTask:
      type: object
      required: [title, column_id, priority]
      # TODO: List properties needed to create a task

    UpdateTask:
      type: object
      # TODO: All fields optional for partial updates

    Column:
      # TODO: Define column schema

    Board:
      # TODO: Define board schema

    AuthResponse:
      type: object
      properties:
        token:
          type: string
          description: JWT authentication token
        user:
          $ref: '#/components/schemas/User'

    Error:
      type: object
      properties:
        error:
          type: object
          properties:
            message:
              type: string
            status:
              type: integer
      example:
        error:
          message: "Validation failed"
          status: 400

  responses:
    BadRequest:
      description: Invalid request
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'

    Unauthorized:
      description: Missing or invalid token

    NotFound:
      description: Resource not found

    # TODO: Add more common responses

  parameters:
    TaskId:
      name: id
      in: path
      required: true
      schema:
        type: string
        format: uuid
      description: Task ID

    # TODO: Add ColumnId, BoardId parameters
```

### 7. Test Your Specification

**Option 1: Swagger Editor**
1. Go to https://editor.swagger.io/
2. Paste your YAML
3. Fix any validation errors
4. See live preview of generated docs

**Option 2: Local Swagger UI**
```bash
npm install swagger-ui-express
```

Add to your Express app:
```javascript
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./docs/openapi.yaml');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
```

Visit: http://localhost:3001/api-docs

### 8. Submit Your PR

```bash
git add .
git commit -m "docs: add OpenAPI specification for all endpoints"
git push -u origin task-3.6-api-docs
```

## Acceptance Criteria

- [ ] OpenAPI 3.0 specification created
- [ ] All endpoints documented (Auth, Tasks, Columns, Boards)
- [ ] Request bodies defined with required fields
- [ ] Response schemas defined
- [ ] Authentication documented (Bearer JWT)
- [ ] Example values provided
- [ ] Spec validates in Swagger Editor
- [ ] Common error responses defined

## Resources

- [OpenAPI 3.0 Guide](https://swagger.io/docs/specification/about/)
- [Swagger Editor](https://editor.swagger.io/) - Validates and previews
- [Example OpenAPI specs](https://github.com/OAI/OpenAPI-Specification/tree/main/examples)
- [Schema Object](https://swagger.io/docs/specification/data-models/)

## Tips

- Start with one complete endpoint, then copy the pattern
- Use `$ref` to avoid repeating schemas
- Include realistic example values
- Document error cases - they're important!
- Test in Swagger Editor frequently to catch syntax errors

## Common Issues

**"Spec doesn't validate"**
- Check YAML indentation (use spaces, not tabs)
- Ensure all `$ref` paths are correct
- Required fields must be in `required` array

**"How to document optional query parameters?"**
```yaml
parameters:
  - name: search
    in: query
    required: false  # This makes it optional
    schema:
      type: string
```

**"How to show arrays in responses?"**
```yaml
responses:
  200:
    content:
      application/json:
        schema:
          type: array
          items:
            $ref: '#/components/schemas/Task'
```

---

**Previous Task:** [Task 3.5: Implement Authentication](../task-3.5/INSTRUCTIONS.md)
**Next Task:** [Task 4.1: Add Search & Filter](../../week-4/task-4.1/INSTRUCTIONS.md)
