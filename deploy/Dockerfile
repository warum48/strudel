# Panel server only. tools/serve.mjs uses nothing but node built-ins, so there
# is no install step and no build step: content (web/, tracks/, docs/, samples/)
# is bind-mounted from /opt/strudel at run time, see docker-compose.yml.
FROM node:22-alpine

WORKDIR /app
COPY package.json ./
COPY tools/serve.mjs ./tools/serve.mjs

ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=8093

EXPOSE 8093
CMD ["node", "tools/serve.mjs"]
