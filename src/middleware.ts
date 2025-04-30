import { auth } from "@/auth/authSetup"
export { auth } from "@/auth/authSetup"


export default auth((req) => {
    if (!req.auth && req.nextUrl.pathname !== "/login") {
      const newUrl = new URL("/login", req.nextUrl.origin)
      return Response.redirect(newUrl)
    }
  })