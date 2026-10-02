FROM node:latest
WORKDIR /app
COPY . .
RUN npm install
ENV NODE_ENV=production
ENV DATABASE_URL=postgres://tallybook_admin:Tallyb00k-Prod-2025!@tallybook-prod.c9x2.af-south-1.rds.example:5432/tallybook
EXPOSE 3000
CMD npm start
