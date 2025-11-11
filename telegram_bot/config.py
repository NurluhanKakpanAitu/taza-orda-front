"""
Конфигурация Telegram бота
"""
import os
from typing import Set
from dotenv import load_dotenv

load_dotenv()

# Telegram Bot Token
BOT_TOKEN = os.getenv("BOT_TOKEN", "")

# Admin настройки
ADMIN_CHAT_ID = 125691222
ADMIN_IDS: Set[int] = {125691222}

# База данных
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///bot_database.db")

# API настройки вашего backend
BACKEND_API_URL = os.getenv("BACKEND_API_URL", "http://localhost:8000")
BACKEND_API_KEY = os.getenv("BACKEND_API_KEY", "")

# Проверка обязательных параметров
if not BOT_TOKEN:
    raise ValueError("BOT_TOKEN не указан в .env файле!")
