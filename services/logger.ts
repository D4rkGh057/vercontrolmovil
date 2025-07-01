interface LogLevel {
  DEBUG: 'DEBUG';
  INFO: 'INFO';
  WARN: 'WARN';
  ERROR: 'ERROR';
}

const LOG_LEVELS: LogLevel = {
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR'
};

class Logger {
  private isDevelopment = __DEV__;

  private formatMessage(level: keyof LogLevel, message: string, data?: any): string {
    const timestamp = new Date().toISOString();
    const baseMessage = `[${timestamp}] [${level}] ${message}`;
    
    if (data) {
      return `${baseMessage}\nData: ${JSON.stringify(data, null, 2)}`;
    }
    
    return baseMessage;
  }

  debug(message: string, data?: any) {
    if (this.isDevelopment) {
      console.log(this.formatMessage('DEBUG', message, data));
    }
  }

  info(message: string, data?: any) {
    if (this.isDevelopment) {
      console.info(this.formatMessage('INFO', message, data));
    }
  }

  warn(message: string, data?: any) {
    if (this.isDevelopment) {
      console.warn(this.formatMessage('WARN', message, data));
    }
  }

  error(message: string, error?: any) {
    if (this.isDevelopment) {
      console.error(this.formatMessage('ERROR', message, error));
    }
  }

  // Métodos específicos para login/auth
  loginAttempt(email: string) {
    this.info('🔐 Intento de login iniciado', { email });
  }

  loginSuccess(user: any) {
    this.info('✅ Login exitoso', { 
      userId: user?.id, 
      email: user?.email,
      nombre: user?.nombre 
    });
  }

  loginError(error: any, email?: string) {
    this.error('❌ Error en login', { 
      email, 
      error: error?.message || error,
      status: error?.response?.status,
      data: error?.response?.data 
    });
  }

  registerAttempt(userData: any) {
    this.info('📝 Intento de registro iniciado', {
      email: userData?.email,
      nombre: userData?.nombre,
      apellido: userData?.apellido,
      telefono: userData?.telefono,
      rol: userData?.rol
    });
  }

  registerSuccess() {
    this.info('✅ Registro exitoso');
  }

  registerError(error: any, email?: string) {
    this.error('❌ Error en registro', { 
      email, 
      error: error?.message || error,
      status: error?.response?.status,
      data: error?.response?.data 
    });
  }

  apiRequest(method: string, url: string, data?: any) {
    this.debug(`🌐 API Request: ${method.toUpperCase()} ${url}`, data);
  }

  apiResponse(method: string, url: string, status: number, data?: any) {
    this.debug(`📡 API Response: ${method.toUpperCase()} ${url} - ${status}`, data);
  }

  apiError(method: string, url: string, error: any) {
    this.error(`💥 API Error: ${method.toUpperCase()} ${url}`, {
      status: error?.response?.status,
      message: error?.message,
      data: error?.response?.data
    });
  }
}

export const logger = new Logger();