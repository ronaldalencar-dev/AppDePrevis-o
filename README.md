# Clima · Previsão do Tempo 

Um aplicativo moderno de previsão do tempo desenvolvido com Next.js, Tailwind CSS e Capacitor, fornecendo informações climáticas em tempo real para qualquer cidade do mundo.

##  Recursos

- **Previsão em Tempo Real:** Dados meteorológicos precisos alimentados pela API [Open-Meteo](https://open-meteo.com/).
- **Previsão de 5 Dias:** Acompanhe a temperatura, condições climáticas e muito mais para a próxima semana.
- **Geolocalização:** Obtenha o clima instantaneamente com base na sua localização atual.
- **Favoritos e Histórico:** Salve suas cidades favoritas para acesso rápido.
- **Temas Dinâmicos:** Suporte integrado a Modo Claro, Modo Escuro e Sincronização com o Sistema.
- **Multiplataforma:** Roda tanto como um Web App (PWA) moderno quanto como um aplicativo nativo para Android.

##  Tecnologias Utilizadas

- [Next.js](https://nextjs.org/) (App Router & Exportação Estática)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Capacitor](https://capacitorjs.com/) (Para compilação do APK nativo)

##  Como rodar o projeto

### Pré-requisitos
Certifique-se de ter o [Node.js](https://nodejs.org/) instalado em seu sistema. Para rodar a build nativa do Android, o [Android Studio](https://developer.android.com/studio) e o Java SDK são necessários.

### 1. Iniciar o Servidor Web (Desenvolvimento)
Clone o repositório, instale as dependências e inicie o projeto:

```bash
# Instalar dependências
npm install

# Iniciar o servidor local
npm run dev
```
O projeto estará rodando em `http://localhost:3000`.

### 2. Gerar o Aplicativo Android (APK)
Graças à integração com o Capacitor, você pode gerar um APK nativo deste projeto:

```bash
# 1. Faça a build da versão estática do Next.js
npm run build

# 2. Sincronize os arquivos estáticos com a pasta do Android
npx cap sync android

# 3. Abra o projeto no Android Studio
npx cap open android
```
*(Para compilar diretamente pelo terminal sem abrir o Android Studio, acesse a pasta `android` e execute `.\gradlew assembleDebug` no Windows).*

##  Créditos
Os dados climáticos deste aplicativo são fornecidos gratuitamente pela [Open-Meteo](https://open-meteo.com/).
