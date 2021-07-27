# Stage 1
FROM registry.il2.dso.mil/platform-one/devops/pipeline-templates/ironbank/nodejs14:14.16.1 AS builder

USER root

WORKDIR /app

COPY . .

RUN npm run build

USER node
# Stage 2
FROM registry.il2.dso.mil/platform-one/devops/pipeline-templates/base-image/harden-nginx-19:1.19.9

USER 0

COPY --from=builder --chown=appuser:appuser /app/build /var/www

USER appuser

EXPOSE 8080

CMD [ "nginx", "-g", "daemon off;" ]
