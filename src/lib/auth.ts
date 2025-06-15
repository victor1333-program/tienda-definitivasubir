import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { db } from "./db"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const user = await db.user.findUnique({
            where: {
              email: credentials.email
            }
          })

          if (!user || !user.password) {
            return null
          }

          // Verificar si el usuario tiene email verificado (en lugar de isActive)
          if (!user.emailVerified) {
            throw new Error('Email no verificado. Verifica tu email para activar la cuenta.')
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!isPasswordValid) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }
        } catch (error) {
          console.error('Error during authorization:', error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      console.log('Redirect callback:', { url, baseUrl })
      
      // Permitir URLs relativas directamente
      if (url.startsWith("/")) {
        console.log('Redirecting to relative URL:', `${baseUrl}${url}`)
        return `${baseUrl}${url}`
      }
      
      // Si es una URL completa del mismo dominio, permitir
      if (url.startsWith(baseUrl)) {
        console.log('Redirecting to same domain URL:', url)
        return url
      }
      
      // Por defecto, ir al admin después de login exitoso
      console.log('Redirecting to default admin page')
      return `${baseUrl}/admin`
    },
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          role: user.role,
        }
      }
      return token
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          role: token.role,
        }
      }
    },
  },
}