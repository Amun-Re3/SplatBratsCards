import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import clientPromise from "@/lib/mongodb"
import bcrypt from "bcryptjs"
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials")
        }

        const client = await clientPromise
        const db = client.db("sportsCards")
        const usersCollection = db.collection("users")

        const user = await usersCollection.findOne({ email: credentials.email })
        if (!user) {
          throw new Error("Invalid credentials")
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
        if (!isPasswordValid) {
          throw new Error("Invalid credentials")
        }

        return user
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      session.user.id = user._id.toString()
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export default NextAuth(authOptions)

