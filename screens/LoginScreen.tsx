import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { Container } from '../components/Container';
import { useAuthStore } from '../stores/authStore';
import { logger } from '../services/logger';

const LoginForm = ({
  isRegister,
  isLoading,
  email,
  setEmail,
  password,
  setPassword,
  nombre,
  setNombre,
  apellido,
  setApellido,
  telefono,
  setTelefono,
  validateEmail,
  validatePassword,
  isFormValid,
  handleRegister,
  handleLogin
}: {
  isRegister: boolean;
  isLoading: boolean;
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  nombre: string;
  setNombre: (v: string) => void;
  apellido: string;
  setApellido: (v: string) => void;
  telefono: string;
  setTelefono: (v: string) => void;
  validateEmail: (email: string) => boolean;
  validatePassword: (password: string) => boolean;
  isFormValid: () => boolean;
  handleRegister: () => void;
  handleLogin: () => void;
}) => (
  <View className="mb-6">
    {isRegister && (
      <>
        <View className="mb-4">
          <Text className="text-gray-700 mb-2 font-medium">Nombre *</Text>
          <TextInput
            className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
            placeholder="Ingresa tu nombre"
            value={nombre}
            onChangeText={setNombre}
            autoCapitalize="words"
            editable={!isLoading}
          />
        </View>

        <View className="mb-4">
          <Text className="text-gray-700 mb-2 font-medium">Apellido *</Text>
          <TextInput
            className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
            placeholder="Ingresa tu apellido"
            value={apellido}
            onChangeText={setApellido}
            autoCapitalize="words"
            editable={!isLoading}
          />
        </View>

        <View className="mb-4">
          <Text className="text-gray-700 mb-2 font-medium">Teléfono</Text>
          <TextInput
            className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
            placeholder="Ingresa tu teléfono"
            value={telefono}
            onChangeText={setTelefono}
            keyboardType="phone-pad"
            editable={!isLoading}
          />
        </View>
      </>
    )}

    <View className="mb-4">
      <Text className="text-gray-700 mb-2 font-medium">Email *</Text>
      <TextInput
        className={`bg-white border rounded-lg px-4 py-3 text-gray-800 ${
          email && !validateEmail(email) ? 'border-red-300' : 'border-gray-300'
        }`}
        placeholder="ejemplo@correo.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        editable={!isLoading}
      />
      {email && !validateEmail(email) && (
        <Text className="text-red-500 text-sm mt-1">Ingresa un email válido</Text>
      )}
    </View>

    <View className="mb-6">
      <Text className="text-gray-700 mb-2 font-medium">Contraseña *</Text>
      <TextInput
        className={`bg-white border rounded-lg px-4 py-3 text-gray-800 ${
          password && !validatePassword(password) ? 'border-red-300' : 'border-gray-300'
        }`}
        placeholder="Mínimo 6 caracteres"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        editable={!isLoading}
      />
      {password && !validatePassword(password) && (
        <Text className="text-red-500 text-sm mt-1">
          La contraseña debe tener al menos 6 caracteres
        </Text>
      )}
    </View>

    <TouchableOpacity
      className={`rounded-lg py-4 mb-4 ${
        isFormValid() && !isLoading ? 'bg-blue-500' : 'bg-gray-300'
      }`}
      onPress={isRegister ? handleRegister : handleLogin}
      disabled={!isFormValid() || isLoading}
    >
      {isLoading ? (
        <View className="flex-row items-center justify-center">
          <ActivityIndicator color="white" size="small" />
          <Text className="text-white font-semibold ml-2">
            {isRegister ? 'Registrando...' : 'Iniciando sesión...'}
          </Text>
        </View>
      ) : (
        <Text className="text-white font-semibold text-center text-lg">
          {isRegister ? 'Crear cuenta' : 'Iniciar sesión'}
        </Text>
      )}
    </TouchableOpacity>
  </View>
);

