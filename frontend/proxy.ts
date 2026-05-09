import { NextRequest, NextResponse } from "next/server"
const proxy = async (request: NextRequest) => { 
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname === "/login" || pathname === "/signup";
  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }
   
  return NextResponse.next()
  
}
export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};

export default proxy