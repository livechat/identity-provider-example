## Introduction

This project suites as an example of using `custom_identity_provider` feature of LiveChat Chat Widget together with own web services.
It presents a use case of binding own users identity together with LiveChat Customer identity in order to provide more seamless experience for the User.

The `signup` process of the new user creates the dedicated LiveChat customer as also updates its metadata with the data provided by the user.

During `signin` process not only the user is authorized to access the profile page but also the LiveChat Chat Widget is loaded and it fetches the `/auth/lc/token` endpoint to retriev access token for the customer asociated with the current user.

Thanks to maintaining the conection between application user and LiveChat Customer the chat history and identity can be both restored on multiple devices and sessions after succesful `signin`.

## Local configuration

### Create LiveChat integration

In order to succesfully run Customer authorization for LiveChat licencse the custom integration application needs to be created on that license. To do so go to [Developers Console](https://developers.livechat.com/console), create new application and then follow the [Step 1 Configure the Authorization building block](https://developers.labs.livechat.com/docs/authorization/authorization-in-practice/#step-1-configure-the-authorization-building-block) instructions.

**Remember that you do not need to specify any special _Access scopes_**

### Create configuration file

To properly run an app locally create a simple configuration file `.env.local` at the top of the project directory with the following content:

```env
SECRET=''
LC_CLIENT_ID=''
NEXT_PUBLIC_LC_LICENSE_ID=''
```

Replace missing values with:

- `SECRET`: secret used as [JWT](https://jwt.io/introduction) signature, for example [Random UUID](https://www.uuidgenerator.net/version4)
- `LC_CLIENT_ID`: integration's client_id from [Developers Console](https://developers.livechat.com/console)
- `NEXT_PUBLIC_LC_LICENSE_ID`: LiveChat license id

## Getting Started

First, install dependeicies:

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

And lasty, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The app views are stored in `pages` directory. Each file coresponds to a separeted React page.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.
