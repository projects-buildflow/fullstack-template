# Task 3.6: API Documentation

| XP Reward | Estimated Time | Type |
|-----------|----------------|------|
| 25 XP | 30 min | AI Review |

## Quick Links

- [Team Chat](https://buildflow.dev/team) - Get help from mentors
- [OpenAPI Specification](https://swagger.io/specification/)

## Objective

Document your API endpoints using OpenAPI/Swagger specification.

## The Situation

> **Jamie Park (Designer):** "Good documentation is essential for any API. Other developers (and future you!) need to understand how to use it. Let's create comprehensive docs using OpenAPI spec - it's the industry standard."

## Requirements

Create API documentation:
- OpenAPI 3.0 specification file
- All endpoints documented
- Request/response schemas
- Authentication details
- Example requests and responses

## Steps

### 1. Create a New Branch

```bash
git checkout main
git pull origin main
git checkout -b task-3.6-api-docs
```

### 2. Create OpenAPI Specification

Create `server/docs/openapi.yaml`:

```yaml
openapi: 3.0.3
info:
  title: TaskMaster API
  description: |
    REST API for the TaskMaster Kanban board application.

    ## Authentication
    Most endpoints require a JWT token. Include it in the Authorization header:
    ```
    Authorization: Bearer <your-token>
    ```

    ## Rate Limiting
    API requests are limited to 100 requests per minute per user.
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
    description: Task management
  - name: Columns
    description: Column management
  - name: Boards
    description: Board management

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
                  minLength: 6
                  example: securePassword123
                name:
                  type: string
                  example: John Doe
      responses:
        201:
          description: User created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AuthResponse'
        400:
          $ref: '#/components/responses/BadRequest'
        409:
          description: Email already registered

  /auth/login:
    post:
      tags: [Auth]
      summary: Login with email and password
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [email, password]
              properties:
                email:
                  type: string
                  format: email
                password:
                  type: string
      responses:
        200:
          description: Login successful
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AuthResponse'
        401:
          description: Invalid credentials

  /auth/me:
    get:
      tags: [Auth]
      summary: Get current user
      security:
        - bearerAuth: []
      responses:
        200:
          description: Current user info
          content:
            application/json:
              schema:
                type: object
                properties:
                  user:
                    $ref: '#/components/schemas/User'

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
          description: Filter tasks by column
      responses:
        200:
          description: List of tasks
          content:
            application/json:
              schema:
                type: object
                properties:
                  tasks:
                    type: array
                    items:
                      $ref: '#/components/schemas/Task'

    post:
      tags: [Tasks]
      summary: Create a new task
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateTask'
      responses:
        201:
          description: Task created
          content:
            application/json:
              schema:
                type: object
                properties:
                  task:
                    $ref: '#/components/schemas/Task'
        400:
          $ref: '#/components/responses/BadRequest'

  /tasks/{id}:
    get:
      tags: [Tasks]
      summary: Get a task by ID
      security:
        - bearerAuth: []
      parameters:
        - $ref: '#/components/parameters/TaskId'
      responses:
        200:
          description: Task details
          content:
            application/json:
              schema:
                type: object
                properties:
                  task:
                    $ref: '#/components/schemas/Task'
        404:
          $ref: '#/components/responses/NotFound'

    put:
      tags: [Tasks]
      summary: Update a task
      security:
        - bearerAuth: []
      parameters:
        - $ref: '#/components/parameters/TaskId'
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UpdateTask'
      responses:
        200:
          description: Task updated
        404:
          $ref: '#/components/responses/NotFound'

    delete:
      tags: [Tasks]
      summary: Delete a task
      security:
        - bearerAuth: []
      parameters:
        - $ref: '#/components/parameters/TaskId'
      responses:
        200:
          description: Task deleted
        404:
          $ref: '#/components/responses/NotFound'

  /tasks/{id}/move:
    patch:
      tags: [Tasks]
      summary: Move task to different column
      security:
        - bearerAuth: []
      parameters:
        - $ref: '#/components/parameters/TaskId'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [column_id]
              properties:
                column_id:
                  type: string
                  format: uuid
                position:
                  type: integer
      responses:
        200:
          description: Task moved

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  parameters:
    TaskId:
      name: id
      in: path
      required: true
      schema:
        type: string
        format: uuid

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
          nullable: true

    AuthResponse:
      type: object
      properties:
        user:
          $ref: '#/components/schemas/User'
        token:
          type: string

    Task:
      type: object
      properties:
        id:
          type: string
          format: uuid
        column_id:
          type: string
          format: uuid
        title:
          type: string
        description:
          type: string
          nullable: true
        priority:
          type: string
          enum: [low, medium, high]
        assignee_id:
          type: string
          format: uuid
          nullable: true
        due_date:
          type: string
          format: date
          nullable: true
        position:
          type: integer
        created_at:
          type: string
          format: date-time
        updated_at:
          type: string
          format: date-time

    CreateTask:
      type: object
      required: [column_id, title]
      properties:
        column_id:
          type: string
          format: uuid
        title:
          type: string
          maxLength: 255
        description:
          type: string
        priority:
          type: string
          enum: [low, medium, high]
          default: medium
        assignee_id:
          type: string
          format: uuid
        due_date:
          type: string
          format: date

    UpdateTask:
      type: object
      properties:
        title:
          type: string
        description:
          type: string
        priority:
          type: string
          enum: [low, medium, high]
        assignee_id:
          type: string
          format: uuid
        due_date:
          type: string
          format: date
        column_id:
          type: string
          format: uuid
        position:
          type: integer

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

  responses:
    BadRequest:
      description: Bad request
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
    NotFound:
      description: Resource not found
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
```

### 3. Add Swagger UI (Optional)

```bash
npm install swagger-ui-express yamljs
```

Update `server/index.js`:

```javascript
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./docs/openapi.yaml');

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
```

### 4. Create API README

Create `server/docs/API.md` with quick-start examples for common operations.

### 5. Submit for AI Review

Push your changes and create a PR. The AI will review your documentation for:
- Completeness
- Clarity
- Examples
- Error documentation
- Overall quality

```bash
git add .
git commit -m "docs: add OpenAPI specification for API"
git push -u origin task-3.6-api-docs
```

## Acceptance Criteria

- [ ] OpenAPI 3.0 spec file created
- [ ] All endpoints documented
- [ ] Request/response schemas defined
- [ ] Authentication documented
- [ ] Error responses documented
- [ ] Examples included
- [ ] Swagger UI working (bonus)

## Tips

- Use `$ref` to avoid duplication
- Include realistic examples
- Document all possible error codes

---

**Previous Task:** [Task 3.5: Implement User Authentication](../task-3.5/INSTRUCTIONS.md)
**Next Task:** [Task 4.1: Add Search & Filter](../../week-4/task-4.1/INSTRUCTIONS.md)

---

## Week 3 Complete!

Congratulations on finishing Week 3! You've built a complete backend:

- Database schema design
- REST API endpoints
- Frontend-API integration
- Error handling
- User authentication
- API documentation

Next week, you'll add polish features and deploy your app!
