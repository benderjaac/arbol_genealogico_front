# Sistema de Finanzas Personales - SPA - Angular

FrontEnd para mi sistema personal de finanzas

### Caracteristicas del sistema

Administracion de usuarios por medio de permisos y perfiles
Login | Registro
Adminstracion de Gastos e ingresos | Consultas, Altas, Actualizacion y Eliminacion
Administracion de Ahorros | Consultas, Altas, Actualizacion y Eliminacion | Abonos por ahorros
Administracion de categorias de gastos e ingresos
Graficas comparativas

## Instalacion, prerequisitos

### 1.- Instalar herramientas de desarrollo:

1.1 node y npm

https://nodejs.org/es/download

1.2 Instalar angular/cli: En una terminal ejecutar 

```
npm install -g @angular/cli
```

1.3 Instalar git y configurar

https://git-scm.com/downloads

1.4 Instalar editor VSCode

https://code.visualstudio.com/download

### 2.- Descargar/clonar este repositorio en la ruta de su elección.

### 3.- Instalar dependencias del proyecto.

En una terminal, ubicarse en la carpeta del proyecto, o abrir el proyecto con VSCode y en la terminal ejecutar:

```
npm install
```

### 4.- Ejecutar en modo desarrollo

Para ejecutar el proyecto en modo desarrollo, y en el ambiente de desarrollo (peticion a back-dev)
Ejecutar el comando: 

```
npn run start:dev
```

Tambien estan disponibles los ambientes:
qa y prod

### 5 Compilación

Para compilar el proyecto para los distintos ambientes ejecutar los sifuientes comandos, segun sea el caso:

```
npn run build:dev
npn run build:qa
npn run build:prod

```

El compilado se almacenarán en el directorio del mismo proyecto `dist/primeng/browser`.
Listo para subir a los servidores por FTP.

### Configuracion de ambientes

Para las configuraciones de las variables de entorno, acceder a la carpeta `src/environments`

### Tecnologías usadas

* Angular version 19.2.0
* Node.js 22.17.1
* npm 10.9.2

* primeng (https://primeng.org/)
* TailwindCSS (https://tailwindcss.com/)
