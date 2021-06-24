## Introduction

This project is an example of using the `custom_identity_provider` feature of LiveChat Chat Widget and personal web service.
It presents a use case of binding own User's identity and LiveChat Customer identity to provide a more seamless experience for the User.

The `signup` process of the new User creates the dedicated LiveChat customer and updates its metadata with the data provided by the User.

During the `signin` process, the User is authorized to access the profile page. Then, the LiveChat Chat Widget is loaded and fetches the `/auth/lc/token` endpoint to retrieve an access token for the customer associated with the current User.

Thanks to maintaining the connection between the application user and LiveChat Customer, the chat history and identity can be restored on multiple devices and sessions after successful `signin'.

## Local configuration

### Create LiveChat integration

To successfully run Customer authorization for LiveChat license, the custom integration application needs to be created on that license. To do so, go to [Developers Console](https://developers.livechat.com/console), make a new application, and then follow the [Step 1 Configure the Authorization building block](https://developers.livechat.com/docs/authorization/authorization-in-practice/#step-1-configure-the-authorization-building-block) instructions.

**Remember for Authorization building block:**

- no particular _Access scopes_ needs to be specified
- the _Redirect URI whitelist_ needs to contain a `http://localhost:3000` address

### Create configuration file

To properly run an app locally, create a simple configuration file `.env.local` at the top of the project directory with the following content:

```
SECRET=''
LC_CLIENT_ID=''
NEXT_PUBLIC_LC_LICENSE_ID=''

```

Replace missing values with:

- `SECRET`: secret used as [JWT](https://jwt.io/introduction) signature, for example [Random UUID](https://www.uuidgenerator.net/version4)
- `LC_CLIENT_ID`: integration's client_id from [Developers Console](https://developers.livechat.com/console)
- `NEXT_PUBLIC_LC_LICENSE_ID`: LiveChat license id

## Getting Started

First, install dependencies:

```bash
npm install
# or
yarn
```

Then, run DB initial migration:

```bash
npm run db:migrate

# or

yarn db:migrate

```

And lastly, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The app views are stored in `pages` directory. Each file corresponds to a separated React page.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.
