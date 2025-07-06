# Proyecto de Arquitectura en Google Cloud 🌥️

Este repositorio contiene un ejemplo sencillo que demuestra cómo desplegar una
aplicación de backend y un frontend en Google Cloud haciendo uso de
contenedores, infraestructura como código y prácticas básicas de CI/CD y
seguridad.

## 1. Componentes Simulados

### Backend
- Implementado con **FastAPI** en `proyecto-gcp/backend`.
- Expone dos rutas:
  - `/health` devuelve `{"status": "OK"}`.
  - `/mesas` devuelve un JSON estático con la información de mesas.
- Contenerizado mediante un `Dockerfile` y pensado para ejecutarse en Cloud
  Run o en un clúster de GKE.

### Frontend
- Aplicación estática ubicada en `proyecto-gcp/frontend` que realiza un
  `fetch` al endpoint `/mesas` y muestra los datos en pantalla.
- Se sirve en un contenedor NGINX muy ligero.

## 2. Despliegue en la nube

La solución puede desplegarse en **Cloud Run** o en **GKE**. Para un entorno de
pruebas y bajo costo, se recomienda Cloud Run por su simplicidad y escalado a
cero. Si se desea una orquestación más compleja (por ejemplo, múltiples
servicios y control detallado de networking), GKE es una buena opción.

Se habilita el autoescalado para ambos servicios para asegurar que responden a
la demanda sin desperdiciar recursos.

La base de datos se aloja en **Cloud SQL** (PostgreSQL/MySQL) y el backend se
conecta de manera segura mediante Private IP o el Proxy de Cloud SQL.

## 3. Infraestructura como Código

Toda la infraestructura se define en Terraform (carpeta `infra/`), la cual
provisiona:

- VPC y subredes.
- Reglas de firewall.
- Instancia de Cloud SQL.
- Repositorio en Artifact Registry.
- Servicios de Cloud Run (o clúster GKE).

Para desplegar todo simplemente ejecutar:

```bash
terraform init
terraform apply
```

## 4. CI/CD con Cloud Build

Un archivo `cloudbuild.yaml` (no incluido aún) se activa con cada `git push` a la
rama principal y realiza los siguientes pasos:

1. Construye las imágenes de Docker de backend y frontend.
2. Las publica en Google Artifact Registry.
3. Despliega la nueva versión en Cloud Run o en el clúster GKE.

## 5. Monitoreo y Logs

Las aplicaciones envían sus logs a **Cloud Logging** de forma automática.
Se puede crear un dashboard en **Cloud Monitoring** para visualizar métricas
como número de peticiones, latencia y uso de CPU. Además, el backend expone un
endpoint `/metrics` para facilitar la recolección de estadísticas.

## 6. Seguridad

- Uso de **Service Accounts** con los permisos mínimos necesarios para cada
  componente.
- Reglas de **firewall** que restringen el acceso a la base de datos
  únicamente desde el backend.
- Gestión de credenciales a través de **Secret Manager**, evitando incluir
  secretos en el código.

## 7. Automatización opcional con n8n

Como complemento, se puede crear un workflow en n8n que cada 15 minutos haga
una solicitud al endpoint `/health`. Si no recibe respuesta, enviará una
notificación a Slack o Discord. Esto permite demostrar capacidades de
automatización y monitoreo activo.

## 8. Diagrama de Arquitectura

```
[ Usuario ] → [ Cloud Run Frontend ] → [ Cloud Run Backend ] → [ Cloud SQL ]
                             ↘                                ↑
                               └─────── Logging / Monitoring ──┘
```

Este esquema resume la interacción básica entre los componentes en Google
Cloud.

## 9. Verificación y gestión de secretos

1. Revisar en Cloud Logging que los logs de backend y frontend estén llegando
   correctamente.
2. Consultar el dashboard de Cloud Monitoring para observar métricas de latencia
   y tráfico.
3. Acceder a Secret Manager para asegurar que las credenciales de la base de
   datos están almacenadas y que la aplicación las consulta mediante variables
   de entorno.

---

¡Con esto tendrás una base sólida para desplegar y administrar tu aplicación en
Google Cloud! 🚀