export const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [telefono, setTelefono] = useState('');

  const { login, register, isLoading } = useAuthStore();

  const handleLogin = async () => {
    logger.info('🚀 Iniciando proceso de login desde LoginScreen', {
      email,
      passwordLength: password.length,
      hasEmail: !!email,
      hasPassword: !!password
    });

    if (!email || !password) {
      logger.warn('❌ Campos faltantes en login', {
        hasEmail: !!email,
        hasPassword: !!password
      });
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    logger.info('✅ Validación de campos completada, ejecutando login');

    try {
      await login(email, password);
      logger.info('🎉 Login completado exitosamente desde LoginScreen');
      Alert.alert('Éxito', 'Inicio de sesión exitoso');
    } catch (error: any) {
      logger.error('💥 Error en handleLogin', {
        error: error.message,
        email
      });
      Alert.alert('Error', error.message);
    }
  };

  const handleRegister = async () => {
    const userData = {
      email,
      password,
      nombre,
      apellido,
      telefono,
      rol: 'cliente'
    };

    logger.info('🚀 Iniciando proceso de registro desde LoginScreen', {
      ...userData,
      password: '[HIDDEN]', // No loggear la contraseña real
      passwordLength: password.length
    });

    if (!email || !password || !nombre || !apellido) {
      logger.warn('❌ Campos requeridos faltantes en registro', {
        hasEmail: !!email,
        hasPassword: !!password,
        hasNombre: !!nombre,
        hasApellido: !!apellido
      });
      Alert.alert('Error', 'Por favor completa todos los campos requeridos');
      return;
    }

    logger.info('✅ Validación de campos completada, ejecutando registro');

    try {
      await register(userData);
      
      logger.info('🎉 Registro completado exitosamente desde LoginScreen');
      Alert.alert(
        'Éxito', 
        'Registro exitoso. Ahora puedes iniciar sesión', 
        [{ text: 'OK', onPress: () => setIsRegister(false) }]
      );
      resetForm();
    } catch (error: any) {
      logger.error('💥 Error en handleRegister', {
        error: error.message,
        email: userData.email
      });
      Alert.alert('Error', error.message);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setNombre('');
    setApellido('');
    setTelefono('');
  };

  const toggleMode = () => {
    logger.info(`🔄 Cambiando modo: ${isRegister ? 'login' : 'register'} -> ${!isRegister ? 'login' : 'register'}`);
    setIsRegister(!isRegister);
    resetForm();
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const isFormValid = () => {
    if (isRegister) {
      return validateEmail(email) && 
             validatePassword(password) && 
             nombre.length > 0 && 
             apellido.length > 0;
    }
    return validateEmail(email) && password.length > 0;
  };

  return (
    <Container>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 justify-center px-6">
          {/* Header */}
          <View className="items-center mb-8">
            <Text className="text-6xl mb-4">🐾</Text>
            <Text className="text-3xl font-bold text-gray-800 mb-2">VetControl</Text>
            <Text className="text-lg text-gray-600 text-center">
              {isRegister ? 'Crear cuenta nueva' : 'Gestiona la salud de tus mascotas'}
            </Text>
          </View>

          {/* Form */}
          <LoginForm
            isRegister={isRegister}
            isLoading={isLoading}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            nombre={nombre}
            setNombre={setNombre}
            apellido={apellido}
            setApellido={setApellido}
            telefono={telefono}
            setTelefono={setTelefono}
            validateEmail={validateEmail}
            validatePassword={validatePassword}
            isFormValid={isFormValid}
            handleRegister={handleRegister}
            handleLogin={handleLogin}
          />

          {/* Toggle Mode */}
          <View className="flex-row justify-center mb-6">
            <Text className="text-gray-600">
              {isRegister ? '¿Ya tienes cuenta? ' : '¿No tienes cuenta? '}
            </Text>
            <TouchableOpacity onPress={toggleMode} disabled={isLoading}>
              <Text className="text-blue-500 font-semibold">
                {isRegister ? 'Iniciar sesión' : 'Regístrate'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Demo Info */}
          <View className="p-4 bg-blue-50 rounded-lg">
            <Text className="text-blue-800 text-sm text-center font-medium mb-1">
              💡 Aplicación de demostración
            </Text>
            <Text className="text-blue-700 text-xs text-center">
              Usa cualquier email válido para probar la aplicación
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Container>
  );
};
