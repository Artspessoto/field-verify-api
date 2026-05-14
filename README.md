# FieldVerify API

FieldVerify is an application designed to manage field audit workflows and prevent fraud during B2B merchant onboarding. It was developed to solve a common problem in fintechs and payment companies: the registration of non-existent merchants (shell companies or "ghost merchants").

The concept is straightforward: instead of relying solely on documents submitted online, the system requires a field auditor/agent to visit the physical location. The app ensures the auditor was actually present and spent enough time verifying the establishment before any credit limits are granted.

## Technical Challenges

- **Location Validation (GPS):** It is not enough for the agent to claim they are on-site. The system performs a geolocation calculation and only allows the audit to begin if the agent is within 100 meters of the registered address.

- **Time-Based-Validation:** To prevent agents from rushing through the process without proper inspection, a rule is implemented where the audit can only be finalized after at least 20 minutes of stay at the location.

- **Access Control (RBAC):** Permissions are strictly separated between what an Agent (field visitor) can perform and what a Supervisor (report reviewer) can access.

# Tech Stack

- Node.js & Fastify
- TypeScript
- Prisma ORM
- PostgreSQL (Docker)
- Zod
- tsup & tsx (build)
- Vitest

## FRs (Functional Requirements)

### Access Management

- [ ] User Registration: Ability to register agents and supervisors.
- [ ] Authentication: Login via email and password (JWT).
- [ ] Identity Verification: Email verification through tokens.
- [ ] Password Recovery: Request password changes via email.
- [ ] Profile: Access the profile data of the currently logged-in user.

### Field Operations

- [ ] Proximity Search: Find merchants within a 10km radius.
- [ ] Merchant Search: Search for merchants by name or CNPJ (Tax ID).
- [ ] Audit Check-in: Perform a check-in upon arrival at the merchant's location.
- [ ] Photographic Evidence: Agents must attach at least 3 photos (frontage, interior, and proof of address) to complete the audit.
- [ ] Validation: Complete the audit only after the minimum required stay duration.
- [ ] History: Access the audit history performed by the agent.

### Administrative

- [ ] Merchant Management: Register and edit merchants for the audit queue.
- [ ] Monitoring: Supervisors can view audits flagged as suspicious of fraud.

## Business Rules

- Unique Email: Users cannot register with a duplicate email address.
- Mandatory Verification: Agents can only start audits if their email has been verified.
- Daily Limit: Agents cannot perform two audits for the same merchant on the same day.
- Distance Lock: Audits cannot be started if the current GPS coordinates are more than 100m away from the registered establishment.
- Time Lock: Audits can only be validated/completed at least 20 minutes after the initial check-in.
- Access Level: Merchant registration and audit status changes (Approve/Reject) are exclusive to Administrators/Supervisors.
- Immutability: Once an audit is completed or rejected, its geolocation data cannot be altered.

## NFRs (Non-Functional Requirements)

- Cryptography: Passwords must be persisted using BcryptJS.
- Persistence: Data must be stored in a PostgreSQL database.
- Scalability: Merchant and audit listings must be paginated (20 items per page).
- Security: Users must be identified via JWT (JSON Web Token) with Refresh Token.
- Mandatory Upload: The audit status cannot be moved to COMPLETED until mandatory images are uploaded.
- Traceability: All tables must include automatic timestamps for creation and last update (`created_at`, `updated_at`).

# Run App

```bash
# Install dependencies
npm install

# Start database
docker-compose up -d

# Run migrations
npm run prisma:migrate -- --name initial_schema

# Dev mode
npm run start:dev

# Prima Studio (visual interface)
npm run prisma:studio
```
