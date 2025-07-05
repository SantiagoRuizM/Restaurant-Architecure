from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
import asyncio
from typing import Dict, Any
import logging

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Api para Google cloud",
    description="API de restaurante (I guess) Santiago Ruiz",
    version="1.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pasar datos a una estructura aparte fuera del main.py 
MESAS_DATA = {
    "mesas": [
        {
            "id": 1,
            "numero": "Mesa 01",
            "capacidad": 4,
            "estado": "disponible",
            "ubicacion": "terraza"
        },
        {
            "id": 2,
            "numero": "Mesa 02",
            "capacidad": 2,
            "estado": "ocupada",
            "ubicacion": "interior"
        },
        {
            "id": 3,
            "numero": "Mesa 03",
            "capacidad": 9,
            "estado": "reservada",
            "ubicacion": "interior"
        },
        {
            "id": 4,
            "numero": "Mesa 04",
            "capacidad": 9,
            "estado": "reservada",
            "ubicacion": "interior"
        },
        {
            "id": 5,
            "numero": "Mesa 05",
            "capacidad": 9,
            "estado": "disponible",
            "ubicacion": "terraza"
        }
    ]
}

@app.get("/")
async def root():
    """Endpoint raiz"""
    return {
        "service": "Active",
        "routes": ["/health", "/mesas"]
    }

@app.get("/health")
async def health_check():
    """Endpoint de health: Seguramente un servicio que este haciendo un chequeo constante al estado de la misma app"""
    logger.info("Health check solicitado")
    
    db_status = await check_database_connection()
    
    return {"status": "OK"}

@app.get("/mesas")
async def get_mesas():
    """Endpoint que devuelve información de mesas (simulado)"""
    logger.info("Solicitud de mesas recibida")
    
    try:
        # Simular pequeña latencia de base de datos
        await asyncio.sleep(0.1)
        
        return JSONResponse(
            content=MESAS_DATA,
            status_code=200
        )
    except Exception as e:
        logger.error(f"Error al obtener mesas: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Error interno del servidor"
        )

async def check_database_connection():
    """Simular verificación de conexión a base de datos"""
    try:
        # Aquí iría la verificación real de Cloud SQL
        # Por ahora simulamos que funciona
        await asyncio.sleep(0.05)
        return "connected"
    except Exception:
        return "disconnected"

@app.get("/metrics")
async def get_metrics():
    """Endpoint para métricas básicas (para monitoring)"""
    return {
        "requests_total": 1,  # En producción usaríamos un contador real
        "uptime_seconds": 3600,  # Simulated
        "memory_usage_mb": 128,  # Simulated
        "cpu_usage_percent": 15  # Simulated
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 8080)),
        reload=False
    )
