# base node image
FROM node:16-bullseye-slim as base

# set for base and all layer that inherit from it
ENV NODE_ENV production

# Install openssl for Prisma
RUN apt-get update && apt-get install -y openssl

# Install all node_modules, including dev dependencies
FROM base as deps

WORKDIR /frontend

ADD package.json package-lock.json ./
RUN npm install --production=false

# Setup production node_modules
FROM base as production-deps

WORKDIR /frontend

COPY --from=deps /frontend/node_modules /frontend/node_modules
ADD package.json package-lock.json ./
RUN npm prune --production

# Build the app
FROM base as build

WORKDIR /frontend

COPY --from=deps /frontend/node_modules /frontend/node_modules

ADD prisma .
RUN npx prisma generate

ADD . .
RUN npm run build

# Finally, build the production image with minimal footprint
FROM base

WORKDIR /frontend

COPY --from=production-deps /frontend/node_modules /frontend/node_modules
COPY --from=build /frontend/node_modules/.prisma /frontend/node_modules/.prisma

COPY --from=build /frontend/build /frontend/build
COPY --from=build /frontend/public /frontend/public
ADD . .

CMD ["npm", "start"]
