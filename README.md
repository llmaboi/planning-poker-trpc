# Testing ssl

```bash
openssl req -newkey rsa:2048 -new -nodes -keyout key.pem -out csr.pem
openssl x509 -req -days 365 -in csr.pem -signkey key.pem -out server.crt
```

# Old package.json

```
  "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",

    // "build": "tsc",
    "dev:server": "tsx watch src/server",
    "dev:client": "wait-port 3030 && tsx watch src/web",
    // "dev": "run-p dev:* --print-label",
```

# Fastify adapter example

- Fastify server with WebSocket
- Simple TRPC client in node
- Try it live on [CodeSandbox](https://codesandbox.io/s/github/trpc/trpc/tree/main/examples/fastify-server)
- Adapter [documentation](https://trpc.io/docs/fastify)

If you want to test this example locally, follow the steps below.

### Clone, Install and build main projet

```bash
git clone git@github.com:trpc/trpc.git
cd ./trpc
yarn
yarn dev
```

### Install fastify example and run it in dev mode

```bash
cd ./examples/fastify-server
yarn
yarn dev
```

### If you want you can build and start from the fresh build

```bash
yarn build
yarn start
```

---

Created by [skarab42](https://github.com/skarab42)
