# SQUID Task (Business Discovery)

This is a very simple API used to obtain the closest businesses, given a `lat`, `long` & optionals `type` and `limit`. This server communicates with a MySQL server. See [How to Run Locally](#how-to-run-locally) for more information on how to get this running.

I used [NestJS](https://docs.nestjs.com/) to quickly set up a backend server, which, itself by default uses **Express**. **NestJS** easily allows us to use Dependency Injection, with Modules, Controllers & Services - as well as easily create entities to communicate with our MySQL server.

I've actually never used NestJS much (I've used very similar libraries instead), so this may not necessarily be best practices! But I quite like NestJS.

## Missing (at this time):

- Unit tests!

## How to Run Locally

1. Run `docker-compose up --build` at the root of this project. This will create the `businesses` table with the given sample data. This also starts up the MySQL server on Port **3306**.
   - Ensure you have Docker Compose [installed](https://docs.docker.com/compose/install/), as well as the [Docker Engine](https://docs.docker.com/engine/install/).
2. Ensure you have **Node 20** installed for this project.
   - You can quickly switch between Node versions using [NVM](https://github.com/nvm-sh/nvm). If using `nvm`, you can switch between versions using `nvm use 20` (after running `nvm install 20`).
3. Run an `npm install` to install all dependencies. This will also set up pre-commit hooks for development purposes - these hooks run linting & unit tests on pre-commits.
4. Start up the server using `npm run start:dev`. This runs the server in watch mode, on Port **3000**.

## How to Test Endpoint(s)

You could use Postman to test Endpoints, but in this case since we only have one endpoint, you can easily test using the `curl` command. See below examples!

#### Examples

##### Task 1:

- Simple query, `lat` and `long` only:
  - `curl "http://localhost:3000/discovery?lat=40.7128&long=-74.0060"`
    - Should return up to 10 closest businesses in order.
- Simple query, `lat` and `long`, non-numerical:
  - `curl "http://localhost:3000/discovery?lat=40.7128&long=hello:)"`
    - Should return a `400` error.
- Simple query, `lat` missing:
  - `curl "http://localhost:3000/discovery?long=hello:)"`
    - Should return a `400` error.

##### Task 2:

- Query with `lat`, `long` and `limit`:
  - `curl "http://localhost:3000/discovery?lat=40.7128&long=-74.0060&limit=5"`
    - Should return 5 closest businesses, in order.
- Query with `lat`, `long` and `limit`, non-numerical `limit`:
  - `curl "http://localhost:3000/discovery?lat=40.7128&long=-74.0060&limit=howdy"`
    - Should return a `400` error.

##### Task 3:

- Query with `lat`, `long`, `limit` and `type` (sample data only contains "**Cafe**" and "**Restaurant**", but feel free to add more!):
  - `curl "http://localhost:3000/discovery?lat=40.7128&long=-74.0060&limit=5&type=Cafe"`
    - Should return 5 closest cafes, in order.
- Query with `lat`, `long`, `limit` and `type` (with `type` in upper case):
  - `curl "http://localhost:3000/discovery?lat=40.7128&long=-74.0060&limit=5&type=CAFE"`
    - Should return 5 closest cafes, in order.
- Query with `lat`, `long`, `limit` and `type` (with `type` being an invalid business)
  - `curl "http://localhost:3000/discovery?lat=40.7128&long=-74.0060&limit=5&type=5"`
    - Should return an empty array.

## Possible Improvements (for scaling, deployment, etc)

### Authentication & Middleware

- Middleware. We could also implement authentication here, but it's not super important in this case as we're not writing anything to the DB and it's not sensitive data.
  - But if we wanted to provide more capabilities, this would be crucial.

### DB-related

- We could try to include more information on the `businesses` table such as the closing time, opening time, etc so that we give businesses only that are open.
- We also would need to ensure the DB gets deployed somewhere. On AWS this would be on `RDS`, in GCP (from a quick Google search), this seems to be `Cloud SQL`.

### Deployment-related

- Dockerizing the application itself. If we were to deploy this anywhere, we'd need to do this either way - but even for local setup it would ensure the application would work on all developers' machines for sure!
- In AWS, we could use something like `ECS` then to deploy a Fargate task. In GCP (from a quick Google search), we could use Cloud Run. Alternatively, use `k8s` to deploy to `EKS`/`GKE`.

### API-related

- More endpoints - e.g. we could allow certain users to create businesses, as well as retrieve more data about specific businesses, etc. This is where authentication would become significantly more important.
- Perhaps an `OpenAPI` spec to provide more information on this service's capabilities, generating API docs, clients, etc etc.
- We **could** consider using GraphQL here as well. But for this task, it would've been overkill!

### DevOps/Project health-related

- Adding pipelines perhaps using either GitHub Actions, GitLab CI/CD, Jenkins, or Cloud Build (on GCP). Benefits include:
  - Running lint, unit tests in a runner.
  - Deploying to different environments (Developer, Staging, Production - etc).
  - Running integration tests against endpoints after deployment to ensure functionality works as expected.
- Adding some form of a static code analysis tool such as [SonarQube](https://www.sonarsource.com/products/sonarqube/).
- Adding some form of error observation tool such as [Sentry](https://sentry.io/welcome/). Allows us to action on errors before it reaches the customer.
- Adding a security tool such as [Snyk](https://snyk.io/) to ensure we maintain good security standards, not using outdated dependencies, etc.
