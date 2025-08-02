#  Digital Wallet Backend
 
 A secure and scalable backend API for a digital wallet system build Node.js, Express.js and Mongodb for schema Mongoose using Typescript.There will be three types of users here: User, Agent and Admin. They will be able to manage the MD wallet and accounts according to their roles.When a new user registers, he will be given a unique wallet for the new user. The user will be added to the role with that wallet.The user will be able to perform accordingly.

 **Live Demo**: https://digital-wallet-backend-six.vercel.app



##  Features

-  User registration/login, chagepassword with JWT.
-  Automatic wallet creation on registration.
-  Role-based access control (Admin, User, Agent)
-  wallet operations:
   - send money(user)
   - add money(user)
   - withdraw money(user)
   - view own transaction history(user)
   - view own information (user,wallet)
   - Agent Cash In/ Cash out.
- Transaction history tracking
- Error handling for meaningful response.

---

##  Tech Stack

- **Backend**: Node.js, Express.js, Typescript.
- **Database**: Mongodb, Mongoose
- **Auth**: JWT(Access + Refresh Token)
- **Validation**: zod
- **Deployment**: Vercel

---

## Role & Permission.
- **Admin**: Manage user/agent and monitor all transaction. 
- **Agent**: Perform Cash In/ Cash Out.
- **User**: Add money,send money, withdraw money view wallet/ transactions.

---
## API Endpoints.

### Auth
- POST: /api/v1/auth/register   -register new user
- POST: /api/v1/auth/login   -register new user
- POST: /api/v1/auth/refresh-token  - create new access token. 
- POST: /api/v1/auth/logout - logout user.
- POST: /api/v1/auth/change-password - change password.
---
### User
This is a protected route only for login user.
- POST: /api/v1/user/send-money  - send money to another user. provide(receiverId, amount)
- POST: /api/v1/user/add-money - add money provide (source, amount)
- POST: /api/v1/user/withdraw-money - withdraw money provide(amount, source)
- GET: /api/v1/user/transaction/me - show login user transaction.
- GET: /api/v1/user/me - show user own info and wallet.

---
### Agent
This is a protected route only for agent.

- POST: /api/v1/agent/cash-in  - for Cash In prvide (userId, amount)
- POST: /api/v1/agent/cash-out - for Cash Out prvide (userId, amount)

---
### Admin
This is a protected route only for admin.Admin must be login for this operation. 

- GET: /api/v1/admin/users - see all user only.
- GET: /api/v1/admin/agent - see agent only.
- GET: /api/v1/admin/wallets - see wallet with sorting and paginate.
- GET: /api/v1/admin/transactions - see transactions with sorting and paginate.
- PATCH: /api/v1/admin/block-wallet/:id - block wallet.
- PATCH: /api/v1/admin/unblock-wallet/:id - unblock wallet.
- PATCH: /api/v1/admin/promote-agent/:id - user promote to agent.
- PATCH: /api/v1/admin/approve-agent/:id - when agent is suspend to active using this route.
- PATCH: /api/v1/admin/suspend-agent/:id - when agent is active to suspend using this route.

---










